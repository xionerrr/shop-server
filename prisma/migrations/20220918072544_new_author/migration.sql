/*
  Warnings:

  - You are about to drop the column `authorId` on the `todos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_authorId_fkey";

-- AlterTable
ALTER TABLE "todos" DROP COLUMN "authorId",
ADD COLUMN     "authorEmail" TEXT;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_authorEmail_fkey" FOREIGN KEY ("authorEmail") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
