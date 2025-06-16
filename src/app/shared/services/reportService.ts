import { File } from "@/app/types";
import { Pit, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

type PitWithFiles = Pit & {
  files: File[];
};

export interface ReportFilters {
  year?: number;
  month?: string;
  city?: string;
  street?: string;
  noPdf?: boolean;
}

export class ReportService {
  static async generateReport(filters: ReportFilters) {
    // Build the where clause based on filters
    const where: Prisma.PitWhereInput = {};
    if (filters.year) where.year = filters.year;
    if (filters.month) where.month = parseInt(filters.month);
    if (filters.city) where.street = { startsWith: filters.city + "_" };
    if (filters.street) where.street = { contains: "_" + filters.street };

    // Get filtered pits with their files
    const pits = (await prisma.pit.findMany({
      where,
      include: {
        files: true,
      },
      orderBy: [{ year: "desc" }, { month: "desc" }, { street: "asc" }],
    })) as unknown as PitWithFiles[];

    return this.generateExcelFile(pits);
  }

  private static generateExcelFile(pits: PitWithFiles[]) {
    // Transform data for Excel
    const excelData = pits.map((pit) => {
      const [city, street] = pit.street.split("_");
      return {
        Год: pit.year,
        Месяц: pit.month,
        Город: city,
        Улица: street,
        "Количество файлов": pit.files.length,
        "Дата создания": new Date(pit.createdAt).toLocaleDateString("ru-RU"),
        Файлы: pit.files.map((f: File) => f.filename).join(", "),
      };
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 6 }, // Год
      { wch: 10 }, // Месяц
      { wch: 20 }, // Город
      { wch: 30 }, // Улица
      { wch: 15 }, // Количество файлов
      { wch: 15 }, // Дата создания
      { wch: 50 }, // Файлы
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Дорожные работы");

    // Generate buffer
    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  }
}
