import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LIMIT = "50";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("Search params:", Object.fromEntries(searchParams.entries()));

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || LIMIT);
    const offset = (page - 1) * limit;

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
      ...(searchParams.get("noPdf") === "true" && {
        files: {
          none: {
            filetype: "pdf",
          },
        },
      }),
    };
    console.log("Where clause:", JSON.stringify(where, null, 2));

    const orderBy = (() => {
      switch (searchParams.get("sort")) {
        case "date_asc":
          return { lastFileModification: "asc" as const };
        case "date_desc":
          return { lastFileModification: "desc" as const };
        case "modification_asc":
          return { lastFileModification: "asc" as const };
        case "modification_desc":
          return { lastFileModification: "desc" as const };
        case "street_asc":
          return { street: "asc" as const };
        case "street_desc":
          return { street: "desc" as const };
        default:
          return { lastFileModification: "desc" as const };
      }
    })();
    console.log("Order by:", JSON.stringify(orderBy, null, 2));

    console.log("Executing Prisma query...");

    // Get total count for pagination
    const totalCount = await prisma.pit.count({ where });

    // Get paginated pits
    const pits = await prisma.pit.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        year: true,
        month: true,
        street: true,
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
    console.log("Query successful, found", pits.length, "pits");

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      pits,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: unknown) {
    const errorObject = error as Error;
    console.error("Error details:", {
      name: errorObject.name || "Unknown error",
      message: errorObject.message || "No error message",
      stack: errorObject.stack,
      cause: errorObject.cause,
    });

    // Log the full error object
    console.error("Full error object:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch pits",
        details: errorObject.message || "Unknown error occurred",
        type: errorObject.name || "UnknownError",
      },
      { status: 500 }
    );
  }
}
