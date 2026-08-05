/*
  Warnings:

  - Added the required column `pendingPayout` to the `Validator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Validator" ADD COLUMN     "pendingPayout" INTEGER NOT NULL;
