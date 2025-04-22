import React, { useState, useEffect } from "react";
import { subDays, format, startOfMonth, subMonths } from "date-fns";
import { useWeather } from "./hooks/useWeather";
import { ChartComponent } from "./components/Chart/Chart";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { DateRangeSelect } from "./components/DateRangeSelect/DateRangeSelect";
import { WeatherData } from "./types";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import './App.css';


const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<number>(6);
  const [searchedCity, setSearchedCity] = useState<string>("");
  const { fetchWeatherData } = useWeather();

  useEffect(() => {
    if (searchedCity) {
      fetchWeather(searchedCity);
    }
  }, [range]);

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
        case 30: startDate = startOfMonth(endDate); break;
        case 90: startDate = subMonths(endDate, 3); break;
        case 180: startDate = subMonths(endDate, 6); break;
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

  const handleSearch = (city: string) => {
    setSearchedCity(city);
    fetchWeather(city);
  };

  const exportToXLSX = () => {
    if (!weatherData) return;
    
    const worksheet = utils.json_to_sheet(
      weatherData.hourly.map(t => ({
        Fecha: t.date,
        "Temperatura (°C)": t.temperature
      }))
    );
    
    worksheet["!cols"] = [{ wch: 15 }, { wch: 12 }];
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Datos");
    writeFile(workbook, `Clima_${weatherData.city}.xlsx`);
  };

  const exportToCSV = () => {
    if (!weatherData) return;
    
    const csvContent = [
      "Fecha,Temperatura (°C)",
      ...weatherData.hourly.map(t => 
        `${t.date},${t.temperature}`
      )
    ].join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Clima_${weatherData.city}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className="reportHeader">
              <h2 className="locationTitle">Temperatura en {weatherData.city}</h2>
              <div className="exportButtons">
                <button onClick={exportToXLSX} className="exportBtn xlsx">
                  Excel
                </button>
                <button onClick={exportToCSV} className="exportBtn csv">
                  CSV
                </button>
              </div>
            </div>
            <ChartComponent data={weatherData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;