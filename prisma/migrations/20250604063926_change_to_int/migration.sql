/*
  Warnings:

  - You are about to alter the column `order` on the `Row` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Row" ALTER COLUMN "order" SET DATA TYPE INTEGER;
