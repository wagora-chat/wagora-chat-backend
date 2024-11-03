/*
  Warnings:

  - Added the required column `fileKey` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "fileKey" VARCHAR(255) NOT NULL;
