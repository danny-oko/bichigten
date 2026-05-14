import { Prisma } from "@prisma/client";

import { calculateReadingResult } from "@/app/(dashboard)/reading/lib/calculateReadingScore";
import prisma from "@/lib/prisma";

const RETRYABLE_TRANSACTION_CODES = new Set(["P2002", "P2034"]);

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

export const submitSpeechAttempt = async ({
  durationSec,
  targetId,
  transcribedText,
  userId,
}: SubmitSpeechAttemptInput) => {
  for (let attemptNumber = 1; attemptNumber <= 3; attemptNumber += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const target = await tx.speechTarget.findUniqueOrThrow({
            where: { id: targetId },
            select: {
              cyrillicText: true,
              lessonId: true,
              requiredAccuracy: true,
              xpReward: true,
            },
          });

          const result = calculateReadingResult(
            target.cyrillicText,
            transcribedText,
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

          const xpEarned =
            isPassed && !targetProgress.isPassed ? Math.max(0, target.xpReward) : 0;

          const speechAttempt = await tx.speechAttempt.create({
            data: {
              userId,
              targetId,
              lessonProgressId: lessonProgress?.id,
              transcribedText,
              durationSec,
              mistakes: result.mistakes,
              accuracy: result.accuracy,
              coverage: result.coverage,
              finalScore: result.finalScore,
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
            select: { id: true, accuracy: true },
          });

          await tx.userSpeechTargetProgress.update({
            where: { id: targetProgress.id },
            data: {
              latestAttemptId: speechAttempt.id,
              bestAttemptId: bestAttempt?.id ?? speechAttempt.id,
              latestAccuracy: result.accuracy,
              bestAccuracy: bestAttempt?.accuracy ?? result.accuracy,
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
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
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

export const getReadingCardsForUser = async ({
  difficulty,
  lessonId,
  search,
  userId,
}: GetReadingCardsForUserInput) => {
  const where: Prisma.SpeechTargetWhereInput = {};

  if (difficulty) where.difficulty = difficulty;
  if (lessonId) where.lessonId = lessonId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
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
  const [latestAttempts, bestAttempts, attemptProgressRows] = await Promise.all([
    prisma.speechAttempt.findMany({
      where: { userId, targetId: { in: targetIds } },
      select: { targetId: true, ...attemptSummarySelect },
      distinct: ["targetId"],
      orderBy: [{ targetId: "asc" }, { createdAt: "desc" }],
    }),
    prisma.speechAttempt.findMany({
      where: { userId, targetId: { in: targetIds } },
      select: { targetId: true, ...attemptSummarySelect },
      distinct: ["targetId"],
      orderBy: [
        { targetId: "asc" },
        { finalScore: "desc" },
        { accuracy: "desc" },
        { createdAt: "desc" },
      ],
    }),
    prisma.speechAttempt.groupBy({
      by: ["targetId", "isPassed"],
      where: { userId, targetId: { in: targetIds } },
      _sum: { xpEarned: true },
    }),
  ]);

  const latestAttemptByTargetId = new Map(
    latestAttempts.map((attempt) => [attempt.targetId, attempt]),
  );
  const bestAttemptByTargetId = new Map(
    bestAttempts.map((attempt) => [attempt.targetId, attempt]),
  );
  const xpEarnedByTargetId = new Map<string, number>();
  const passedTargetIds = new Set<string>();

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
    const isPassed = passedTargetIds.has(target.id);

    return {
      ...target,
      latestAttempt: latestAttemptByTargetId.get(target.id) ?? null,
      bestAttempt: bestAttemptByTargetId.get(target.id) ?? null,
      completed: isPassed,
      isPassed,
      xpEarned: xpEarnedByTargetId.get(target.id) ?? 0,
    };
  });
};
