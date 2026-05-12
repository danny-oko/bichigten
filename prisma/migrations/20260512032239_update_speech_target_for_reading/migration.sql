-- CreateEnum
CREATE TYPE "ReadingDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "SpeechAttempts" DROP CONSTRAINT IF EXISTS "SpeechAttempts_targetId_fkey";

-- DropForeignKey
ALTER TABLE "SpeechAttempts" DROP CONSTRAINT IF EXISTS "SpeechAttempts_userId_fkey";

-- RenameTable
ALTER TABLE "SpeechTargets" RENAME TO "speech_targets";

-- RenameTable
ALTER TABLE "SpeechAttempts" RENAME TO "speech_attempts";

-- RenameConstraint
ALTER TABLE "speech_targets" RENAME CONSTRAINT "SpeechTargets_pkey" TO "speech_targets_pkey";

-- RenameConstraint
ALTER TABLE "speech_attempts" RENAME CONSTRAINT "SpeechAttempts_pkey" TO "speech_attempts_pkey";

-- RenameColumn
ALTER TABLE "speech_targets" RENAME COLUMN "expectedText" TO "cyrillicText";

-- AlterTable
ALTER TABLE "speech_targets"
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty" "ReadingDifficulty" NOT NULL DEFAULT 'EASY',
ADD COLUMN     "requiredAccuracy" INTEGER,
ADD COLUMN     "traditionalText" TEXT;

-- Preserve the previous expected text in both script fields until real traditional text is provided.
UPDATE "speech_targets"
SET "traditionalText" = "cyrillicText"
WHERE "traditionalText" IS NULL;

-- AlterTable
ALTER TABLE "speech_targets"
ALTER COLUMN "traditionalText" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "speech_attempts"
ADD COLUMN     "durationSec" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mistakes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "charactersRead" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wpm" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "speech_attempts"
ALTER COLUMN "durationSec" DROP DEFAULT,
ALTER COLUMN "mistakes" DROP DEFAULT,
ALTER COLUMN "accuracy" DROP DEFAULT,
ALTER COLUMN "charactersRead" DROP DEFAULT,
ALTER COLUMN "wpm" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "speech_attempts" ADD CONSTRAINT "speech_attempts_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "speech_targets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speech_attempts" ADD CONSTRAINT "speech_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
