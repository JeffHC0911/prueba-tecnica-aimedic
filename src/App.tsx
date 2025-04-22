import React, { useState } from "react";
import { subDays, format } from "date-fns";
import { useWeather } from "./hooks/useWeather";
import { ChartComponent } from "./components/Chart/Chart";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { WeatherData } from "./types";

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchWeatherData } = useWeather();

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const endDate = subDays(today, 1);
      const startDate = subDays(endDate, 6);
  
      const formattedStart = format(startDate, "yyyy-MM-dd");
      const formattedEnd = format(endDate, "yyyy-MM-dd");
  
      const data = await fetchWeatherData(city, formattedStart, formattedEnd);
      setWeatherData(data);
    } catch (err) {
      setError("Ciudad no encontrada. Intenta con otro nombre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Clima Histórico</h1>
        <SearchBar onSearch={handleSearch} />
        
        {loading && <p className="text-gray-600">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {weatherData && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">
              Temperatura en {weatherData.city}
            </h2>
            <ChartComponent data={weatherData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
