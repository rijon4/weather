import { NextRequest, NextResponse } from "next/server";
import { getWeather } from "@/lib/openmeteo";

export const dynamic = "force-dynamic";

/**
 * GET /api/weather?latitude=47.37&longitude=8.54&unit=c|f
 * Proxies Open-Meteo and returns normalized weather data.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));
  const unit = searchParams.get("unit") === "f" ? "fahrenheit" : "celsius";

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json(
      { error: "Valid `latitude` and `longitude` query params are required." },
      { status: 400 }
    );
  }

  try {
    const weather = await getWeather(latitude, longitude, unit);
    return NextResponse.json(weather, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch (err) {
    console.error("[/api/weather]", err);
    return NextResponse.json(
      { error: "Unable to fetch weather data right now." },
      { status: 502 }
    );
  }
}
