import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StockChart({ dates, prices }) {
  const data = {
    labels: dates,
    datasets: [
      {
        label: "Stock Price",
        data: prices,
      },
    ],
  };

  return (
    <div className="chart-container">
        <h3>5-Year Stock Performance</h3>
        <Line data={data} />
    </div>
    );
}

export default StockChart;