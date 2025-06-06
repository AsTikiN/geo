import { NextResponse } from "next/server";
import { join } from "path";
import { existsSync } from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    const fullPath = join(process.cwd(), "src", "storage", filePath);

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Get the directory path
    const directoryPath = fullPath.substring(0, fullPath.lastIndexOf("/"));

    // Use the 'open' command to open the directory
    await execAsync(`open "${directoryPath}"`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error opening file location:", error);
    return NextResponse.json(
      { error: "Failed to open file location" },
      { status: 500 }
    );
  }
}
