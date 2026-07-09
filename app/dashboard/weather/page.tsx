"use client";

import { useEffect, useState } from "react";
import { CloudSun, Droplets, Wind, ThermometerSun, TriangleAlert } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Daily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  windspeed_10m_max: number[];
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 51: "Light drizzle", 61: "Light rain", 63: "Moderate rain",
  65: "Heavy rain", 80: "Rain showers", 95: "Thunderstorm",
};

export default function WeatherPage() {
  const [daily, setDaily] = useState<Daily | null>(null);
  const [current, setCurrent] = useState<{ temp: number; code: number; wind: number; humidity: number } | null>(null);
  const [place, setPlace] = useState("Locating…");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather(13.0827, 80.2707); // fallback: Chennai
      setPlace("Chennai, Tamil Nadu (default)");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
        setPlace("Your current location");
      },
      () => {
        fetchWeather(13.0827, 80.2707);
        setPlace("Chennai, Tamil Nadu (default — enable location for local weather)");
      }
    );
  }, []);

  async function fetchWeather(lat: number, lon: number) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=auto&forecast_days=7`
      );
      const data = await res.json();
      setCurrent({
        temp: data.current.temperature_2m,
        code: data.current.weathercode,
        wind: data.current.windspeed_10m,
        humidity: data.current.relative_humidity_2m,
      });
      setDaily(data.daily);
    } catch {
      setError("Couldn't load weather right now. Please try again shortly.");
    }
  }

  const rainySoon = daily?.precipitation_probability_max.slice(0, 3).some((p) => p >= 60);

  return (
    <div>
      <PageHeader eyebrow="Weather" title="Know before you sow, spray or harvest" description={`Forecast for ${place}.`} />

      {error && <p className="text-sm text-clay">{error}</p>}

      {rainySoon && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-clay/30 bg-clay/10 p-4 text-sm text-clay">
          <TriangleAlert className="h-5 w-5 shrink-0" />
          High chance of rain in the next 3 days — hold off on spraying pesticide and plan harvest accordingly.
        </div>
      )}

      {current && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={ThermometerSun} label="Temperature" value={`${Math.round(current.temp)}°C`} />
          <StatCard icon={CloudSun} label="Condition" value={WEATHER_CODES[current.code] ?? "—"} />
          <StatCard icon={Droplets} label="Humidity" value={`${current.humidity}%`} />
          <StatCard icon={Wind} label="Wind" value={`${Math.round(current.wind)} km/h`} />
        </div>
      )}

      {daily && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {daily.time.map((day, i) => (
            <div key={day} className="rounded-xl border border-soil/10 bg-white/70 p-4 text-center">
              <p className="font-mono text-[11px] text-soil-700/60">
                {new Date(day).toLocaleDateString("en-IN", { weekday: "short" })}
              </p>
              <p className="mt-2 font-display text-lg font-semibold text-soil">{Math.round(daily.temperature_2m_max[i])}°</p>
              <p className="font-mono text-xs text-soil-700/60">{Math.round(daily.temperature_2m_min[i])}° low</p>
              <p className="mt-2 font-mono text-[11px] text-sky">{daily.precipitation_probability_max[i]}% rain</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-soil/10 bg-white/70 p-5">
      <Icon className="h-5 w-5 text-leaf" />
      <p className="mt-3 font-display text-xl font-semibold text-soil">{value}</p>
      <p className="text-xs text-soil-700/60">{label}</p>
    </div>
  );
}
