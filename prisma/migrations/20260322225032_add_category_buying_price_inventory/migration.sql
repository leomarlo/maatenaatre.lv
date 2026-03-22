/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `purchasableOnline` on the `MenuItem` table. All the data in the column will be lost.
  - Added the required column `category` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "imageUrl",
DROP COLUMN "purchasableOnline",
ADD COLUMN     "buyingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "category" TEXT NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "supplier" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL DEFAULT '',
    "pricePerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costPerDosage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dosageDescription" TEXT NOT NULL DEFAULT '',
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'gab.',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);
