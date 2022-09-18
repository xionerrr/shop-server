-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_authorId_fkey";

-- AlterTable
ALTER TABLE "todos" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
