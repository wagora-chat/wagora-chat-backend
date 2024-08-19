/*
  Warnings:

  - You are about to drop the column `profile` on the `member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `member` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "member" DROP COLUMN "profile",
ADD COLUMN     "fileId" BIGINT;

-- CreateTable
CREATE TABLE "file" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "size" BIGINT NOT NULL,
    "mime" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" BIGINT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_file" (
    "room_id" BIGINT NOT NULL,
    "file_id" BIGINT NOT NULL,

    CONSTRAINT "room_file_pkey" PRIMARY KEY ("file_id","room_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_file_file_id_key" ON "room_file"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_fileId_key" ON "member"("fileId");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_file" ADD CONSTRAINT "room_file_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_file" ADD CONSTRAINT "room_file_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
