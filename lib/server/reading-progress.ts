import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { calculateReadingResult } from "@/app/(dashboard)/reading/lib/calculateReadingScore";
import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_SPEECH, cacheTagUser } from "@/lib/server/cache-tags";
import { ACCELERATE_INTERACTIVE_TX_OPTIONS } from "@/lib/server/prisma-transaction";

const RETRYABLE_TRANSACTION_CODES = new Set(["P2002", "P2028", "P2034"]);

export class ReadingAttemptError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ReadingAttemptError";
    this.status = status;
  }
}

const attemptSummarySelect = {
  id: true,
  createdAt: true,
  accuracy: true,
  finalScore: true,
  isPassed: true,
  xpEarned: true,
} satisfies Prisma.SpeechAttemptSelect;

export type SubmitSpeechAttemptInput = {
  durationSec: number;
  targetId: string;
  transcribedText: string;
  userId: string;
};

export type GetReadingCardsForUserInput = {
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  lessonId?: string;
  search?: string;
  userId: string | null;
};

const isRetryableTransactionError = (error: unknown): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    RETRYABLE_TRANSACTION_CODES.has(error.code)
  );
};

async function maybeMarkLessonCompleteFromSpeech(
  userId: string,
  lessonId: string,
  existingCompletedAt: Date | null | undefined,
) {
  const [requiredTargets, passedTargets] = await Promise.all([
    prisma.speechTarget.count({
      where: { lessonId, isRequired: true },
    }),
    prisma.speechTarget.count({
      where: {
        lessonId,
        isRequired: true,
        progress: { some: { userId, isPassed: true } },
      },
    }),
  ]);

  if (requiredTargets > 0 && passedTargets === requiredTargets) {
    await prisma.userLessonProgress.update({
      where: { userId_lessonId: { userId, lessonId } },
      data: {
        status: "COMPLETED",
        completedAt: existingCompletedAt ?? new Date(),
      },
    });
  }
}

const calculateEarnedXp = (finalScore: number, xpReward: number): number => {
  const reward = Math.max(0, xpReward);

  if (finalScore >= 90) return reward;
  if (finalScore >= 70) return Math.ceil(reward * 0.6);
  if (finalScore >= 50) return Math.ceil(reward * 0.3);
  if (finalScore > 0) return Math.ceil(reward * 0.1);
  return 0;
};

