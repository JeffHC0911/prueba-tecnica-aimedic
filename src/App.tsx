import React, { useState } from "react";
import { subDays, format, startOfMonth, subMonths } from "date-fns";
import { useWeather } from "./hooks/useWeather";
import { ChartComponent } from "./components/Chart/Chart";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { WeatherData } from "./types";

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<number>(6); // Default to 6 days
  const { fetchWeatherData } = useWeather();

  // Función para manejar el cambio en el rango de fechas
  const handleRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRange(Number(event.target.value));
  };

  // Función para manejar la búsqueda por ciudad
  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const today = new Date();
      let startDate: Date;
      let endDate = subDays(today, 1); // Siempre un día antes de hoy

      // Calculamos las fechas según el rango seleccionado
      switch (range) {
        case 1:
          startDate = subDays(endDate, 1); // 1 día
          break;
        case 2:
          startDate = subDays(endDate, 2); // 2 días
          break;
        case 3:
          startDate = subDays(endDate, 3); // 3 días
          break;
        case 6:
          startDate = subDays(endDate, 6); // 6 días
          break;
        case 12:
          startDate = subDays(endDate, 12); // 12 días
          break;
        case 15:
          startDate = subDays(endDate, 15); // 15 días
          break;
        case 30:
          startDate = startOfMonth(endDate); // 1 mes
          break;
        case 90:
          startDate = subMonths(endDate, 3); // 3 meses
          break;
        case 180:
          startDate = subMonths(endDate, 6); // 6 meses
          break;
        default:
          startDate = subDays(endDate, 6); // Default: 6 días
      }

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
        
        {/* Buscador de ciudad */}
        <SearchBar onSearch={handleSearch} />

        {/* Selector de rango de fechas */}
        <div className="my-4">
          <label htmlFor="date-range" className="text-gray-700 mr-2">Rango de días:</label>
          <select
            id="date-range"
            value={range}
            onChange={handleRangeChange}
            className="border px-3 py-2 rounded-md"
          >
            <option value={1}>1 Día</option>
            <option value={2}>2 Días</option>
            <option value={3}>3 Días</option>
            <option value={6}>6 Días</option>
            <option value={12}>12 Días</option>
            <option value={15}>15 Días</option>
          </select>
        </div>

        {/* Indicadores de estado */}
        {loading && <p className="text-gray-600">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Mostrar gráfico si hay datos */}
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
