import WeatherApp from "@/components/WeatherApp";

export default function HomePage() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="logo">🌤️</span>
          <span>Weather</span>
        </div>
      </header>
      <WeatherApp />
    </div>
  );
}
