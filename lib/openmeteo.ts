/**
 * Server-side helpers for talking to the Open-Meteo APIs.
 * Docs: https://open-meteo.com/en/docs — free, no API key required.
 */

export const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export interface GeoPlace {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  pressure: number;
  isDay: boolean;
  time: string;
}

export interface DailyWeather {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  weatherCode: number;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  /** Unit the data is actually rendered in ("celsius" | "fahrenheit") */
  unit: "celsius" | "fahrenheit";
  current: CurrentWeather;
  daily: DailyWeather[];
  hourly: HourlyPoint[];
}

const FORECAST_PARAMS = new URLSearchParams({
  current:
    "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure",
  daily:
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,wind_speed_10m_max",
  hourly: "temperature_2m,weather_code",
  timezone: "auto",
  forecast_days: "7",
  forecast_hours: "24",
});

/** Look up place names ("Zurich", "New York") via Open-Meteo geocoding. */
export async function searchPlaces(query: string): Promise<GeoPlace[]> {
  const url = `${GEOCODING_URL}?${new URLSearchParams({
    name: query,
    count: "8",
    language: "en",
    format: "json",
  })}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`);
  const data = (await res.json()) as {
    results?: Array<{
      id: number;
      name: string;
      country?: string;
      admin1?: string;
      latitude: number;
      longitude: number;
    }>;
  };
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

/** Fetch current weather + 7-day daily + next-24h hourly for a coordinate. */
export async function getWeather(
  latitude: number,
  longitude: number,
  temperatureUnit: "celsius" | "fahrenheit" = "celsius"
): Promise<WeatherResponse> {
  const params = new URLSearchParams(FORECAST_PARAMS);
  params.set("latitude", latitude.toString());
  params.set("longitude", longitude.toString());
  params.set("temperature_unit", temperatureUnit);
  params.set("wind_speed_unit", "kmh");

  const res = await fetch(`${FORECAST_URL}?${params}`, {
    next: { revalidate: 600 }, // cache for 10 minutes
  });
  if (!res.ok) throw new Error(`Forecast request failed (${res.status})`);

  const raw = (await res.json()) as {
    latitude: number;
    longitude: number;
    timezone: string;
    current: {
      time: string;
      temperature_2m: number;
      relative_humidity_2m: number;
      apparent_temperature: number;
      is_day: number;
      precipitation: number;
      weather_code: number;
      wind_speed_10m: number;
      surface_pressure: number;
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_sum: number[];
      wind_speed_10m_max: number[];
      sunrise: string[];
      sunset: string[];
    };
    hourly: {
      time: string[];
      temperature_2m: number[];
      weather_code: number[];
    };
  };

  const daily: DailyWeather[] = raw.daily.time.map((date, i) => ({
    date,
    weatherCode: raw.daily.weather_code[i],
    tempMax: raw.daily.temperature_2m_max[i],
    tempMin: raw.daily.temperature_2m_min[i],
    precipitationSum: raw.daily.precipitation_sum[i],
    windSpeedMax: raw.daily.wind_speed_10m_max[i],
    sunrise: raw.daily.sunrise[i],
    sunset: raw.daily.sunset[i],
  }));

  const hourly: HourlyPoint[] = raw.hourly.time.map((time, i) => ({
    time,
    temperature: raw.hourly.temperature_2m[i],
    weatherCode: raw.hourly.weather_code[i],
  }));

  return {
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    unit: temperatureUnit,
    current: {
      time: raw.current.time,
      temperature: raw.current.temperature_2m,
      apparentTemperature: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      precipitation: raw.current.precipitation,
      weatherCode: raw.current.weather_code,
      windSpeed: raw.current.wind_speed_10m,
      pressure: raw.current.surface_pressure,
      isDay: raw.current.is_day === 1,
    },
    daily,
    hourly,
  };
}
