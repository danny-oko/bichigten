-- Add reading progress summary support without dropping or rewriting existing tables.

ALTER TABLE "speech_targets"
ADD COLUMN IF NOT EXISTS "isRequired" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "speech_attempts"
ADD COLUMN IF NOT EXISTS "lessonProgressId" TEXT,
ADD COLUMN IF NOT EXISTS "coverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "finalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "isPassed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "xpEarned" INTEGER NOT NULL DEFAULT 0;

UPDATE "speech_attempts"
SET "finalScore" = "accuracy"
WHERE "finalScore" = 0
  AND "accuracy" > 0;

CREATE TABLE IF NOT EXISTS "user_speech_target_progress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "latestAttemptId" TEXT,
    "bestAttemptId" TEXT,
    "passedAt" TIMESTAMP(3),
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "bestAccuracy" DOUBLE PRECISION,
    "latestAccuracy" DOUBLE PRECISION,
    CONSTRAINT "user_speech_target_progress_pkey" PRIMARY KEY ("id")
);

INSERT INTO "user_speech_target_progress" (
    "id",
    "createdAt",
    "updatedAt",
    "userId",
    "targetId",
    "latestAttemptId",
    "bestAttemptId",
    "passedAt",
    "isPassed",
    "xpEarned",
    "bestAccuracy",
    "latestAccuracy"
)
WITH latest_attempts AS (
    SELECT DISTINCT ON ("userId", "targetId")
        "userId",
        "targetId",
        "id",
        "createdAt",
        "accuracy"
    FROM "speech_attempts"
    ORDER BY "userId", "targetId", "createdAt" DESC, "id" DESC
),
best_attempts AS (
    SELECT DISTINCT ON ("userId", "targetId")
        "userId",
        "targetId",
        "id",
        "accuracy"
    FROM "speech_attempts"
    ORDER BY "userId", "targetId", "finalScore" DESC, "accuracy" DESC, "createdAt" DESC, "id" DESC
),
progress AS (
    SELECT
        a."userId",
        a."targetId",
        MIN(a."createdAt") FILTER (
            WHERE a."accuracy" >= COALESCE(t."requiredAccuracy", 0)
        ) AS "passedAt",
        BOOL_OR(a."accuracy" >= COALESCE(t."requiredAccuracy", 0)) AS "isPassed",
        MAX(a."xpEarned") AS "attemptXpEarned"
    FROM "speech_attempts" a
    JOIN "speech_targets" t ON t."id" = a."targetId"
    GROUP BY a."userId", a."targetId"
)
SELECT
    'ustp_' || md5(p."userId" || ':' || p."targetId"),
    la."createdAt",
    CURRENT_TIMESTAMP,
    p."userId",
    p."targetId",
    la."id",
    ba."id",
    p."passedAt",
    p."isPassed",
    CASE
        WHEN p."attemptXpEarned" > 0 THEN p."attemptXpEarned"
        WHEN p."isPassed" THEN GREATEST(0, t."xpReward")
        ELSE 0
    END,
    ba."accuracy",
    la."accuracy"
FROM progress p
JOIN latest_attempts la
  ON la."userId" = p."userId"
 AND la."targetId" = p."targetId"
JOIN best_attempts ba
  ON ba."userId" = p."userId"
 AND ba."targetId" = p."targetId"
JOIN "speech_targets" t ON t."id" = p."targetId"
ON CONFLICT DO NOTHING;

CREATE UNIQUE INDEX IF NOT EXISTS "user_speech_target_progress_userId_targetId_key"
ON "user_speech_target_progress"("userId", "targetId");

CREATE INDEX IF NOT EXISTS "user_speech_target_progress_userId_isPassed_idx"
ON "user_speech_target_progress"("userId", "isPassed");

CREATE INDEX IF NOT EXISTS "user_speech_target_progress_targetId_idx"
ON "user_speech_target_progress"("targetId");

CREATE INDEX IF NOT EXISTS "user_speech_target_progress_bestAttemptId_idx"
ON "user_speech_target_progress"("bestAttemptId");

CREATE INDEX IF NOT EXISTS "user_speech_target_progress_latestAttemptId_idx"
ON "user_speech_target_progress"("latestAttemptId");

CREATE INDEX IF NOT EXISTS "speech_attempts_lessonProgressId_idx"
ON "speech_attempts"("lessonProgressId");

CREATE INDEX IF NOT EXISTS "speech_attempts_userId_targetId_createdAt_idx"
ON "speech_attempts"("userId", "targetId", "createdAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'speech_attempts_lessonProgressId_fkey'
    ) THEN
        ALTER TABLE "speech_attempts"
        ADD CONSTRAINT "speech_attempts_lessonProgressId_fkey"
        FOREIGN KEY ("lessonProgressId")
        REFERENCES "user_lesson_progress"("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_speech_target_progress_userId_fkey'
    ) THEN
        ALTER TABLE "user_speech_target_progress"
        ADD CONSTRAINT "user_speech_target_progress_userId_fkey"
        FOREIGN KEY ("userId")
        REFERENCES "users_table"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_speech_target_progress_targetId_fkey'
    ) THEN
        ALTER TABLE "user_speech_target_progress"
        ADD CONSTRAINT "user_speech_target_progress_targetId_fkey"
        FOREIGN KEY ("targetId")
        REFERENCES "speech_targets"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_speech_target_progress_bestAttemptId_fkey'
    ) THEN
        ALTER TABLE "user_speech_target_progress"
        ADD CONSTRAINT "user_speech_target_progress_bestAttemptId_fkey"
        FOREIGN KEY ("bestAttemptId")
        REFERENCES "speech_attempts"("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_speech_target_progress_latestAttemptId_fkey'
    ) THEN
        ALTER TABLE "user_speech_target_progress"
        ADD CONSTRAINT "user_speech_target_progress_latestAttemptId_fkey"
        FOREIGN KEY ("latestAttemptId")
        REFERENCES "speech_attempts"("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    END IF;
END $$;
