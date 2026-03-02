import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { vendasPorCategoria } from "../../mock/grafico";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

ChartJS.register(ChartDataLabels);

export default function ProdutosPorCategoriaGrafico() {
  const chartData = {
    labels: vendasPorCategoria.map((item) => item.categoria),
    datasets: [
      {
        label: "Produtos Vendidos",
        data: vendasPorCategoria.map((item) => item.vendidos),
        borderColor: "#6A0DAD",
        backgroundColor: "#6A0DAD33",
        borderWidth: 3,
        pointBackgroundColor: "#6A0DAD",
        pointRadius: 5,
        tension: 0.3, // deixa a linha levemente curva
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "top",
        formatter: (value) => value,
        font: {
          weight: 600,
          size: 14,
        },
      },
    },

    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#000",
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
          color: "#000",
        },
      },
    },
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
