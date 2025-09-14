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

  let deletedFiles = 0;
  let deletedPits = 0;

  for (const file of existingFiles) {
    if (!allFilePaths.includes(file.filepath)) {
      await prisma.pitFile.delete({
        where: { filepath: file.filepath },
      });
      deletedFiles++;

      // Check if pit has any remaining files
      const remainingFiles = await prisma.pitFile.count({
        where: { pitId: file.pitId },
      });

      if (remainingFiles === 0) {
        await prisma.pit.delete({
          where: { id: file.pitId },
        });
        deletedPits++;
      }
    }
  }

  // Get all existing pits to check if they still have files
  const existingPits = await prisma.pit.findMany({
    include: { files: true },
  });

  // Delete pits that have no files
  for (const pit of existingPits) {
    if (pit.files.length === 0) {
      await prisma.pit.delete({
        where: { id: pit.id },
      });
      deletedPits++;
    }
  }

  console.log(
    `Cleanup completed: ${deletedFiles} files deleted, ${deletedPits} pits deleted`
  );

  // Group files by pit (year, month, street, author)
  const filesByPit = new Map<string, string[]>();

  for (const fullPath of allFiles) {
    const relative = fullPath.replace(base + path.sep, "");
    const { year, month, street, author } = parseMeta(relative);
    const pitKey = `${year}_${month}_${street}_${author}`;

    if (!filesByPit.has(pitKey)) {
      filesByPit.set(pitKey, []);
    }
    filesByPit.get(pitKey)!.push(fullPath);
  }

  // Add/update existing files and update pit modification times
  for (const [pitKey, files] of filesByPit) {
    const parts = pitKey.split("_");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const author = parts[parts.length - 1]; // Author is the last part
    const street = parts.slice(2, -1).join("_"); // Everything between month and author

    // Get the latest modification time for this pit's files
    const latestModTime = await getLatestModificationTime(files);

    try {
      const pit = await prisma.pit.upsert({
        where: { author_year_month_street: { author, year, month, street } },
        update: {},
        create: { year, month, street, author },
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

  return NextResponse.json({
    status: "ok",
    files: allFiles.length,
    cleanup: {
      deletedFiles,
      deletedPits,
    },
  });
}
