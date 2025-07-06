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
        Rok: pit.year,
        Miesiąc: pit.month,
        Miasto: city,
        Ulica: street,
        "Data modyfikacji": pit.lastFileModification
          ? new Date(pit.lastFileModification).toLocaleDateString("pl-PL")
          : new Date(pit.updatedAt).toLocaleDateString("pl-PL"),
        Mapa: pit.files.some((f) => f.filetype.toLowerCase() === "pdf")
          ? "Tak"
          : "Nie",
        "Liczba plików": pit.files.length,
        Pliki: pit.files.map((f) => f.filename).join(", "),
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 4 }, // №
      { wch: 6 }, // Rok
      { wch: 10 }, // Miesiąc
      { wch: 20 }, // Miasto
      { wch: 30 }, // Ulica
      { wch: 15 }, // Data modyfikacji
      { wch: 8 }, // Mapa
      { wch: 15 }, // Liczba plików
      { wch: 50 }, // Pliki
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Prace drogowe");

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
