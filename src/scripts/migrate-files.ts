import fs from "fs/promises";
import path from "path";
import { getMonthName, getStoragePath } from "../lib/fs-utils";

async function migrateFiles() {
  const storagePath = await getStoragePath();

  try {
    // Read all files in the storage directory
    const files = await fs.readdir(storagePath);

    for (const file of files) {
      const oldPath = path.join(storagePath, file);
      const stats = await fs.stat(oldPath);

      if (stats.isFile()) {
        // Parse the old filename to get metadata
        const parts = file.split("_");
        if (parts.length >= 3) {
          const year = parts[0];
          const month = parseInt(parts[1]);
          const street = parts
            .slice(2)
            .join("_")
            .replace(/\.[^/.]+$/, ""); // Remove file extension

          // Create new folder structure
          const yearFolder = `${year}_Geotechnika`;
          const monthFolder = `${getMonthName(month)}_${year}`;
          const streetFolder = street;

          const newDirPath = path.join(
            storagePath,
            yearFolder,
            monthFolder,
            streetFolder
          );
          const newFilePath = path.join(newDirPath, file);

          // Create directories if they don't exist
          await fs.mkdir(newDirPath, { recursive: true });

          // Move the file
          await fs.rename(oldPath, newFilePath);
          console.log(`Moved ${file} to ${newFilePath}`);
        }
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
  }
}

migrateFiles();
