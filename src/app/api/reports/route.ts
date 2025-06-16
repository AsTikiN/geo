import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import { Prisma } from "@/generated/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const city = searchParams.get("city");
    const street = searchParams.get("street");
    const noPdf = searchParams.get("noPdf") === "true";

    // Build the where clause based on filters
    const where: Prisma.PitWhereInput = {};
    if (year) where.year = parseInt(year);
    if (month) where.month = parseInt(month);
    if (city) where.street = { startsWith: city + "_" };
    if (street) where.street = { contains: "_" + street };
    if (noPdf) {
      where.files = {
        none: {
          filetype: "pdf",
        },
      };
    }

    // Get filtered pits with their files
    const pits = await prisma.pit.findMany({
      where,
      include: {
        files: true,
      },
      orderBy: [{ year: "desc" }, { month: "desc" }, { street: "asc" }],
    });

    // Transform data for Excel
    const excelData = pits.map((pit, index) => {
      const [city, street] = pit.street.split("_");
      return {
        "№": index + 1,
        Год: pit.year,
        Месяц: pit.month,
        Город: city,
        Улица: street,
        "Количество файлов": pit.files.length,
        "Дата создания": new Date(pit.createdAt).toLocaleDateString("ru-RU"),
        Файлы: pit.files.map((f) => f.filename).join(", "),
        "Есть PDF": pit.files.some((f) => f.filetype.toLowerCase() === "pdf")
          ? "Да"
          : "Нет",
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 4 }, // №
      { wch: 6 }, // Год
      { wch: 10 }, // Месяц
      { wch: 20 }, // Город
      { wch: 30 }, // Улица
      { wch: 15 }, // Количество файлов
      { wch: 15 }, // Дата создания
      { wch: 50 }, // Файлы
      { wch: 10 }, // Есть PDF
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Дорожные работы");

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Return Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="road-works-report.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
