/*
  Warnings:

  - Added the required column `profile` to the `member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "member" ADD COLUMN     "profile" VARCHAR(100) NOT NULL;
