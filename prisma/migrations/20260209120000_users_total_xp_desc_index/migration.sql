-- CreateIndex
DO $$
BEGIN
    IF to_regclass('public.users_table') IS NOT NULL THEN
        CREATE INDEX IF NOT EXISTS "users_table_totalXp_idx" ON "users_table"("totalXp" DESC);
    END IF;
END $$;
