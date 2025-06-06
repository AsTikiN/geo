import { NextResponse } from "next/server";
import { walk, parseMeta, getStoragePath } from "@/lib/fs-utils";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const base = getStoragePath();
  const allFiles = await walk(base);
  const allFilePaths = allFiles.map((f) => f.replace(base + path.sep, ""));

  // Delete files that no longer exist
  const existingFiles = await prisma.pitFile.findMany({
    select: { filepath: true, pitId: true },
  });

  for (const file of existingFiles) {
    if (!allFilePaths.includes(file.filepath)) {
      await prisma.pitFile.delete({
        where: { filepath: file.filepath },
      });

      // Check if pit has any remaining files
      const remainingFiles = await prisma.pitFile.count({
        where: { pitId: file.pitId },
      });

      if (remainingFiles === 0) {
        await prisma.pit.delete({
          where: { id: file.pitId },
        });
      }
    }
  }

  // Add/update existing files
  for (const fullPath of allFiles) {
    const relative = fullPath.replace(base + path.sep, "");
    const { year, month, street, filename, filetype } = parseMeta(relative);

    try {
      const pit = await prisma.pit.upsert({
        where: { year_month_street: { year, month, street } },
        update: {},
        create: { year, month, street },
      });

      await prisma.pitFile.upsert({
        where: { filepath: relative },
        update: {},
        create: {
          filename,
          filepath: relative,
          filetype,
          pitId: pit.id,
        },
      });
    } catch (err) {
      console.error("Ошибка при синхронизации файла", relative, err);
    }
  }

  return NextResponse.json({ status: "ok", files: allFiles.length });
}
