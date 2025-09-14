import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get unique authors from the database
    const authors = await prisma.pit.findMany({
      select: {
        author: true,
      },
      distinct: ["author"],
      where: {
        author: {
          not: null,
        },
      },
      orderBy: {
        author: "asc",
      },
    });

    return NextResponse.json({
      authors: authors.map((item) => item.author).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}
