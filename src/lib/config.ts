import path from "path";
import { prisma } from "./prisma";

// Default storage path
const DEFAULT_STORAGE_PATH = path.join(process.cwd(), "src", "storage");

// Get storage path from database or use default
export async function getStoragePath(): Promise<string> {
  try {
    const config = await prisma.config.findUnique({
      where: { key: "storage_path" },
    });

    if (config?.value) {
      return path.resolve(config.value);
    }
  } catch (error) {
    console.error("Error reading storage path from database:", error);
  }

  return DEFAULT_STORAGE_PATH;
}

// Synchronous version for backward compatibility (uses default path)
export function getStoragePathSync(): string {
  return DEFAULT_STORAGE_PATH;
} 