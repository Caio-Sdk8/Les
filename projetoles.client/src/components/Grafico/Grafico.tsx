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
import { vendasPorProduto } from "../../mock/grafico";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels,
);

interface Props {
  produtoSelecionado: string;
}

export default function ProdutosGrafico({ produtoSelecionado }: Props) {
  const produto = vendasPorProduto.find(
    (item) => item.produto === produtoSelecionado,
  );

  if (!produto) return null;

  const chartData = {
    labels: produto.vendas.map((item) => item.periodo),
    datasets: [
      {
        label: `Vendas de ${produtoSelecionado}`,
        data: produto.vendas.map((item) => item.quantidade),
        borderColor: "#6A0DAD",
        backgroundColor: "#6A0DAD33",
        borderWidth: 3,
        pointBackgroundColor: "#6A0DAD",
        pointRadius: 5,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "top",
        font: {
          weight: 600,
          size: 14,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mês", // 👈 aqui você pode mudar para "Ano"
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantidade Vendida",
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
