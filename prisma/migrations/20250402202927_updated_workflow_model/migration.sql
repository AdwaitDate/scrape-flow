-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN "LastRunStatus" TEXT;
ALTER TABLE "Workflow" ADD COLUMN "lastRunAt" DATETIME;
ALTER TABLE "Workflow" ADD COLUMN "lastRunId" TEXT;
