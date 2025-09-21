import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("Map pits search params:", Object.fromEntries(searchParams.entries()));

    const where = {
      ...(searchParams.get("year") && {
        year: parseInt(searchParams.get("year")!),
      }),
      ...(searchParams.get("month") && {
        month: parseInt(searchParams.get("month")!),
      }),
      ...(searchParams.get("author") && {
        author: searchParams.get("author"),
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
      ...(searchParams.get("noPdf") === "true" && {
        files: {
          none: {
            filetype: "pdf",
          },
        },
      }),
    };
    console.log("Map pits where clause:", JSON.stringify(where, null, 2));

    const orderBy = (() => {
      switch (searchParams.get("sort")) {
        case "year_month_asc":
          return [{ year: "asc" as const }, { month: "asc" as const }];
        case "year_month_desc":
          return [{ year: "desc" as const }, { month: "desc" as const }];
        case "modification_asc":
          return { lastFileModification: "asc" as const };
        case "modification_desc":
          return { lastFileModification: "desc" as const };
        case "street_asc":
          return { street: "asc" as const };
        case "street_desc":
          return { street: "desc" as const };
        default:
          return [{ year: "desc" as const }, { month: "desc" as const }];
      }
    })();
    console.log("Map pits order by:", JSON.stringify(orderBy, null, 2));

    console.log("Executing map pits Prisma query...");

    // Get all pits for map (no pagination)
    const pits = await prisma.pit.findMany({
      where,
      orderBy,
      select: {
        id: true,
        year: true,
        month: true,
        street: true,
        author: true,
        createdAt: true,
        lastFileModification: true,
        jobNumber: true,
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
    console.log("Map pits query successful, found", pits.length, "pits");

    return NextResponse.json({
      pits,
      totalCount: pits.length,
    });
  } catch (error: unknown) {
    const errorObject = error as Error;
    console.error("Map pits error details:", {
      name: errorObject.name || "Unknown error",
      message: errorObject.message || "No error message",
      stack: errorObject.stack,
      cause: errorObject.cause,
    });

    // Log the full error object
    console.error("Full map pits error object:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch map pits",
        details: errorObject.message || "Unknown error occurred",
        type: errorObject.name || "UnknownError",
      },
      { status: 500 }
    );
  }
}
