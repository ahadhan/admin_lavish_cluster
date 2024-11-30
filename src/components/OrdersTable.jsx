import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase"; // Import your Firebase configuration

const OrdersTable = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch orders data from Firestore
    const fetchOrdersData = async () => {
      try {
        const ordersSnapshot = await db.collection("orders").get();
        const orders = ordersSnapshot.docs.map((doc) => doc.data());
        setOrdersData(orders); // Set orders data to state
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrdersData(); // Fetch orders on component mount
  }, []); // Empty array ensures this runs once when the component mounts

  // Filter orders based on filter status and search term
  const filteredOrders = ordersData.filter((order) => {
    const matchesStatus =
      filterStatus === "All" || order.orderStatus.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.bookerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 mx-5 bg-black border-2 rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-4 text-white">Orders</h2>

      {/* Search and Filter Controls */}
      <div className="flex items-center mb-4">
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-4"
        />

        {/* Filter Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="All">All</option>
          <option value="Successful">Successful</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Orders Table */}
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border-b border-gray-200">Order ID</th>
            <th className="p-2 border-b border-gray-200">Booker Name</th>
            <th className="p-2 border-b border-gray-200">Product Name</th>
            <th className="p-2 border-b border-gray-200">Price</th>
            <th className="p-2 border-b border-gray-200">Payment Method</th>
            <th className="p-2 border-b border-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.orderId}>
              <td className="p-2 border-b border-gray-200 text-white">{order.orderId}</td>
              <td className="p-2 border-b border-gray-200 text-white">{order.bookerName}</td>
              <td className="p-2 border-b border-gray-200 text-white">{order.productName}</td>
              <td className="p-2 border-b border-gray-200 text-white">${order.price}</td>
              <td className="p-2 border-b border-gray-200 text-white">{order.paymentMethod}</td>
              <td
                className={`p-2 border-b border-gray-200 ${
                  order.orderStatus === "Successful"
                    ? "text-green-600"
                    : order.orderStatus === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {order.orderStatus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No Results Found Message */}
      {filteredOrders.length === 0 && (
        <div className="text-center text-gray-500 py-4">No orders found</div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-black text-gray-200 rounded border border-gray-200 bg-transparent disabled:text-gray-700 disabled:border-gray-700"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-black text-gray-200 rounded border border-gray-200 bg-transparent disabled:text-gray-700 disabled:border-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersTable;
