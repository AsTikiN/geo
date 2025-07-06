import path from "path";

// Default storage path
const DEFAULT_STORAGE_PATH = path.join(process.cwd(), "src", "storage");

// Get storage path from environment variable or use default
export function getStoragePath(): string {
  const envPath = process.env.STORAGE_PATH;
  
  if (envPath) {
    return path.resolve(envPath);
  }
  
  return DEFAULT_STORAGE_PATH;
} 