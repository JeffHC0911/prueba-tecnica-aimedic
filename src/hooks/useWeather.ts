import axios from "axios";
import { format } from "date-fns";
import { WeatherData, Coordinates } from "../types";

export const useWeather = () => {

  /**
   * 
   * @param city Nombre de la ciudad a buscar
   * @description Función que busca las coordenadas de una ciudad utilizando la API de Open Meteo.
   * @throws Error si la ciudad no es encontrada
   * @returns { lat: number, lon: number } Coordenadas de la ciudad
   */
  const fetchCoordinates = async (city: string): Promise<Coordinates> => {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    if (!response.data.results) throw new Error("Ciudad no encontrada");
    const { latitude: lat, longitude: lon } = response.data.results[0];
    return { lat, lon };
  };

  /**
   * 
   * @param city Nombre de la ciudad a buscar
   * @param startDate 
   * @param endDate 
   * @returns { city: string, hourly: WeatherDataPoint[] } Datos del clima de la ciudad
   * @description Función que busca los datos del clima de una ciudad utilizando la API de Open Meteo.
   */
  const fetchWeatherData = async (
    city: string,
    startDate: string,
    endDate: string
  ): Promise<WeatherData> => {
    const { lat, lon } = await fetchCoordinates(city);
    const response = await axios.get(
      `https://archive-api.open-meteo.com/v1/era5?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m`
    );
    
    /**
     * * @description Mapea los datos de la respuesta a un formato más manejable.
     * @param time Tiempo en formato ISO
     * @param i Índice del array
     * @returns { date: string, day: string, temperature: number } Objeto con la fecha, día y temperatura
     * @description Formatea la fecha a "dd/MM/yyyy" y la temperatura a un número.
     * @throws Error si la ciudad no es encontrada
     */
    const hourlyData = response.data.hourly.time.map((time: string, i: number) => ({
      date: time,
      day: format(new Date(time), "dd/MM/yyyy"),
      temperature: response.data.hourly.temperature_2m[i],
    }));

    return {
      city,
      hourly: hourlyData, // Solo una propiedad 'hourly' es suficiente
    };
  };

  return { fetchWeatherData };
};
