import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 relative overflow-hidden pb-20">
        {/* 🌐 Global Background Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="w-full h-full relative">
            <div className="absolute top-[-10%] left-[10%] w-[300px] h-[300px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
            <div className="absolute top-[30%] left-[60%] w-[400px] h-[400px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
            <div className="absolute top-[60%] left-[20%] w-[300px] h-[300px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          </div>
        </div>

        {/* 🧭 Navbar + Pages */}
        <Navbar />
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
