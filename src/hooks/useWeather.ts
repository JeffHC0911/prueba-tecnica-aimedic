import axios from "axios";
import { format } from "date-fns";
import { WeatherData, Coordinates } from "../types";

export const useWeather = () => {
  const fetchCoordinates = async (city: string): Promise<Coordinates> => {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    if (!response.data.results) throw new Error("Ciudad no encontrada");
    const { latitude: lat, longitude: lon } = response.data.results[0];
    return { lat, lon };
  };

  const fetchWeatherData = async (
    city: string,
    startDate: string,
    endDate: string
  ): Promise<WeatherData> => {
    const { lat, lon } = await fetchCoordinates(city);
    const response = await axios.get(
      `https://archive-api.open-meteo.com/v1/era5?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m`
    );
    
    // Aquí estamos eliminando la propiedad 'data' porque es redundante.
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
