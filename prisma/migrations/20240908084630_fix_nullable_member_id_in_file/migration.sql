/*
  Warnings:

  - You are about to drop the column `profile` on the `member` table. All the data in the column will be lost.
  - Made the column `file_id` on table `member` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_member_id_fkey";

-- DropForeignKey
ALTER TABLE "member" DROP CONSTRAINT "member_file_id_fkey";

-- DropIndex
DROP INDEX "member_file_id_key";

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "member_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "member" DROP COLUMN "profile",
ALTER COLUMN "file_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
