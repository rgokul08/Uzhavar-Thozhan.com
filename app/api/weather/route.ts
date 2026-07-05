import { NextRequest, NextResponse } from "next/server";

// TODO: wire this to a real provider (OpenWeatherMap, Tomorrow.io, or the
// Indian Meteorological Department API) using WEATHER_API_KEY from .env.
// Consider caching results per pinCode in the WeatherCache table for a
// few hours to avoid rate limits.
export async function GET(req: NextRequest) {
  const pinCode = req.nextUrl.searchParams.get("pinCode") || "000000";

  const mock = {
    pinCode,
    current: { tempC: 31, condition: "Partly cloudy", humidity: 68, windKph: 14 },
    forecast: [
      { day: "Today", high: 33, low: 25, rainChance: 20 },
      { day: "Tomorrow", high: 32, low: 24, rainChance: 60 },
      { day: "Day 3", high: 30, low: 23, rainChance: 80 }
    ],
    alerts: []
  };

  return NextResponse.json(mock);
}
