import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from 'lucide-react';


const Navbar: React.FC = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);

  if (!themeContext)
    return null;

  const { toggleTheme, mode } = themeContext;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 text-black dark:text-white border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
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
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Home
          </Link>
          <Link
            to="/track"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Tracker
          </Link>
          <Link
            to="/contributors"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Contributors
          </Link>
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
            {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-8 h-8 flex flex-col space-y-[5px] items-center group focus:outline-none"
          >
            <span
              className={`block h-[3px] w-full bg-black dark:bg-white rounded-lg transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-[3px] w-full bg-black dark:bg-white rounded-lg transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-[3px] w-full bg-black dark:bg-white rounded-lg transition-transform duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 text-black dark:text-white">
          <div className="space-y-4 px-6 py-4">
            <Link
              to="/"
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
