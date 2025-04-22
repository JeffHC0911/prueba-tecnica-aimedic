// src/types.ts
export type WeatherDataPoint = {
  day: string; // Formateado para mostrar (ej: "Apr 15")
  date: string; // Formato ISO (ej: "2023-04-15")
  temperature: number;
};

export type WeatherData = {
  city: string;
  hourly: WeatherDataPoint[];
};
  
  export type Coordinates = {
    lat: number;
    lon: number;
  };