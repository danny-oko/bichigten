import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { calculateReadingResult } from "@/app/(dashboard)/reading/lib/calculateReadingScore";
import prisma from "@/lib/prisma";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";
import { CACHE_TAG_SPEECH, cacheTagUser } from "@/lib/server/cache-tags";

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
      return await prisma.$transaction(
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
            select: { id: true, isPassed: true, xpEarned: true },
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

          const bestAttempt = await tx.speechAttempt.findFirst({
            where: { userId, targetId },
            orderBy: [
              { finalScore: "desc" },
              { accuracy: "desc" },
              { createdAt: "desc" },
            ],
            select: { id: true, accuracy: true, finalScore: true },
          });

          await tx.userSpeechTargetProgress.update({
            where: { id: targetProgress.id },
            data: {
              latestAttemptId: speechAttempt.id,
              bestAttemptId: bestAttempt?.id ?? speechAttempt.id,
              latestAccuracy: result.accuracy,
              bestAccuracy: bestAttempt?.finalScore ?? result.accuracy,
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

          if (target.lessonId && isPassed) {
            const [requiredTargets, passedTargets] = await Promise.all([
              tx.speechTarget.count({
                where: { lessonId: target.lessonId, isRequired: true },
              }),
              tx.speechTarget.count({
                where: {
                  lessonId: target.lessonId,
                  isRequired: true,
                  progress: { some: { userId, isPassed: true } },
                },
              }),
            ]);

            if (requiredTargets > 0 && passedTargets === requiredTargets) {
              await tx.userLessonProgress.update({
                where: { userId_lessonId: { userId, lessonId: target.lessonId } },
                data: {
                  status: "COMPLETED",
                  completedAt: lessonProgress?.completedAt ?? new Date(),
                },
              });
            }
          }

          return speechAttempt;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 10_000,
          timeout: 20_000,
        },
      );
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
  const [latestAttempts, bestScoreRows, attemptProgressRows] = await Promise.all([
    prisma.speechAttempt.findMany({
      where: { userId, targetId: { in: targetIds } },
      select: { targetId: true, ...attemptSummarySelect },
      distinct: ["targetId"],
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.speechAttempt.groupBy({
      by: ["targetId"],
      where: { userId, targetId: { in: targetIds } },
      _max: { finalScore: true },
    }),
    prisma.speechAttempt.groupBy({
      by: ["targetId", "isPassed"],
      where: { userId, targetId: { in: targetIds } },
      _sum: { xpEarned: true },
    }),
  ]);

  const bestAttemptFilters = bestScoreRows.flatMap((row) =>
    row._max.finalScore === null
      ? []
      : [{ targetId: row.targetId, finalScore: row._max.finalScore }],
  );

  const bestAttempts =
    bestAttemptFilters.length > 0
      ? await prisma.speechAttempt.findMany({
          where: { userId, OR: bestAttemptFilters },
          select: { targetId: true, ...attemptSummarySelect },
          orderBy: [
            { finalScore: "desc" },
            { accuracy: "desc" },
            { createdAt: "desc" },
            { id: "desc" },
          ],
        })
      : [];

  const latestAttemptByTargetId = new Map(
    latestAttempts.map((attempt) => [attempt.targetId, attempt]),
  );
  const bestScoreByTargetId = new Map(
    bestScoreRows.map((row) => [row.targetId, row._max.finalScore ?? 0]),
  );
  const bestAttemptByTargetId = new Map<
    string,
    (typeof bestAttempts)[number]
  >();
  const xpEarnedByTargetId = new Map<string, number>();
  const passedTargetIds = new Set<string>();

  for (const attempt of bestAttempts) {
    if (!bestAttemptByTargetId.has(attempt.targetId)) {
      bestAttemptByTargetId.set(attempt.targetId, attempt);
    }
  }

  for (const row of attemptProgressRows) {
    xpEarnedByTargetId.set(
      row.targetId,
      (xpEarnedByTargetId.get(row.targetId) ?? 0) + (row._sum.xpEarned ?? 0),
    );

    if (row.isPassed) {
      passedTargetIds.add(row.targetId);
    }
  }

  return targets.map((target) => {
    const latestAttempt = latestAttemptByTargetId.get(target.id) ?? null;
    const bestAttempt = bestAttemptByTargetId.get(target.id) ?? null;
    const bestScore = Math.max(
      bestScoreByTargetId.get(target.id) ?? 0,
      latestAttempt?.finalScore ?? 0,
    );
    const isPassed = passedTargetIds.has(target.id);

    return {
      ...target,
      latestAttempt,
      bestAttempt: latestAttempt
        ? { ...(bestAttempt ?? latestAttempt), finalScore: bestScore }
        : null,
      completed: isPassed,
      isPassed,
      xpEarned: xpEarnedByTargetId.get(target.id) ?? 0,
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
