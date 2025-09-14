import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getStoragePath } from "@/lib/fs-utils";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const year = parseInt(formData.get("year") as string);
  const month = parseInt(formData.get("month") as string);
  const city = formData.get("city") as string;
  const street = city + "_" + (formData.get("street") as string);
  const author = (formData.get("author") as string) || "Unknown"; // Default author if not provided
  const files = formData.getAll("files") as File[];

  const pit = await prisma.pit.upsert({
    where: { author_year_month_street: { author, year, month, street } },
    update: {},
    create: { year, month, street, author },
  });

  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  const yearFolder = `${year}_Geotechnika`;
  const monthFolder = `${monthNames[month - 1]}_${year}`;

  const folderPath = path.join(
    getStoragePath(),
    author,
    yearFolder,
    monthFolder,
    street
  );
  await mkdir(folderPath, { recursive: true });

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(folderPath, file.name);
    const relativePath = path.relative(getStoragePath(), filePath);
    const filetype = path.extname(file.name).slice(1);

    await writeFile(filePath, buffer);

    await prisma.pitFile.create({
      data: {
        pitId: pit.id,
        filename: file.name,
        filepath: relativePath,
        filetype,
      },
    });
  }

  return NextResponse.json({ status: "ok" });
}
