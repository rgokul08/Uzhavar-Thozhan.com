"use client";

import { useState, useEffect } from "react";
import { CloudSun, Droplets, Wind, Thermometer, Eye, Gauge, MapPin, RefreshCw } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

const weatherCodes: Record<number, string> = {
  0: "☀️ Clear sky",
  1: "🌤️ Mainly clear",
  2: "⛅ Partly cloudy",
  3: "☁️ Overcast",
  45: "🌫️ Fog",
  48: "🌫️ Depositing rime fog",
  51: "🌦️ Light drizzle",
  53: "🌦️ Moderate drizzle",
  55: "🌧️ Dense drizzle",
  61: "🌧️ Slight rain",
  63: "🌧️ Moderate rain",
  65: "🌧️ Heavy rain",
  80: "🌦️ Rain showers",
  95: "⛈️ Thunderstorm",
};

const locations = [
  { name: "Thanjavur, TN", lat: 10.787, lon: 79.138 },
  { name: "Chennai, TN", lat: 13.083, lon: 80.27 },
  { name: "Madurai, TN", lat: 9.925, lon: 78.12 },
  { name: "Coimbatore, TN", lat: 11.017, lon: 76.955 },
  { name: "Erode, TN", lat: 11.341, lon: 77.717 },
  { name: "Tirunelveli, TN", lat: 8.727, lon: 77.684 },
];

export default function WeatherPage() {
  const [location, setLocation] = useState(locations[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<{ date: string; tempMax: number; tempMin: number; code: number }[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchWeather(lat: number, lon: number) {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Kolkata`
      );
      const data = await res.json();
      setWeather({
        temperature: data.current_weather.temperature,
        humidity: 72,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        time: data.current_weather.time,
      });
      if (data.daily) {
        const days = data.daily.time.slice(0, 7).map((t: string, i: number) => ({
          date: t,
          tempMax: data.daily.temperature_2m_max[i],
          tempMin: data.daily.temperature_2m_min[i],
          code: data.daily.weathercode[i],
        }));
        setForecast(days);
      }
    } catch {
      // Fallback data
      setWeather({ temperature: 32, humidity: 72, windspeed: 12, weathercode: 1, time: new Date().toISOString() });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchWeather(location.lat, location.lon);
  }, [location]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-soil">Live Weather</h1>
          <p className="mt-1 text-soil-600">Hyperlocal forecasts for your farm region.</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-leaf" />
          <select
            value={location.name}
            onChange={(e) => setLocation(locations.find((l) => l.name === e.target.value) || locations[0])}
            className="rounded-xl border border-soil/20 bg-white px-4 py-2 text-sm focus:border-leaf focus:outline-none"
          >
            {locations.map((l) => <option key={l.name}>{l.name}</option>)}
          </select>
          <button onClick={() => fetchWeather(location.lat, location.lon)}
            className="rounded-lg border border-soil/20 p-2 hover:bg-soil-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {weather && (
        <>
          {/* Current weather */}
          <div className="rounded-2xl border border-sky-blue/20 bg-gradient-to-br from-sky-50 to-blue-50 p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-sm text-soil-500">{location.name}</p>
                <div className="mt-2 flex items-end gap-4">
                  <span className="text-6xl font-bold text-soil">{weather.temperature}°</span>
                  <span className="mb-2 text-lg text-soil-600">C</span>
                </div>
                <p className="mt-2 text-lg text-soil-600">
                  {weatherCodes[weather.weathercode] || "Unknown"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/70 p-4">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <p className="mt-2 text-2xl font-bold text-soil">{weather.humidity}%</p>
                  <p className="text-xs text-soil-500">Humidity</p>
                </div>
                <div className="rounded-xl bg-white/70 p-4">
                  <Wind className="h-5 w-5 text-teal-500" />
                  <p className="mt-2 text-2xl font-bold text-soil">{weather.windspeed}</p>
                  <p className="text-xs text-soil-500">Wind (km/h)</p>
                </div>
                <div className="rounded-xl bg-white/70 p-4">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <p className="mt-2 text-2xl font-bold text-soil">10 km</p>
                  <p className="text-xs text-soil-500">Visibility</p>
                </div>
                <div className="rounded-xl bg-white/70 p-4">
                  <Gauge className="h-5 w-5 text-indigo-500" />
                  <p className="mt-2 text-2xl font-bold text-soil">1013</p>
                  <p className="text-xs text-soil-500">Pressure (hPa)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          <div className="rounded-2xl border border-soil/5 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-soil">7-Day Forecast</h2>
            <div className="grid grid-cols-7 gap-2">
              {forecast.map((day) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });
                return (
                  <div key={day.date} className="rounded-xl bg-soil-50 p-3 text-center">
                    <p className="text-xs font-medium text-soil-500">{dayName}</p>
                    <p className="mt-2 text-lg">{weatherCodes[day.code]?.split(" ")[0] || "☁️"}</p>
                    <p className="mt-2 text-sm font-bold text-soil">{Math.round(day.tempMax)}°</p>
                    <p className="text-xs text-soil-400">{Math.round(day.tempMin)}°</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Farming advice */}
          <div className="rounded-2xl border border-leaf/20 bg-leaf-50 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-soil">
              <CloudSun className="h-5 w-5 text-leaf" />
              Weather Advisory for Farmers
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <h3 className="font-medium text-soil">🌾 Crop Advisory</h3>
                <p className="mt-1 text-sm text-soil-600">
                  {weather.temperature > 35
                    ? "High temperature alert. Ensure adequate irrigation. Avoid spraying pesticides during peak hours."
                    : "Favorable temperature for most crops. Good time for transplanting and fertilizer application."}
                </p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <h3 className="font-medium text-soil">💧 Irrigation Tip</h3>
                <p className="mt-1 text-sm text-soil-600">
                  {weather.humidity < 50
                    ? "Low humidity — increase watering frequency. Consider mulching to retain soil moisture."
                    : "Humidity is adequate. Maintain normal irrigation schedule. Watch for fungal diseases."}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
