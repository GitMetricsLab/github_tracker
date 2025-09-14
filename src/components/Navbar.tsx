import { Link, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);
  const location = useLocation();

  if (!themeContext) return null;

  const { toggleTheme, mode } = themeContext;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/track", label: "Tracker" },
    { to: "/contributors", label: "Contributors" },
    { to: "/login", label: "Login" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg text-black dark:text-white border-b border-gray-200 dark:border-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide flex items-center group"
        >
          <img src="/crl-icon.png" alt="CRL Icon" className="h-9 mr-2" />
          <span className="relative">
            GitHub Tracker
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 group-hover:w-full rounded"></span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-lg font-medium px-3 py-2 rounded-lg transition-all duration-300 group
                ${
                  location.pathname === link.to
                    ? "text-indigo-500 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900"
                    : "hover:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-800"
                }`}
            >
              {link.label}
              {/* Gradient underline hover */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 group-hover:w-full"></span>
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full border border-gray-400 dark:border-gray-600 hover:scale-110 hover:border-indigo-400 transition-all duration-500 transform hover:rotate-12"
          >
            {mode === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400 drop-shadow-glow" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500 drop-shadow-glow" />
            )}
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
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-black dark:text-white border-t border-gray-200 dark:border-gray-700 px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-medium px-3 py-2 rounded-lg transition-all duration-300
                ${
                  location.pathname === link.to
                    ? "text-indigo-500 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900"
                    : "hover:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-800"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
            className="w-full text-left text-sm font-semibold px-3 py-2 rounded-lg border border-gray-500 hover:border-indigo-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition duration-300"
          >
            {mode === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
