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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity flex items-center group"
        >
          <div className="bg-blue-600 p-1.5 rounded-lg mr-2 group-hover:rotate-12 transition-transform">
            <img src="/crl-icon.png" alt="CRL Icon" className="h-6 w-6 invert brightness-0" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            GitHub Tracker
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2">
          {[
            { name: 'Home', path: '/' },
            { name: 'Tracker', path: '/track' },
            { name: 'Contributors', path: '/contributors' },
            { name: 'Login', path: '/login' },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-lighter hover:text-blue-600 dark:hover:text-white transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-[1px] bg-gray-200 dark:bg-dark-border mx-2"></div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-300"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-300"
          >
            {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-dark-lighter rounded-full focus:outline-none"
          >
            <div className="flex flex-col space-y-1.5 w-5">
              <span className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`block h-0.5 w-full bg-current rounded-full transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-dark border-b border-gray-200 dark:border-dark-border shadow-xl">
          <div className="px-6 py-6 space-y-4">
            {[
              { name: 'Home', path: '/' },
              { name: 'Tracker', path: '/track' },
              { name: 'Contributors', path: '/contributors' },
              { name: 'Login', path: '/login' },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-lighter transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
