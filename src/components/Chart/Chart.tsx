/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, ChartOptions, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { WeatherData } from "../../types";
import styles from "./Chart.module.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Registrar los módulos necesarios y el plugin de zoom
Chart.register(...registerables, zoomPlugin);

interface ChartProps {
  data: WeatherData;
}

export const ChartComponent: React.FC<ChartProps> = ({ data }) => {
  
  /**
   * Genera los datos del gráfico a partir de la información meteorológica.
   * Los datos incluyen etiquetas para los días y valores de temperatura.
   * 
   * @returns {object} Objeto que contiene las etiquetas y los conjuntos de datos para el gráfico.
   */
  const chartData = {
    labels: data.hourly.map(item => item.day),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: data.hourly.map(item => item.temperature),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#3B82F6",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: false,
      },
    ],
  };


  /**
   * Configuración del gráfico, incluyendo opciones de leyenda, tooltip y escalas.
   * 
   * @returns {object} Objeto de configuración para el gráfico.
   */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const item = context[0];
            const pointIndex = item.dataIndex;
            const rawDate = data.hourly[pointIndex].date;
            const formatted = format(new Date(rawDate), "PPPPp", { locale: es });
            return `Fecha y hora: ${formatted}`;
          },
          label: (context: any) => {
            return `Temperatura: ${context.parsed.y}°C`;
          },
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Temperatura (°C)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#6B7280",
        },
      },
      x: {
        title: {
          display: true,
          text: "Fechas",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
  } as const satisfies ChartOptions<"line">;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>Temperatura Diaria</h2>
        <p className={styles.chartSubtitle}>Últimos {data.hourly.length} horas en {data.city}</p>
      </div>
      <div style={{ height: "400px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
