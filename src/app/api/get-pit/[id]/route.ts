import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pit = await prisma.pit.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        files: true,
      },
    });

    if (!pit) {
      return NextResponse.json({ error: "Pit not found" }, { status: 404 });
    }

    return NextResponse.json(pit);
  } catch (error) {
    console.error("Error fetching pit:", error);
    return NextResponse.json({ error: "Failed to fetch pit" }, { status: 500 });
  }
}
