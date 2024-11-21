import React from "react";
import { Line } from "react-chartjs-2";
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MainContent = () => {
  // Sample sales data for the graph
  const salesData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Daily Sales",
        data: [300, 450, 320, 600, 400, 480, 700],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Weekly Sales",
        data: [1500, 2000, 1700, 2100, 1800, 2300, 2500],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Monthly Sales",
        data: [7000, 8000, 7500, 9000, 8500, 9500, 11000],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Overview",
      },
    },
  };

  return (
    <main className="p-6 bg-black text-white min-h-screen">
      {/* Sales Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        {/* Daily Sales Card */}
        <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
          <h3 className="text-xl font-semibold mb-2">Daily Sales</h3>
          <p className="text-3xl font-bold">$700</p>
        </div>

        {/* Weekly Sales Card */}
        <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
          <h3 className="text-xl font-semibold mb-2">Weekly Sales</h3>
          <p className="text-3xl font-bold">$2,500</p>
        </div>

        {/* Monthly Sales Card */}
        <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
          <h3 className="text-xl font-semibold mb-2">Monthly Sales</h3>
          <p className="text-3xl font-bold">$10,000</p>
        </div>
      </div>

      {/* Sales Graph */}
      <div className="bg-black p-6 rounded-lg shadow border-2 border-white">
        <h3 className="text-xl font-semibold mb-4">Sales Graph</h3>
        <Line data={salesData} options={options} />
      </div>
    </main>
  );
};

export default MainContent;
