"use client";

import { describeWeatherCode } from "@/lib/weathercodes";
import type { WeatherResponse } from "@/lib/openmeteo";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyForecast({
  weather,
}: {
  weather: WeatherResponse;
}) {
  const daily = weather.daily;
  const allTemps = daily.flatMap((d) => [d.tempMin, d.tempMax]);
  const weekMin = Math.min(...allTemps);
  const weekMax = Math.max(...allTemps);
  const range = Math.max(weekMax - weekMin, 1);

  return (
    <div className="card forecast">
      <h2>7-day forecast</h2>
      <ul className="day-list">
        {daily.map((d, i) => {
          const date = new Date(`${d.date}T12:00:00`);
          const desc = describeWeatherCode(d.weatherCode);
          const left = ((d.tempMin - weekMin) / range) * 100;
          const width = ((d.tempMax - d.tempMin) / range) * 100;

          return (
            <li className="day" key={d.date}>
              <div className="d-name">
                {i === 0 ? "Today" : DAY_NAMES[date.getDay()]}
                <span>{d.date.slice(5)}</span>
              </div>
              <div className="d-emoji" title={desc.label}>
                {desc.emoji}
              </div>
              <div className="d-tempbar">
                <span>{Math.round(d.tempMin)}°</span>
                <span className="bar">
                  <span
                    className="fill"
                    style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
                  />
                </span>
                <span>{Math.round(d.tempMax)}°</span>
              </div>
              <div className="d-precip">
                💧 {d.precipitationSum.toFixed(1)} mm
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
