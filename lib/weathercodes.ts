/** Map WMO weather codes (used by Open-Meteo) to a label + emoji. */
export function describeWeatherCode(code: number): {
  label: string;
  emoji: string;
} {
  switch (code) {
    case 0:
      return { label: "Clear sky", emoji: "☀️" };
    case 1:
      return { label: "Mainly clear", emoji: "🌤️" };
    case 2:
      return { label: "Partly cloudy", emoji: "⛅" };
    case 3:
      return { label: "Overcast", emoji: "☁️" };
    case 45:
    case 48:
      return { label: "Fog", emoji: "🌫️" };
    case 51:
    case 53:
    case 55:
      return { label: "Drizzle", emoji: "🌦️" };
    case 56:
    case 57:
      return { label: "Freezing drizzle", emoji: "🌧️" };
    case 61:
      return { label: "Light rain", emoji: "🌦️" };
    case 63:
      return { label: "Rain", emoji: "🌧️" };
    case 65:
      return { label: "Heavy rain", emoji: "⛈️" };
    case 66:
    case 67:
      return { label: "Freezing rain", emoji: "🌧️" };
    case 71:
      return { label: "Light snow", emoji: "🌨️" };
    case 73:
      return { label: "Snow", emoji: "❄️" };
    case 75:
      return { label: "Heavy snow", emoji: "❄️" };
    case 77:
      return { label: "Snow grains", emoji: "🌨️" };
    case 80:
    case 81:
      return { label: "Rain showers", emoji: "🌦️" };
    case 82:
      return { label: "Violent showers", emoji: "⛈️" };
    case 85:
    case 86:
      return { label: "Snow showers", emoji: "🌨️" };
    case 95:
      return { label: "Thunderstorm", emoji: "⛈️" };
    case 96:
    case 99:
      return { label: "Thunderstorm w/ hail", emoji: "⛈️" };
    default:
      return { label: "Unknown", emoji: "🌡️" };
  }
}
