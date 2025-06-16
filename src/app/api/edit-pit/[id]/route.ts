import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile, readdir, copyFile, rm } from "fs/promises";
import path from "path";
import { getStoragePath } from "@/lib/fs-utils";
import { prisma } from "@/lib/prisma";
import { RouteParams } from "@/app/edit/[id]/types";

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const formData = await request.formData();

    const year = formData.get("year") as string;
    const month = formData.get("month") as string;
    const city = formData.get("city") as string;
    const street = city + "_" + (formData.get("street") as string);
    const files = formData.getAll("files") as File[];
    const existingFiles = formData.getAll("existingFiles") as string[];

    const pit = await prisma.pit.findUnique({ where: { id } });
    if (!pit) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const monthNames = [
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

    // Construct paths with _Geotechnika suffix
    const oldPath = path.join(
      getStoragePath(),
      `${pit.year}_Geotechnika`,
      `${monthNames[pit.month - 1]}_${pit.year}`,
      pit.street
    );
    const newPath = path.join(
      getStoragePath(),
      `${year}_Geotechnika`,
      `${monthNames[parseInt(month) - 1]}_${year}`,
      street
    );

    console.log("Old path:", oldPath);
    console.log("New path:", newPath);

    // Check if location has changed
    const locationChanged =
      oldPath !== newPath ||
      pit.year !== parseInt(year) ||
      pit.month !== parseInt(month) ||
      pit.street !== street;

    // Get all existing files from the database
    const currentFiles = await prisma.pitFile.findMany({
      where: { pitId: id },
    });

    if (locationChanged) {
      // Create new directory if it doesn't exist
      await mkdir(newPath, { recursive: true });
      console.log("Created new directory:", newPath);

      // Copy only the files that should be kept to the new location
      try {
        console.log("Reading directory:", oldPath);
        const existingFilesInDir = await readdir(oldPath);
        console.log("Found files:", existingFilesInDir);

        for (const file of existingFilesInDir) {
          const fileRecord = currentFiles.find((f) => f.filename === file);
          if (fileRecord && existingFiles.includes(fileRecord.id.toString())) {
            const sourcePath = path.join(oldPath, file);
            const destPath = path.join(newPath, file);
            console.log("Copying file:", sourcePath, "to", destPath);
            await copyFile(sourcePath, destPath);
          }
        }
      } catch (err) {
        console.error("Ошибка копирования файлов:", err);
        // Continue even if copy fails - directory might not exist yet
      }

      // Delete the old directory and its contents
      try {
        await rm(oldPath, { recursive: true, force: true });
        console.log("Successfully deleted old directory:", oldPath);
      } catch (err) {
        console.error("Error deleting old directory:", err);
      }
    } else {
      // If location hasn't changed, just handle file updates in place
      // Delete files that are no longer needed
      const filesToDelete = currentFiles.filter(
        (file) => !existingFiles.includes(file.id.toString())
      );

      for (const file of filesToDelete) {
        try {
          const filePath = path.join(getStoragePath(), file.filepath);
          await rm(filePath, { force: true });
          await prisma.pitFile.delete({
            where: { id: file.id },
          });
          console.log("Deleted file:", filePath);
        } catch (err) {
          console.error("Error deleting file:", file.filename, err);
        }
      }
    }

    // Handle new file uploads
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name;
        const filepath = path.join(newPath, filename);

        await writeFile(filepath, buffer);

        // Create pitFile record
        await prisma.pitFile.create({
          data: {
            filename,
            filepath: path.relative(getStoragePath(), filepath),
            filetype: file.type || "application/octet-stream",
            pitId: id,
          },
        });
      }
    }

    // Update relative paths for existing files
    const keptFiles = await prisma.pitFile.findMany({
      where: {
        pitId: id,
        id: { in: existingFiles.map((id) => parseInt(id)) },
      },
    });
    console.log("Updating database records for files:", keptFiles);

    for (const file of keptFiles) {
      const newRelative = path.relative(
        getStoragePath(),
        path.join(newPath, file.filename)
      );
      console.log("Updating file path:", file.filename, "to", newRelative);
      await prisma.pitFile.update({
        where: { id: file.id },
        data: { filepath: newRelative },
      });
    }

    // Update pit record
    await prisma.pit.update({
      where: { id },
      data: {
        year: parseInt(year),
        month: parseInt(month),
        street,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating pit:", error);
    return NextResponse.json(
      {
        error: "Failed to update pit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
