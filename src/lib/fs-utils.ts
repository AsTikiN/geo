import fs from "fs/promises";
import path from "path";

const STORAGE_PATH = path.join(process.cwd(), "src", "storage");

export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  return months[monthName as keyof typeof months] || 1;
}

export const getStoragePath = () => STORAGE_PATH;
