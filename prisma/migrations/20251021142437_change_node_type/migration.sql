/*
  Warnings:

  - The `type` column on the `nodes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "nodes" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'INITIAL';

-- DropEnum
DROP TYPE "public"."NodeType";
