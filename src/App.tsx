import React, { useState, useEffect } from "react";
import { subDays, format} from "date-fns";
import { useWeather } from "./hooks/useWeather";
import { ChartComponent } from "./components/Chart/Chart";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { DateRangeSelect } from "./components/DateRangeSelect/DateRangeSelect";
import { WeatherData } from "./types";
import { utils, writeFile } from "xlsx";
import { AiOutlineDownload } from "react-icons/ai";
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

  /**
   * 
   * @param city Nombre de la ciudad a buscar
   * @returns {void}
   * 
   * Función que se encarga de buscar el clima de una ciudad.
   * Realiza una llamada a la API para obtener los datos
   * del clima en un rango de fechas determinado.
   * 
   * @throws {Error} Si la ciudad no es encontrada o si hay un error en la API
   */
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
        case 12: startDate = subDays(endDate, 11); break;
        case 15: startDate = subDays(endDate, 14); break;
        default: startDate = subDays(endDate, 6);
      }

      /**
       * Llamada a la API para obtener los datos del clima.
       * Se utiliza la función fetchWeatherData que se encarga de
       * realizar la petición a la API y formatear los datos.
       * 
       * @param city Nombre de la ciudad a buscar
       * @param startDate Fecha de inicio del rango
       * @param endDate Fecha de fin del rango
       * @returns {Promise<WeatherData>} Datos del clima
       * 
       * @throws {Error} Si la ciudad no es encontrada o si hay un error en la API
       */
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

  /**
   * 
   * @param city Nombre de la ciudad a buscar
   * @returns {void}
   * 
   * Función que maneja la búsqueda de clima al hacer submit en el formulario.
   * Se encarga de actualizar el estado de la ciudad buscada y llamar a la función
   * fetchWeather para obtener los datos del clima.
   */
  const handleSearch = (city: string) => {
    setSearchedCity(city);
    fetchWeather(city);
  };

  /**
   * 
   * @returns {void}
   * 
   * Función que exporta los datos del clima a un archivo XLSX.
   * Utiliza la librería xlsx para crear un archivo Excel con los datos
   * de temperatura y fecha. El archivo se descarga automáticamente.
   */
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

  /**
   * 
   * @returns {void}
   * 
   * Función que exporta los datos del clima a un archivo CSV.
   * Crea un archivo CSV con los datos de temperatura y fecha.
   * El archivo se descarga automáticamente.
   * Utiliza el formato UTF-8 para asegurar la compatibilidad con caracteres especiales.
   */
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
              <div className="exportButtons">
                <button onClick={exportToXLSX} className="exportBtn xlsx">
              <AiOutlineDownload />
                  Excel
                </button>
                <button onClick={exportToCSV} className="exportBtn csv">
              <AiOutlineDownload />
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