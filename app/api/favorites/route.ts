import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET  /api/favorites — list saved locations
 * POST /api/favorites — save a location (body: { name, country, admin1, latitude, longitude })
 */
export async function GET() {
  try {
    const favorites = await prisma.favorite.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ favorites });
  } catch (err) {
    console.error("[GET /api/favorites]", err);
    return NextResponse.json(
      { error: "Unable to load favorites." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      country?: string;
      admin1?: string;
      latitude?: number;
      longitude?: number;
    };

    const { name, country, admin1, latitude, longitude } = body;
    if (
      !name?.trim() ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return NextResponse.json(
        { error: "name, latitude and longitude are required." },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        latitude_longitude: { latitude: latitude!, longitude: longitude! },
      },
      update: { name: name.trim(), country, admin1 },
      create: { name: name.trim(), country, admin1, latitude: latitude!, longitude: longitude! },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/favorites]", err);
    return NextResponse.json(
      { error: "Unable to save favorite." },
      { status: 500 }
    );
  }
}
