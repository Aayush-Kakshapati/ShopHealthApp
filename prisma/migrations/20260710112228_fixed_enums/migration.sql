/*
  Warnings:

  - Changed the type of `category` on the `CheckDefinition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `severity` on the `CheckDefinition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CheckDefinition" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL,
DROP COLUMN "severity",
ADD COLUMN     "severity" "Severity" NOT NULL;
