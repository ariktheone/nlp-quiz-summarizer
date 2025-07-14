import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {/* App Icon and Branding */}
            <img
              src="/favicon_io/apple-touch-icon.png"
              alt="Smart Summary Quiz Logo"
              className="w-10 h-10 mr-2 rounded-full"
              style={{ boxShadow: '0 4px 16px 0 #209CEE33' }}
            />
            <span className="ml-2 text-2xl font-extrabold text-[#209CEE] tracking-tight drop-shadow-sm transition-colors duration-300 hover:text-[#176bb3] cursor-pointer hidden sm:block">
              Smart Summary Quiz
            </span>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200 ${
                isActive('/')
                  ? 'border-[#209CEE] text-[#209CEE]'
                  : 'border-transparent text-gray-500 hover:border-[#209CEE] hover:text-[#209CEE]'
              }`}
            >
              Generator
            </Link>
            <Link
              to="/history"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200 ${
                isActive('/history')
                  ? 'border-[#209CEE] text-[#209CEE]'
                  : 'border-transparent text-gray-500 hover:border-[#209CEE] hover:text-[#209CEE]'
              }`}
            >
              History
            </Link>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#209CEE] hover:text-[#176bb3] hover:bg-[#E6F4FB] focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-semibold transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-[#E6F4FB] border-[#209CEE] text-[#209CEE]'
                  : 'border-transparent text-gray-600 hover:bg-[#E6F4FB] hover:border-[#209CEE] hover:text-[#209CEE]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Generator
            </Link>
            <Link
              to="/history"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-semibold transition-colors duration-200 ${
                isActive('/history')
                  ? 'bg-[#E6F4FB] border-[#209CEE] text-[#209CEE]'
                  : 'border-transparent text-gray-600 hover:bg-[#E6F4FB] hover:border-[#209CEE] hover:text-[#209CEE]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              History
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;