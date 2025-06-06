import { NextResponse } from "next/server";
import { join } from "path";
import { existsSync } from "fs";

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

    // Return the directory path of the file
    const directoryPath = fullPath.substring(0, fullPath.lastIndexOf("/"));

    return NextResponse.json({ location: directoryPath });
  } catch (error) {
    console.error("Error getting file location:", error);
    return NextResponse.json(
      { error: "Failed to get file location" },
      { status: 500 }
    );
  }
}
