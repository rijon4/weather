"use client";

import { describeWeatherCode } from "@/lib/weathercodes";
import type { Place } from "./SearchBar";
import type { WeatherResponse } from "@/lib/openmeteo";

function formatLocalTime(iso: string, timezone: string) {
  // Open-Meteo returns local times without a zone; keep them as-is.
  void timezone;
  return iso.replace("T", " ");
}

export default function CurrentCard({
  place,
  weather,
  isFavorite,
  onAddFavorite,
}: {
  place: Place;
  weather: WeatherResponse;
  isFavorite: boolean;
  onAddFavorite: (p: Place) => void;
}) {
  const { current, daily, timezone, unit } = weather;
  const desc = describeWeatherCode(current.weatherCode);
  const today = daily[0];
  const unitLabel = unit === "fahrenheit" ? "°F" : "°C";

  const handleSave = () => onAddFavorite(place);

  return (
    <div className="card current">
      <div className="top">
        <div>
          <div className="place">
            {place.name}
            <button
              className="save-btn"
              style={{ width: "auto", display: "inline-block", marginLeft: 12, padding: "5px 12px" }}
              onClick={handleSave}
              disabled={isFavorite}
              title={isFavorite ? "Already a favorite" : "Add to favorites"}
            >
              {isFavorite ? "⭐ Saved" : "☆ Add to favorites"}
            </button>
          </div>
          <div className="place-sub">
            {[place.admin1, place.country].filter(Boolean).join(", ")} ·{" "}
            {place.latitude.toFixed(2)}, {place.longitude.toFixed(2)} ·{" "}
            {weather.timezone}
          </div>
          <div className="updated">
            Updated {formatLocalTime(current.time, timezone)} (local time)
          </div>
        </div>
        <div className="big-emoji" aria-hidden>
          {current.isDay ? desc.emoji : desc.emoji === "☀️" ? "🌙" : desc.emoji}
        </div>
      </div>

      <div className="main">
        <div className="temp">
          {Math.round(current.temperature)}
          <span className="deg">{unitLabel}</span>
        </div>
        <div className="conditions">
          <div className="desc">{desc.label}</div>
          <div className="feels">
            Feels like {Math.round(current.apparentTemperature)}{unitLabel}
          </div>
          {today && (
            <div className="feels">
              ↑ {Math.round(today.tempMax)}{unitLabel} / ↓ {Math.round(today.tempMin)}
              {unitLabel}
            </div>
          )}
        </div>
      </div>

      <div className="details-grid">
        <div className="detail">
          <div className="label">Humidity</div>
          <div className="value">{current.humidity}%</div>
        </div>
        <div className="detail">
          <div className="label">Wind</div>
          <div className="value">{Math.round(current.windSpeed)} km/h</div>
        </div>
        <div className="detail">
          <div className="label">Pressure</div>
          <div className="value">{Math.round(current.pressure)} hPa</div>
        </div>
        <div className="detail">
          <div className="label">Precipitation</div>
          <div className="value">{current.precipitation} mm</div>
        </div>
        {today && (
          <>
            <div className="detail">
              <div className="label">🌅 Sunrise</div>
              <div className="value">{today.sunrise.slice(11)}</div>
            </div>
            <div className="detail">
              <div className="label">🌇 Sunset</div>
              <div className="value">{today.sunset.slice(11)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
