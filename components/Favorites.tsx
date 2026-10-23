"use client";

import type { Place } from "./SearchBar";

export default function Favorites({
  favorites,
  currentPlace,
  isCurrentFavorite,
  onSelect,
  onRemove,
}: {
  favorites: (Place & { id: number })[];
  currentPlace: Place;
  isCurrentFavorite: boolean;
  onSelect: (p: Place) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="card favorites">
      <h2>⭐ Saved locations</h2>
      {favorites.length === 0 ? (
        <p className="fav-empty">
          No saved locations yet — search for a city and add it to see quick
          access here.
        </p>
      ) : (
        <ul className="fav-list">
          {favorites.map((f) => (
            <li
              key={f.id}
              className={`fav-item ${
                currentPlace.latitude === f.latitude &&
                currentPlace.longitude === f.longitude
                  ? "current"
                  : ""
              }`}
              onClick={() =>
                onSelect({
                  id: f.id,
                  name: f.name,
                  country: f.country,
                  admin1: f.admin1,
                  latitude: f.latitude,
                  longitude: f.longitude,
                })
              }
              title={`Show weather for ${f.name}`}
            >
              <div>
                <div className="fav-name">{f.name}</div>
                <div className="fav-sub">
                  {[f.admin1, f.country].filter(Boolean).join(", ") || "—"}
                </div>
              </div>
              <button
                className="fav-remove"
                aria-label={`Remove ${f.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(f.id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
