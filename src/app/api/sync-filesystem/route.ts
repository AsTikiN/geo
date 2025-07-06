import { NextResponse } from "next/server";
import {
  walk,
  parseMeta,
  getStoragePath,
  getLatestModificationTime,
} from "@/lib/fs-utils";
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

  // Group files by pit (year, month, street)
  const filesByPit = new Map<string, string[]>();

  for (const fullPath of allFiles) {
    const relative = fullPath.replace(base + path.sep, "");
    const { year, month, street } = parseMeta(relative);
    const pitKey = `${year}_${month}_${street}`;

    if (!filesByPit.has(pitKey)) {
      filesByPit.set(pitKey, []);
    }
    filesByPit.get(pitKey)!.push(fullPath);
  }

  // Add/update existing files and update pit modification times
  for (const [pitKey, files] of filesByPit) {
    const [yearStr, monthStr, ...streetParts] = pitKey.split("_");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const street = streetParts.join("_"); // Preserve the full street name with underscores

    // Get the latest modification time for this pit's files
    const latestModTime = await getLatestModificationTime(files);

    try {
      const pit = await prisma.pit.upsert({
        where: { year_month_street: { year, month, street } },
        update: {},
        create: { year, month, street },
      });

      // Update the pit's lastFileModification field based on the latest file modification time
      await prisma.pit.update({
        where: { id: pit.id },
        data: { lastFileModification: latestModTime },
      });

      // Update all files for this pit
      for (const fullPath of files) {
        const relative = fullPath.replace(base + path.sep, "");
        const { filename, filetype } = parseMeta(relative);

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
      }
    } catch (err) {
      console.error("Ошибка при синхронизации файла", pitKey, err);
    }
  }

  return NextResponse.json({ status: "ok", files: allFiles.length });
}
