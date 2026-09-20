-- CreateTable
CREATE TABLE "SmokeTest" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmokeTest_pkey" PRIMARY KEY ("id")
);
