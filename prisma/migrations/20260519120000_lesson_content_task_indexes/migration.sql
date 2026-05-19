-- Speed up lesson session loads (contents + tasks by lessonId).

CREATE INDEX IF NOT EXISTS "lesson_contents_table_lessonId_order_idx"
ON "lesson_contents_table"("lessonId", "order");

CREATE INDEX IF NOT EXISTS "tasks_table_lessonId_order_idx"
ON "tasks_table"("lessonId", "order");

CREATE INDEX IF NOT EXISTS "speech_targets_difficulty_createdAt_idx"
ON "speech_targets"("difficulty", "createdAt" DESC);
