-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initial" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "feedNote" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "initial" TEXT NOT NULL,
    "favourite" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedingSchedule" (
    "id" SERIAL NOT NULL,
    "plantId" INTEGER NOT NULL,
    "feed" TEXT NOT NULL,
    "everyDays" INTEGER NOT NULL,
    "activeMonths" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedingSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedRecord" (
    "id" SERIAL NOT NULL,
    "plantId" INTEGER NOT NULL,
    "byUserId" INTEGER NOT NULL,
    "feed" TEXT NOT NULL,
    "fedAt" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snooze" (
    "id" SERIAL NOT NULL,
    "plantId" INTEGER NOT NULL,
    "feed" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "deferToDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snooze_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- CreateIndex
CREATE INDEX "FeedingSchedule_plantId_idx" ON "FeedingSchedule"("plantId");

-- CreateIndex
CREATE INDEX "FeedRecord_plantId_fedAt_idx" ON "FeedRecord"("plantId", "fedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Snooze_plantId_feed_dueDate_key" ON "Snooze"("plantId", "feed", "dueDate");

-- AddForeignKey
ALTER TABLE "FeedingSchedule" ADD CONSTRAINT "FeedingSchedule_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedRecord" ADD CONSTRAINT "FeedRecord_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedRecord" ADD CONSTRAINT "FeedRecord_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snooze" ADD CONSTRAINT "Snooze_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
