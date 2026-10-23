"use client";

import { useEffect, useRef, useState } from "react";

export interface Place {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface SearchResult extends Place {}

export default function SearchBar({
  onSelect,
}: {
  onSelect: (place: Place) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  /* debounce the geocoding lookup */
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`);
        const data = (await res.json()) as { results?: SearchResult[] };
        if (!cancelled) {
          setResults(data.results ?? []);
          setOpen(true);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  /* close when clicking outside */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pick = (p: Place) => {
    onSelect(p);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="card search-panel" ref={boxRef}>
      <input
        className="search-input"
        type="text"
        placeholder="Search for a city… (e.g. Zurich, Tokyo, São Paulo)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        aria-label="Search for a city"
      />
      {searching && (
        <div className="updated" style={{ marginTop: 6 }}>
          Searching…
        </div>
      )}
      {open && results.length > 0 && (
        <ul className="search-results">
          {results.map((r) => (
            <li key={`${r.id}-${r.latitude}-${r.longitude}`} onClick={() => pick(r)}>
              <div className="result-title">{r.name}</div>
              <div className="result-sub">
                {[r.admin1, r.country].filter(Boolean).join(", ") || "—"}
              </div>
            </li>
          ))}
        </ul>
      )}
      {open && !searching && results.length === 0 && query.trim().length >= 2 && (
        <div className="updated" style={{ marginTop: 6 }}>
          No matches found.
        </div>
      )}
    </div>
  );
}
