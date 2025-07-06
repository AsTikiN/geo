import fs from "fs/promises";
import path from "path";
import { getStoragePath } from "./config";

export function getMonthName(month: number): string {
  const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  return months[month - 1] || "";
}

export function getFolderPath(
  year: number,
  month: number,
  street: string
): string {
  const yearFolder = `${year}_Geotechnika`;
  const monthFolder = `${getMonthName(month)}_${year}`;
  const streetFolder = street.replace(/\s+/g, "_");

  return path.join(getStoragePath(), yearFolder, monthFolder, streetFolder);
}

export async function walk(dir: string): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(await walk(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (![".pdf", ".xls", ".xlsx", ".doc", ".docx"].includes(ext)) continue;

      files.push(fullPath);
    }
  }

  return files;
}

export async function getFileModificationTime(filePath: string): Promise<Date> {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime;
  } catch (error) {
    console.error(`Error getting modification time for ${filePath}:`, error);
    return new Date();
  }
}

export async function getLatestModificationTime(
  files: string[]
): Promise<Date> {
  if (files.length === 0) {
    return new Date();
  }

  const modificationTimes = await Promise.all(
    files.map((file) => getFileModificationTime(file))
  );

  return new Date(Math.max(...modificationTimes.map((date) => date.getTime())));
}

export function parseMeta(filePath: string) {
  const parts = filePath.split(path.sep);
  const len = parts.length;
  const filename = parts[len - 1];
  const street = parts[len - 2];
  const monthYear = parts[len - 3].split("_");
  const month = getMonthNumber(monthYear[0]);
  const year = parseInt(monthYear[1]);
  const filetype = path.extname(filename).slice(1);

  return { year, month, street, filename, filetype };
}

function getMonthNumber(monthName: string): number {
  const months = {
    Styczeń: 1,
    Luty: 2,
    Marzec: 3,
    Kwiecień: 4,
    Maj: 5,
    Czerwiec: 6,
    Lipiec: 7,
    Sierpień: 8,
    Wrzesień: 9,
    Październik: 10,
    Listopad: 11,
    Grudzień: 12,
  };
  return months[monthName as keyof typeof months] || 1;
}

export { getStoragePath };
