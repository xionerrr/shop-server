/*
  Warnings:

  - You are about to drop the column `authorEmail` on the `todos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_authorEmail_fkey";

-- AlterTable
ALTER TABLE "todos" DROP COLUMN "authorEmail",
ADD COLUMN     "authorId" INTEGER;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
