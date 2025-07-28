import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const { toggleTheme, mode } = themeContext;

  return (
    <nav className="bg-gradient-to-br from-indigo-100 to-slate-100 dark:from-blue-950 dark:to-gray-900 text-black dark:text-white border-b-2 border-blue-300 shadow-lg">
      {/* Top Nav */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold hover:text-gray-500 dark:hover:text-gray-300 flex items-center"
        >
          <img src="/crl-icon.png" alt="CRL Icon" className="h-8 mr-2" />
          GitHub Tracker
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {["/", "/about", "/contact", "/contributors", "/login"].map((path, idx) => {
            const labels = ["Home", "About", "Contact", "Contributors", "Login"];
            return (
              <Link
                key={path}
                to={path}
                className="text-lg font-medium hover:text-gray-600 dark:hover:text-gray-300 transition px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              >
                {labels[idx]}
              </Link>
            );
          })}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-sm font-semibold px-3 py-1 rounded border border-gray-500 dark:border-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 transition duration-200"
          >
            {mode === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 flex flex-col justify-between items-center focus:outline-none"
          >
            <span
              className={`block h-[3px] w-full bg-black dark:bg-white rounded transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-[3px] w-full bg-black dark:bg-white rounded transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[3px] w-full bg-black dark:bg-white rounded transition-transform duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-br from-indigo-100 to-slate-100 dark:from-blue-950 dark:to-gray-900 text-black dark:text-white">
          <div className="space-y-4 px-6 py-6">
            {["/", "/about", "/contact", "/contributors", "/login"].map((path, idx) => {
              const labels = ["Home", "About", "Contact", "Contributors", "Login"];
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium hover:text-gray-700 dark:hover:text-gray-300 transition px-2 py-1 border border-transparent hover:border-gray-400 rounded"
                >
                  {labels[idx]}
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="text-sm font-semibold px-3 py-1 w-xl text-left rounded border border-gray-500 dark:border-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 transition duration-200"
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
