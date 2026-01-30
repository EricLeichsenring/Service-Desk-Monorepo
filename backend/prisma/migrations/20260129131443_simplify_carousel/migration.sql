/*
  Warnings:

  - You are about to drop the column `carouselId` on the `carouselslide` table. All the data in the column will be lost.
  - You are about to drop the `carousel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `carouselslide` DROP FOREIGN KEY `CarouselSlide_carouselId_fkey`;

-- AlterTable
ALTER TABLE `carouselslide` DROP COLUMN `carouselId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `carousel`;
