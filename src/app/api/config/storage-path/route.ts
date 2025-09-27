import { NextRequest, NextResponse } from "next/server";
import { getStoragePath } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";

export async function GET() {
  try {
    const currentPath = await getStoragePath();
    return NextResponse.json({
      storagePath: currentPath,
      isDefault: currentPath.includes("src/storage"),
    });
  } catch (error) {
    console.error("Error getting storage path:", error);
    return NextResponse.json(
      { error: "Failed to get storage path" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { storagePath } = await request.json();

    if (!storagePath || typeof storagePath !== "string") {
      return NextResponse.json(
        { error: "Storage path is required" },
        { status: 400 }
      );
    }

    // Validate the path
    try {
      await fs.access(storagePath);
    } catch (error) {
      return NextResponse.json(
        { error: "Path is not accessible" },
        { status: 400 }
      );
    }

    // Save to database
    await prisma.config.upsert({
      where: { key: "storage_path" },
      update: { value: storagePath },
      create: { key: "storage_path", value: storagePath },
    });

    return NextResponse.json({
      success: true,
      storagePath,
      message: "Storage path updated successfully",
    });
  } catch (error) {
    console.error("Error setting storage path:", error);
    return NextResponse.json(
      { error: "Failed to set storage path" },
      { status: 500 }
    );
  }
} 