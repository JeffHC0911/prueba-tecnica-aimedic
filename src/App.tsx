import React, { useState, useEffect } from "react";
import { subDays, format, startOfMonth, subMonths } from "date-fns";
import { useWeather } from "./hooks/useWeather";
import { ChartComponent } from "./components/Chart/Chart";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { DateRangeSelect } from "./components/DateRangeSelect/DateRangeSelect";
import { WeatherData } from "./types";
import './App.css';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<number>(6);
  const [searchedCity, setSearchedCity] = useState<string>("");
  const { fetchWeatherData } = useWeather();

  // Efecto para cambios de rango
  useEffect(() => {
    if (searchedCity) {
      fetchWeather(searchedCity);
    }
  }, [range]);

  // Función unificada de búsqueda
  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const today = new Date();
      let startDate: Date;
      const endDate = subDays(today, 1);

      switch (range) {
        case 1: startDate = subDays(endDate, 1); break;
        case 2: startDate = subDays(endDate, 2); break;
        case 3: startDate = subDays(endDate, 3); break;
        case 6: startDate = subDays(endDate, 6); break;
        case 12: startDate = subDays(endDate, 12); break;
        case 15: startDate = subDays(endDate, 15); break;
        default: startDate = subDays(endDate, 6);
      }

      const data = await fetchWeatherData(
        city,
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      
      setWeatherData(data);
    } catch (err) {
      setError("Ciudad no encontrada. Intenta con otro nombre.");
    } finally {
      setLoading(false);
    }
  };

  // Handler de búsqueda manual
  const handleSearch = (city: string) => {
    setSearchedCity(city);
    fetchWeather(city); // Usamos el valor actual directamente
  };

  return (
    <div className="appContainer">
      <div className="mainContent">
        <h1 className="header">
          <span className="title">Clima Histórico</span>
        </h1>

        <SearchBar onSearch={handleSearch} loading={loading} />
        <DateRangeSelect value={range} onChange={setRange} />

        {loading && <p className="loadingMessage">Cargando...</p>}
        {error && <p className="errorMessage">{error}</p>}

        {weatherData && (
          <div className="weatherResult">
            <h2 className="locationTitle">Temperatura en {weatherData.city}</h2>
            <ChartComponent data={weatherData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;