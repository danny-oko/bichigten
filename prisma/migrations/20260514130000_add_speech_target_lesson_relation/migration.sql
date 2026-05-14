-- Add an optional lesson relation to speech targets without rewriting existing rows.

ALTER TABLE "speech_targets"
ADD COLUMN IF NOT EXISTS "lessonId" TEXT;

ALTER TABLE "speech_targets"
ADD COLUMN IF NOT EXISTS "xpReward" INTEGER NOT NULL DEFAULT 10;

CREATE INDEX IF NOT EXISTS "speech_targets_lessonId_idx"
ON "speech_targets"("lessonId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'speech_targets_lessonId_fkey'
    ) THEN
        ALTER TABLE "speech_targets"
        ADD CONSTRAINT "speech_targets_lessonId_fkey"
        FOREIGN KEY ("lessonId")
        REFERENCES "lessons_table"("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    END IF;
END $$;
