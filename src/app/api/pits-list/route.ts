import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("Search params:", Object.fromEntries(searchParams.entries()));

    const where = {
      ...(searchParams.get("year") && {
        year: parseInt(searchParams.get("year")!),
      }),
      ...(searchParams.get("month") && {
        month: parseInt(searchParams.get("month")!),
      }),
      ...(searchParams.get("search") && {
        OR: [
          { year: parseInt(searchParams.get("search")!) || undefined },
          { month: parseInt(searchParams.get("search")!) || undefined },
          {
            street: {
              contains: searchParams.get("search")?.toLowerCase() || undefined,
            },
          },
        ].filter(Boolean),
      }),
    };
    console.log("Where clause:", JSON.stringify(where, null, 2));

    const orderBy = (() => {
      switch (searchParams.get("sort")) {
        case "date_asc":
          return { createdAt: "asc" as const };
        case "street_asc":
          return { street: "asc" as const };
        case "street_desc":
          return { street: "desc" as const };
        default:
          return { createdAt: "desc" as const };
      }
    })();
    console.log("Order by:", JSON.stringify(orderBy, null, 2));

    console.log("Executing Prisma query...");
    const pits = await prisma.pit.findMany({
      where,
      orderBy,
      select: {
        id: true,
        year: true,
        month: true,
        street: true,
        createdAt: true,
        files: {
          select: {
            id: true,
            filename: true,
            filepath: true,
            filetype: true,
            createdAt: true,
          },
        },
      },
    });
    console.log("Query successful, found", pits.length, "pits");

    return NextResponse.json(pits);
  } catch (error: any) {
    console.error("Error details:", {
      name: error?.name || "Unknown error",
      message: error?.message || "No error message",
      stack: error?.stack,
      cause: error?.cause,
    });

    // Log the full error object
    console.error("Full error object:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch pits",
        details: error?.message || "Unknown error occurred",
        type: error?.name || "UnknownError",
      },
      { status: 500 }
    );
  }
}
