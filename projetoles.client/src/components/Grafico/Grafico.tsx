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
import { ChartWrap } from "./style";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ChartSeries {
  label: string;
  data: number[];
  color: string;
}

interface Props {
  labels: string[];
  series: ChartSeries[];
}

export default function ProdutosGrafico({ labels, series }: Props) {
  const chartData = {
    labels,
    datasets: series.map((item) => ({
      label: item.label,
      data: item.data,
      borderColor: item.color,
      backgroundColor: `${item.color}22`,
      borderWidth: 3,
      pointBackgroundColor: item.color,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.28,
      fill: false,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Período",
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantidade vendida",
        },
      },
    },
  };

  return (
    <ChartWrap>
      <Line data={chartData} options={options} />
    </ChartWrap>
  );
}
