-- CreateTable
CREATE TABLE "Pit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PitFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pitId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "filetype" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PitFile_pitId_fkey" FOREIGN KEY ("pitId") REFERENCES "Pit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Pit_year_month_street_key" ON "Pit"("year", "month", "street");

-- CreateIndex
CREATE UNIQUE INDEX "PitFile_filepath_key" ON "PitFile"("filepath");
