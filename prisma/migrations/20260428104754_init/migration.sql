-- AlterTable
ALTER TABLE "lessons_table" ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "lesson_contents_table" ADD COLUMN     "animationCss" TEXT;

-- AlterTable
ALTER TABLE "user_lesson_progress" DROP COLUMN "mistakeCount";

-- AlterTable
ALTER TABLE "users_table" DROP COLUMN "displayName",
DROP COLUMN "globalRanking",
DROP COLUMN "streak",
ADD COLUMN     "heartsRemaining" INTEGER NOT NULL DEFAULT 5;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_table_totalXp_idx" ON "users_table"("totalXp" DESC);
