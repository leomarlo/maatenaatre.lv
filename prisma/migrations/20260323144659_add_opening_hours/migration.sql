-- CreateTable
CREATE TABLE "OpeningHours" (
    "dayOfWeek" INTEGER NOT NULL,
    "morningOpen" TEXT,
    "morningClose" TEXT,
    "eveningOpen" TEXT,
    "eveningClose" TEXT,

    CONSTRAINT "OpeningHours_pkey" PRIMARY KEY ("dayOfWeek")
);
