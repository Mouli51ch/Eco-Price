import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PriceHistory = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price History'
      }
    }
  };

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Amazon',
        data: data.map(d => d.amazonPrice),
        borderColor: '#FF9900',
        tension: 0.1
      },
      {
        label: 'Flipkart',
        data: data.map(d => d.flipkartPrice),
        borderColor: '#2874F0',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <Line options={options} data={chartData} />
    </div>
  );
};