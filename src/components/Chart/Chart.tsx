import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
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
  // Preparar los datos del gráfico
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

  // Configuración de las opciones para el gráfico, incluyendo el zoom
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
          text: "Días",
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
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy', // Habilitar desplazamiento en ambos ejes (X y Y)
      },
      zoom: {
        enabled: true,
        mode: 'xy', // Habilitar zoom en ambos ejes (X y Y)
        speed: 0.1,  // Velocidad del zoom
        threshold: 2,  // Gesto mínimo para activar el zoom
      },
    },
  };

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
