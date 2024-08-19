/*
  Warnings:

  - You are about to drop the column `memberId` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_id]` on the table `member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `member_id` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_memberId_fkey";

-- DropForeignKey
ALTER TABLE "member" DROP CONSTRAINT "member_fileId_fkey";

-- DropIndex
DROP INDEX "member_fileId_key";

-- AlterTable
ALTER TABLE "file" DROP COLUMN "memberId",
ADD COLUMN     "member_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "member" DROP COLUMN "fileId",
ADD COLUMN     "file_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "member_file_id_key" ON "member"("file_id");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;
