-- Speed profile queries: completions by user + time window, weekly aggregate.
DO $$
BEGIN
    IF to_regclass('public.user_lesson_progress') IS NOT NULL THEN
        CREATE INDEX IF NOT EXISTS "user_lesson_progress_userId_status_completedAt_idx"
        ON "user_lesson_progress" ("userId", "status", "completedAt");
    END IF;
END $$;
