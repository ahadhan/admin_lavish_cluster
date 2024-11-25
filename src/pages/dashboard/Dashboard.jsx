import React, { useState } from "react";
import { BrowserRouter as Router, Route, useNavigate } from "react-router-dom"; // React Router for navigation
import MainContent from "../../components/MainContent";
import OrdersSection from "../../components/OrdersTable";
import ProductsTable from "../../components/ProductsTable";
import CreateProduct from "../../components/CreateProduct";
import Sidebar from "../../components/Sidebar";

import Header from "../../components/Header";
import AboutSection from "../../components/AboutContent";
import HeroData from "../../components/HeroData";
import AdminBundleOptions from "../../components/AdminBundleOption";
import AdminHowItWorksSection from "../../components/AdminHowItWorks";
import AdminTestimonialSection from "../../components/AdminTestimonialSection";
import AdminFAQSection from "../../components/AdminFAQ's";
import "../../App.css"
// import { useHistory } from "react-router-dom"; // For navigation

const DashboardLayout = () => {
  const [currentSection, setCurrentSection] = useState("Dashboard");

  const ordersData = [
    {
      orderId: '12345',
      bookerName: 'John Doe',
      productName: 'Product A',
      price: 29.99,
      paymentMethod: 'Credit Card',
      status: 'Pending',
    },
    {
      orderId: '12346',
      bookerName: 'Jane Smith',
      productName: 'Product B',
      price: 49.99,
      paymentMethod: 'PayPal',
      status: 'Successful',
    },
    // Add more orders as needed
  ];

  const renderSection = () => {
    switch (currentSection) {
      case "Dashboard":
        return <MainContent />;
      case "Orders":
        return <OrdersSection ordersData={ordersData} />;
      case "List Of Products":
        const products = [
          { title: "Product 1", description: "Description 1", price: 29.99, imageUrl: "http://example.com/image1.jpg" },
          { title: "Product 2", description: "Description 2", price: 19.99, imageUrl: "http://example.com/image2.jpg" },
        ];
        return <ProductsTable products={products} />;
      case "Create Product":
        return <CreateProduct />;
      case "About Section":
        return <AboutSection />;
      case "Hero Section":
        return <HeroData />;
      case "Bundle Options":
        return <AdminBundleOptions />;
      case "Client Testimonials":
        return <AdminTestimonialSection />;
      case "FAQ's":
        return <AdminFAQSection />;
      case "How It Works":
        return <AdminHowItWorksSection />;
      default:
        return <MainContent />;
    }
  };

  return (
    
      <div className="flex p-2 bg-black w-[100vw]">
        <Sidebar onSectionChange={setCurrentSection} />
        <div className="flex-1">
          <Header sectionName={currentSection} />
          {renderSection()}
        </div>
      </div>
    
  );
};

export default DashboardLayout;
