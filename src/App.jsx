import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../src/pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
