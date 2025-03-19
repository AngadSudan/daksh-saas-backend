/*
  Warnings:

  - The values [visible,hidden] on the enum `Visibility` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deadline` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Visibility_new" AS ENUM ('VISIBLE', 'HIDDEN');
ALTER TABLE "Todo" ALTER COLUMN "visibility" TYPE "Visibility_new" USING ("visibility"::text::"Visibility_new");
ALTER TYPE "Visibility" RENAME TO "Visibility_old";
ALTER TYPE "Visibility_new" RENAME TO "Visibility";
DROP TYPE "Visibility_old";
COMMIT;

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "visibility" SET DEFAULT 'VISIBLE';

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
