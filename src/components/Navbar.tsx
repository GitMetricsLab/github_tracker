 gsoc-2025Gaurav
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGitHubAuth } from '../hooks/useGitHubAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { username, logout } = useGitHubAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const { toggleTheme, mode } = themeContext;
 main

  return (
    <nav className="bg-white text-black dark:bg-gray-800 dark:text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link
          to="/"
          className="text-2xl font-bold hover:text-gray-300 cursor-pointer flex items-center"
        >
          <img src="/crl-icon.png" alt="CRL Icon" className="h-8 mr-2" />
          GitHub Tracker
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Contact
          </Link>
          <Link
            to="/contributors"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Contributors
          </Link>
 gsoc-2025Gaurav
          {!username ? (
            <Link
              to="/login"
              className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
            >Login</Link>
          ) : (
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <img
                  src={`https://github.com/${username}.png`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <span className="font-medium">{username}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                  <Link
                    to={`/user/${username}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/user/${username}?edit=1`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link
            to="/login"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Login
          </Link>
          <button
            onClick={toggleTheme}
            className="text-sm font-semibold px-3 py-1 rounded border border-gray-500 hover:text-gray-300 hover:border-gray-300 transition duration-200"
          >
            {mode === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
 main
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-8 h-8 flex flex-col space-y-[5px] items-center group focus:outline-none"
          >
            <span
              className={`block h-[3px] w-full bg-white rounded-lg transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-[3px] w-full bg-white rounded-lg transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-[3px] w-full bg-white rounded-lg transition-transform duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="space-y-4 px-6 py-4">
            <Link
              to="/home"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/contributors"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              Contributors
            </Link>
 gsoc-2025Gaurav
            {!username ? (
              <Link
                to="/login"
                className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
                onClick={() => setIsOpen(false)}
              >Login</Link>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 focus:outline-none w-full px-2 py-1"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  <img
                    src={`https://github.com/${username}.png`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span className="font-medium">{username}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                    <Link
                      to={`/user/${username}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => { setDropdownOpen(false); setIsOpen(false); }}
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/user/${username}?edit=1`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => { setDropdownOpen(false); setIsOpen(false); }}
                    >
                      Edit Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link
              to="/login"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="text-sm font-semibold px-3 py-1 rounded border border-gray-500 hover:text-gray-300 hover:border-gray-300 transition duration-200 w-full text-left"
            >
              {mode === "dark" ? "🌞 Light" : "🌙 Dark"}
            </button>
 main
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
