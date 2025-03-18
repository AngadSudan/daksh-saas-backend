-- CreateEnum
CREATE TYPE "Pinned" AS ENUM ('PINNED', 'UNPINNED');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "pinned" "Pinned" NOT NULL DEFAULT 'UNPINNED';
