/*
  Warnings:

  - You are about to drop the column `postalCode` on the `address` table. All the data in the column will be lost.
  - Added the required column `postal_code` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" DROP COLUMN "postalCode",
ADD COLUMN     "postal_code" TEXT NOT NULL;
