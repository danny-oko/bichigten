-- Sync drift that already exists in the database

ALTER TABLE "lesson_contents_table"
ADD COLUMN IF NOT EXISTS "unicode" TEXT;

CREATE INDEX IF NOT EXISTS "user_lesson_progress_userId_status_completedAt_idx"
ON "user_lesson_progress"("userId", "status", "completedAt");