export const submitSpeechAttempt = async ({
  durationSec,
  targetId,
  transcribedText,
  userId,
}: SubmitSpeechAttemptInput) => {
  const cleanTranscription = transcribedText.trim();

  if (!targetId.trim()) {
    throw new ReadingAttemptError("targetId is required", 400);
  }
  if (!cleanTranscription) {
    throw new ReadingAttemptError("transcribedText cannot be empty", 400);
  }
  if (!Number.isFinite(durationSec) || durationSec <= 0) {
    throw new ReadingAttemptError("durationSec must be greater than 0", 400);
  }

  for (let attemptNumber = 1; attemptNumber <= 3; attemptNumber += 1) {
    try {
      const txResult = await prisma.$transaction(
        async (tx) => {
          const target = await tx.speechTarget.findUnique({
            where: { id: targetId },
            select: {
              cyrillicText: true,
              lessonId: true,
              requiredAccuracy: true,
              xpReward: true,
            },
          });

          if (!target) {
            throw new ReadingAttemptError("Reading target not found", 404);
          }

          const result = calculateReadingResult(
            target.cyrillicText,
            cleanTranscription,
            durationSec,
          );
          const requiredAccuracy = target.requiredAccuracy ?? 0;
          const isPassed = result.accuracy >= requiredAccuracy;

          const targetProgress = await tx.userSpeechTargetProgress.upsert({
            where: { userId_targetId: { userId, targetId } },
            update: { updatedAt: new Date() },
            create: { userId, targetId },
            select: {
              id: true,
              isPassed: true,
              xpEarned: true,
              bestAttemptId: true,
              bestAccuracy: true,
            },
          });

          const lessonProgress = target.lessonId
            ? await tx.userLessonProgress.upsert({
                where: {
                  userId_lessonId: { userId, lessonId: target.lessonId },
                },
                update: {},
                create: {
                  userId,
                  lessonId: target.lessonId,
                  status: "IN_PROGRESS",
                  xpEarned: 0,
                },
                select: { id: true, status: true, completedAt: true },
              })
            : null;

          if (lessonProgress?.status === "LOCKED") {
            await tx.userLessonProgress.update({
              where: { id: lessonProgress.id },
              data: { status: "IN_PROGRESS" },
            });
          }

          const potentialXp = calculateEarnedXp(result.accuracy, target.xpReward);
          const xpEarned = Math.max(0, potentialXp - targetProgress.xpEarned);

          const speechAttempt = await tx.speechAttempt.create({
            data: {
              userId,
              targetId,
              lessonProgressId: lessonProgress?.id,
              transcribedText: cleanTranscription,
              durationSec,
              mistakes: result.mistakes,
              accuracy: result.accuracy,
              coverage: result.accuracy,
              finalScore: result.accuracy,
              wordsRead: result.wordsRead,
              charactersRead: result.charactersRead,
              wpm: result.wpm,
              isPassed,
              xpEarned,
            },
          });

          const previousBest = targetProgress.bestAccuracy ?? 0;
          const isNewBest = result.accuracy >= previousBest;
          const bestAttemptId = isNewBest
            ? speechAttempt.id
            : (targetProgress.bestAttemptId ?? speechAttempt.id);
          const bestAccuracy = Math.max(previousBest, result.accuracy);

          await tx.userSpeechTargetProgress.update({
            where: { id: targetProgress.id },
            data: {
              latestAttemptId: speechAttempt.id,
              bestAttemptId,
              latestAccuracy: result.accuracy,
              bestAccuracy,
              isPassed: targetProgress.isPassed || isPassed,
              passedAt:
                !targetProgress.isPassed && isPassed ? speechAttempt.createdAt : undefined,
              xpEarned: xpEarned > 0 ? { increment: xpEarned } : undefined,
            },
          });

          if (xpEarned > 0) {
            await tx.user.update({
              where: { id: userId },
              data: { totalXp: { increment: xpEarned } },
            });

            if (lessonProgress) {
              await tx.userLessonProgress.update({
                where: { id: lessonProgress.id },
                data: { xpEarned: { increment: xpEarned } },
              });
            }
          }

          return {
            speechAttempt,
            lessonId: target.lessonId,
            isPassed,
            lessonCompletedAt: lessonProgress?.completedAt,
          };
        },
        ACCELERATE_INTERACTIVE_TX_OPTIONS,
      );

      const { speechAttempt, lessonId, isPassed, lessonCompletedAt } = txResult;

      if (lessonId && isPassed) {
        await maybeMarkLessonCompleteFromSpeech(
          userId,
          lessonId,
          lessonCompletedAt,
        );
      }

      return speechAttempt;
    } catch (error) {
      if (attemptNumber < 3 && isRetryableTransactionError(error)) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Failed to submit speech attempt");
};

async function getReadingCardsForUserUncached({
  difficulty,
  lessonId,
  search,
  userId,
}: GetReadingCardsForUserInput) {
  const where: Prisma.SpeechTargetWhereInput = {};

  if (difficulty) where.difficulty = difficulty;
  if (lessonId) where.lessonId = lessonId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { cyrillicText: { contains: search, mode: "insensitive" } },
    ];
  }

  const targets = await prisma.speechTarget.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      requiredAccuracy: true,
      xpReward: true,
      wordsCount: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!userId || targets.length === 0) {
    return targets.map((target) => ({
      ...target,
      latestAttempt: null,
      bestAttempt: null,
      completed: false,
      isPassed: false,
      xpEarned: 0,
    }));
  }

  const targetIds = targets.map((target) => target.id);
  const progressRows = await prisma.userSpeechTargetProgress.findMany({
    where: { userId, targetId: { in: targetIds } },
    select: {
      targetId: true,
      isPassed: true,
      xpEarned: true,
      bestAccuracy: true,
      latestAttempt: { select: attemptSummarySelect },
      bestAttempt: { select: attemptSummarySelect },
    },
  });

  const progressByTargetId = new Map(
    progressRows.map((row) => [row.targetId, row]),
  );

  return targets.map((target) => {
    const progress = progressByTargetId.get(target.id);
    const latestAttempt = progress?.latestAttempt ?? null;
    const bestAttemptRecord = progress?.bestAttempt ?? null;
    const bestScore = Math.max(
      progress?.bestAccuracy ?? 0,
      latestAttempt?.finalScore ?? 0,
    );
    const isPassed = progress?.isPassed ?? false;

    return {
      ...target,
      latestAttempt,
      bestAttempt: latestAttempt
        ? { ...(bestAttemptRecord ?? latestAttempt), finalScore: bestScore }
        : null,
      completed: isPassed,
      isPassed,
      xpEarned: progress?.xpEarned ?? 0,
    };
  });
}

export function getReadingCardsForUser(input: GetReadingCardsForUserInput) {
  const tags = [
    CACHE_TAG_SPEECH,
    ...(input.userId ? [cacheTagUser(input.userId)] : []),
  ];
  return unstable_cache(
    async () => getReadingCardsForUserUncached(input),
    [
      "getReadingCardsForUser",
      input.userId ?? "",
      input.difficulty ?? "",
      input.lessonId ?? "",
      input.search ?? "",
    ],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags },
  )();
}
