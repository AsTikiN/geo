import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile, readdir, copyFile } from "fs/promises";
import path from "path";
import { getStoragePath } from "@/lib/fs-utils";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const formData = await req.formData();

  const year = formData.get("year") as string;
  const month = formData.get("month") as string;
  const city = formData.get("city") as string;
  const street = city + "_" + (formData.get("street") as string);
  const files = formData.getAll("files") as File[];

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

  try {
    // Create new directory if it doesn't exist
    await mkdir(newPath, { recursive: true });
    console.log("Created new directory:", newPath);

    // Copy existing files to new location
    try {
      console.log("Reading directory:", oldPath);
      const existingFiles = await readdir(oldPath);
      console.log("Found files:", existingFiles);

      for (const file of existingFiles) {
        const sourcePath = path.join(oldPath, file);
        const destPath = path.join(newPath, file);
        console.log("Copying file:", sourcePath, "to", destPath);
        await copyFile(sourcePath, destPath);
      }
    } catch (err) {
      console.error("Ошибка копирования файлов:", err);
      // Continue even if copy fails - directory might not exist yet
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
    const existingFiles = await prisma.pitFile.findMany({
      where: { pitId: id },
    });
    console.log("Updating database records for files:", existingFiles);

    for (const file of existingFiles) {
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating pit:", error);
    return NextResponse.json(
      { error: "Failed to update pit" },
      { status: 500 }
    );
  }
}
