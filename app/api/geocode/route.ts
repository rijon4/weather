import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/openmeteo";

/**
 * GET /api/geocode?q=zurich — city name search via Open-Meteo geocoding.
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchPlaces(query);
    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch (err) {
    console.error("[/api/geocode]", err);
    return NextResponse.json(
      { error: "Unable to search places right now." },
      { status: 502 }
    );
  }
}
