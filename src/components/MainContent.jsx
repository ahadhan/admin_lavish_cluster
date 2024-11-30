// import React from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const MainContent = () => {
//   // Sample sales data for the graph
//   const salesData = {
//     labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
//     datasets: [
//       {
//         label: "Daily Sales",
//         data: [300, 450, 320, 600, 400, 480, 700],
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//       },
//       {
//         label: "Weekly Sales",
//         data: [1500, 2000, 1700, 2100, 1800, 2300, 2500],
//         borderColor: "rgba(54, 162, 235, 1)",
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//       },
//       {
//         label: "Monthly Sales",
//         data: [7000, 8000, 7500, 9000, 8500, 9500, 11000],
//         borderColor: "rgba(255, 99, 132, 1)",
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Sales Overview",
//       },
//     },
//   };

//   return (
//     <main className="p-6 bg-black text-white min-h-screen">
//       {/* Sales Cards */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
//         {/* Daily Sales Card */}
//         <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
//           <h3 className="text-xl font-semibold mb-2">Daily Sales</h3>
//           <p className="text-3xl font-bold">$700</p>
//         </div>

//         {/* Weekly Sales Card */}
//         <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
//           <h3 className="text-xl font-semibold mb-2">Weekly Sales</h3>
//           <p className="text-3xl font-bold">$2,500</p>
//         </div>

//         {/* Monthly Sales Card */}
//         <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
//           <h3 className="text-xl font-semibold mb-2">Monthly Sales</h3>
//           <p className="text-3xl font-bold">$10,000</p>
//         </div>
//       </div>

//       {/* Sales Graph */}
//       <div className="bg-black p-6 rounded-lg shadow border-2 border-white">
//         <h3 className="text-xl font-semibold mb-4">Sales Graph</h3>
//         <Line data={salesData} options={options} />
//       </div>
//     </main>
//   );
// };

// export default MainContent;

import React, { useState, useEffect } from "react";
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
import { db } from "../lib/firebase"; // Make sure your firebase setup is correct

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MainContent = () => {
  const [salesData, setSalesData] = useState({
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    totalSales: 0,
  });

  const [orderData, setOrderData] = useState({
    pendingOrders: 0,
    completedOrders: 0,
    inProgressOrders: 0,
    canceledOrders: 0,
  });

  const [graphData, setGraphData] = useState({
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Daily Sales",
        data: [0, 0, 0, 0, 0, 0, 0], // Default empty data
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Weekly Sales",
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Monthly Sales",
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders data from Firestore
        const ordersSnapshot = await db.collection("orders").get();
        const orders = ordersSnapshot.docs.map((doc) => doc.data());

        // Categorize orders by status
        const pendingOrders = orders.filter(order => order.orderStatus === "Pending");
        const completedOrders = orders.filter(order => order.orderStatus === "Completed");
        const inProgressOrders = orders.filter(order => order.orderStatus === "In Progress");
        const canceledOrders = orders.filter(order => order.orderStatus === "Canceled");

        // Set order data counts
        setOrderData({
          pendingOrders: pendingOrders.length,
          completedOrders: completedOrders.length,
          inProgressOrders: inProgressOrders.length,
          canceledOrders: canceledOrders.length,
        });

        // Calculate total sales and breakdown for completed orders
        const totalSales = completedOrders.reduce((total, order) => total + order.price, 0);
        const dailySales = completedOrders.filter(order => {
          const createdAt = new Date(order.createdAt);
          return createdAt.toDateString() === new Date().toDateString(); // Same day as today
        }).reduce((total, order) => total + order.price, 0);

        // Assume weekly and monthly sales are based on the current date
        const currentWeek = new Date().getWeek();
        const currentMonth = new Date().getMonth();
                  
        const weeklySales = completedOrders.filter(order => {   
          const createdAt = new Date(order.createdAt);
          return createdAt.getWeek() === currentWeek;
        }).reduce((total, order) => total + order.price, 0);

        const monthlySales = completedOrders.filter(order => {
          const createdAt = new Date(order.createdAt);
          return createdAt.getMonth() === currentMonth;
        }).reduce((total, order) => total + order.price, 0);

        // Set sales data
        setSalesData({
          totalSales,
          dailySales,
          weeklySales,
          monthlySales,
        });

        // Update graph data  
        setGraphData({
          labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
          datasets: [
            {
              label: "Daily Sales",
              data: Array(7).fill(0).map((_, index) => {
                const daySales = completedOrders.filter(order => {
                  const createdAt = new Date(order.createdAt);
                  return createdAt.getDate() === new Date().getDate() - index;
                }).reduce((total, order) => total + order.price, 0);
                return daySales;
              }),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
              label: "Weekly Sales",
              data: Array(7).fill(0).map((_, index) => {
                const weekSales = completedOrders.filter(order => {
                  const createdAt = new Date(order.createdAt);
                  const weekOfOrder = createdAt.getWeek();
                  return weekOfOrder === currentWeek - index;
                }).reduce((total, order) => total + order.price, 0);
                return weekSales;
              }),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
            },
            {
              label: "Monthly Sales",
              data: Array(7).fill(0).map((_, index) => {
                const monthSales = completedOrders.filter(order => {
                  const createdAt = new Date(order.createdAt);
                  return createdAt.getMonth() === currentMonth - index;
                }).reduce((total, order) => total + order.price, 0);
                return monthSales;
              }),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching orders data: ", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to get current week of the year
  Date.prototype.getWeek = function() {
    const date = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    const firstDay = new Date(this.getFullYear(), 0, 1);
    const dayOfYear = ((date - firstDay) / 86400000) + 1;
    return Math.ceil(dayOfYear / 7);
  };

  return (
    <main className="p-6 bg-black text-white min-h-screen">
      {/* Order Status Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
          <h3 className="text-xl font-semibold mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold">{orderData.pendingOrders}</p>
        </div>

        <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
          <h3 className="text-xl font-semibold mb-2">Completed Orders</h3>
          <p className="text-3xl font-bold">{orderData.completedOrders}</p>
        </div>

        <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
          <h3 className="text-xl font-semibold mb-2">In Progress Orders</h3>
          <p className="text-3xl font-bold">{orderData.inProgressOrders}</p>
        </div>

        <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
          <h3 className="text-xl font-semibold mb-2">Canceled Orders</h3>
          <p className="text-3xl font-bold">{orderData.canceledOrders}</p>
        </div>
      </div>

        {/* Sales Data Cards */}
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
    <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
      <h3 className="text-xl font-semibold mb-2">Daily Sales</h3>
      <p className="text-3xl font-bold">${salesData.dailySales}</p>
    </div>
    <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
      <h3 className="text-xl font-semibold mb-2">Weekly Sales</h3>
      <p className="text-3xl font-bold">${salesData.weeklySales}</p>
    </div>
    <div className="p-6 bg-black rounded-lg shadow border-2 border-white">
      <h3 className="text-xl font-semibold mb-2">Monthly Sales</h3>
      <p className="text-3xl font-bold">${salesData.monthlySales}</p>
    </div>
  </div>

  {/* Sales Graph */}
  <div className="bg-black p-6 rounded-lg shadow border-2 border-white">
    <h3 className="text-xl font-semibold mb-4">Sales Graph</h3>
    <Line data={graphData} />
  </div>
</main>

);
};

export default MainContent;
