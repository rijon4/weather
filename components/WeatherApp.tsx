"use client";

import { useCallback, useEffect, useState } from "react";
import SearchBar, { type Place } from "./SearchBar";
import Favorites from "./Favorites";
import CurrentCard from "./CurrentCard";
import HourlyStrip from "./HourlyStrip";
import DailyForecast from "./DailyForecast";
import type { WeatherResponse } from "@/lib/openmeteo";

export type Unit = "c" | "f";

const DEFAULT_PLACE: Place = {
  id: 5128581,
  name: "New York",
  country: "United States",
  admin1: "New York",
  latitude: 40.7143,
  longitude: -74.006,
};

export default function WeatherApp() {
  const [unit, setUnit] = useState<Unit>("c");
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Place[]>([]);

  /* --- favorites ------------------------------------------------------------ */

  const loadFavorites = useCallback(async () => {
    try {
      const res = await fetch("/api/favorites");
      const data = (await res.json()) as { favorites?: (Place & { id: number })[] };
      setFavorites(data.favorites ?? []);
      return data.favorites ?? [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = async (p: Place) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: p.name,
          country: p.country,
          admin1: p.admin1,
          latitude: p.latitude,
          longitude: p.longitude,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await loadFavorites();
    } catch {
      setError("Could not save this location as a favorite.");
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      const res = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setError("Could not remove this favorite.");
    }
  };

  const isCurrentFavorite = favorites.some(
    (f) =>
      Math.abs(f.latitude - place.latitude) < 0.001 &&
      Math.abs(f.longitude - place.longitude) < 0.001
  );

  /* --- weather ---------------------------------------------------------------- */

  const fetchWeather = useCallback(
    async (p: Place, u: Unit) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/weather?latitude=${p.latitude}&longitude=${p.longitude}&unit=${u}`
        );
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }
        setWeather((await res.json()) as WeatherResponse);
      } catch (e) {
        setWeather(null);
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchWeather(place, unit);
  }, [place, unit, fetchWeather]);

  const handleSelect = (p: Place) => setPlace(p);

  return (
    <>
      <SearchBar onSelect={handleSelect} />
      <div
        className="app-header"
        style={{ marginTop: 16, marginBottom: 16 }}
      >
        <span style={{ color: "var(--text-dim)" }}>
          Live weather powered by Open-Meteo
        </span>
        <div className="unit-toggle" role="group" aria-label="Temperature unit">
          <button
            className={unit === "c" ? "active" : ""}
            onClick={() => setUnit("c")}
          >
            °C
          </button>
          <button
            className={unit === "f" ? "active" : ""}
            onClick={() => setUnit("f")}
          >
            °F
          </button>
        </div>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="layout">
        <aside>
          <Favorites
            favorites={favorites}
            currentPlace={place}
            isCurrentFavorite={isCurrentFavorite}
            onSelect={setPlace}
            onRemove={removeFavorite}
          />
        </aside>

        <main>
          {loading && !weather ? (
            <div className="status">
              <span className="spinner" /> Loading weather for {place.name}…
            </div>
          ) : weather ? (
            <>
              <CurrentCard
                place={place}
                weather={weather}
                onAddFavorite={addFavorite}
                isFavorite={isCurrentFavorite}
              />
              <HourlyStrip weather={weather} />
              <DailyForecast weather={weather} />
            </>
          ) : !loading ? (
            <div className="status">No weather data available.</div>
          ) : null}
          {loading && weather && (
            <div className="status" style={{ padding: "12px 20px" }}>
              <span className="spinner" style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: "0.85rem" }}>Refreshing…</span>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
