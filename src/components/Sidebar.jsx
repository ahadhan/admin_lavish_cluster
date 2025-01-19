import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp, IoMdArrowBack } from "react-icons/io";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../src/lib/firebase";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

export default function Sidebar({ onSectionChange }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate(); // Updated to use useNavigate

  // Toggle dropdown visibility
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleSectionChange = (sectionName) => {
    onSectionChange(sectionName);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email); // Set the email of the currently logged-in user
      } else {
        setEmail(null); // User is signed out
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      // Clear any other session or cookie-related data if necessary
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      navigate("/login"); // Navigate to the login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  

  return (
    <aside className="md:w-64 w-100 min-h-screen p-6 bg-black rounded-md border-2 border-white text-white flex flex-col justify-between">
      {/* Admin Panel Heading */}
      <div className="h-full">
        <div className="mb-8">
          
          <h2 className="text-2xl font-semibold font-roboto text-center">Admin Panel</h2>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-lg font-semibold">Lavish Cluster</h3>
          <div className="w-[80px] h-[1px] mx-auto my-2 bg-white"></div>
          <p className="text-sm text-gray-400">{email}</p>
          <p className="text-sm text-gray-500">Admin</p>
        </div>

        {/* Navigation with Dropdown Items */}
        <nav className="space-y-4 ">
          {/* Product Section */}
          <div>
            <button
              className="flex justify-between w-full py-2 px-4 text-left rounded bg-black hover:bg-gray-900 items-center font-roboto"
              onClick={() => {
                toggleDropdown(0);
                handleSectionChange("Product Section");
              }}
            >
              Product Section
              <span>{openDropdown === 0 ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
            </button>
            {openDropdown === 0 && (
              <div className="pl-4 space-y-1">
                <button
                  className="block py-1 px-2 bg-black hover:bg-gray-700 rounded"
                  onClick={() => handleSectionChange("Create Product")}
                >
                  Create Product
                </button>
                <button
                  onClick={() => onSectionChange("List Of Products")}
                  className="block py-1 px-2 bg-black hover:bg-gray-700 rounded text-left w-full"
                >
                  List of Products
                </button>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div>
            <button
              className="flex justify-between bg-black w-full py-2 px-4 text-left rounded hover:bg-gray-700 items-center"
              onClick={() => {
                toggleDropdown(1);
                handleSectionChange("Content Section");
              }}
            >
              Content Section
              <span>{openDropdown === 1 ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
            </button>
            {openDropdown === 1 && (
              <div className="pl-4 space-y-1">
                <button
                  onClick={() => handleSectionChange("Hero Section")}
                  className="block py-1 px-2 bg-black hover:bg-gray-700 rounded"
                >
                  Hero
                </button>
                <button
                  onClick={() => handleSectionChange("About Section")}
                  className="block py-1 px-2 bg-black hover:bg-gray-700 rounded"
                >
                  About
                </button>
                <button
                  onClick={() => handleSectionChange("How It Works")}
                  className="block py-1 px-2 bg-black hover:bg-gray-700 rounded"
                >
                  Video Guidelines
                </button>
                <button
                  onClick={() => handleSectionChange("Bundle Options")}
                  className="block py-1 px-2 bg-black hover:bg-gray-700 rounded"
                >
                  Bundle Options
                </button>
                <button
                  onClick={() => handleSectionChange("Client Testimonials")}
                  className="block py-1 px-2 bg-black hover:bg-gray-700 rounded"
                >
                  Client Testimonials
                </button>
                <button
                  onClick={() => handleSectionChange("FAQ's")}
                  className="block py-1 px-2 bg-black hover:bg-gray-700 rounded"
                >
                  FAQ's
                </button>
              </div>
            )}
          </div>

          {/* Orders Section */}
          <button 
            className="flex justify-between w-full py-2 px-4 text-left rounded bg-black hover:bg-gray-700"
            onClick={() => {
              onSectionChange("Orders");
            }}
          >
            Orders
          </button>
        </nav>

        {/* Logout Button */}
        <button
          className="mt-8 w-full py-2 bg-red-600 rounded hover:bg-red-700 text-center font-medium"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
