"use client";

import { describeWeatherCode } from "@/lib/weathercodes";
import type { WeatherResponse } from "@/lib/openmeteo";

export default function HourlyStrip({ weather }: { weather: WeatherResponse }) {
  const deg = weather.unit === "fahrenheit" ? "°F" : "°";
  const hours = weather.hourly.slice(0, 12);

  return (
    <div className="card hourly">
      <h2>Next 12 hours</h2>
      <div className="hourly-row">
        {hours.map((h, i) => {
          const desc = describeWeatherCode(h.weatherCode);
          return (
            <div className="hour" key={h.time}>
              <div className="h-time">{i === 0 ? "Now" : h.time.slice(11, 16)}</div>
              <div className="h-emoji">{desc.emoji}</div>
              <div className="h-temp">
                {Math.round(h.temperature)}
                {deg}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
