# 🌤️ Weather App

A full-stack weather application built with **Next.js (App Router)**, **Prisma + SQLite**, and the free **Open-Meteo** APIs (no API key required).

## Features

- **Live current conditions** — temperature, feels-like, humidity, wind, pressure, precipitation, sunrise/sunset
- **City search** — debounced autocomplete against Open-Meteo's geocoding API
- **7-day forecast** — with min/max temperature range bars
- **Next 12 hours** — hourly temperature strip with weather icons
- **Saved locations (favorites)** — persisted in SQLite via Prisma, add/remove from anywhere in the UI
- **°C / °F toggle** — server renders the data in the requested unit
- Responsive dark-glass UI, no CSS framework needed

## Project structure

```
app/
  api/
    weather/route.ts        GET  /api/weather?latitude=&longitude=&unit=c|f
    geocode/route.ts        GET  /api/geocode?q=city
    favorites/route.ts      GET | POST /api/favorites
    favorites/[id]/route.ts DELETE /api/favorites/:id
  layout.tsx, page.tsx, globals.css
components/
  WeatherApp.tsx            Client state container
  SearchBar.tsx             Debounced city search
  Favorites.tsx             Saved-locations sidebar
  CurrentCard.tsx           Current conditions
  HourlyStrip.tsx           Next-12-hours strip
  DailyForecast.tsx         7-day list with range bars
lib/
  openmeteo.ts              Server-side Open-Meteo client + types
  weathercodes.ts           WMO code → label/emoji mapping
  db.ts                     Singleton Prisma client
prisma/
  schema.prisma             Favorite model (SQLite)
  dev.db                    SQLite database (generated)
```

## Getting started

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev            # http://localhost:3000
```

## Useful scripts

| Command           | What it does                        |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the dev server                |
| `npm run build`   | Production build (includes Prisma)  |
| `npm start`       | Run the production build            |
| `npm run db:push` | Sync the Prisma schema to SQLite    |
| `npm run studio`  | Browse the database in Prisma Studio|

## Data sources

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs) — current, hourly, and daily weather
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) — city name → coordinates
