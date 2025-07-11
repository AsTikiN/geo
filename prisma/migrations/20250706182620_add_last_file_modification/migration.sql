-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "jobNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastFileModification" DATETIME
);
INSERT INTO "new_Pit" ("createdAt", "id", "jobNumber", "lastFileModification", "month", "street", "updatedAt", "year") SELECT "createdAt", "id", "jobNumber", "lastFileModification", "month", "street", "updatedAt", "year" FROM "Pit";
DROP TABLE "Pit";
ALTER TABLE "new_Pit" RENAME TO "Pit";
CREATE UNIQUE INDEX "Pit_jobNumber_key" ON "Pit"("jobNumber");
CREATE UNIQUE INDEX "Pit_year_month_street_key" ON "Pit"("year", "month", "street");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
