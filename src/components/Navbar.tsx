import { NavLink, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, Menu, X, UserPlus } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;
  const { toggleTheme, mode } = themeContext;

  const navLinkStyles = ({ isActive }: { isActive: boolean }) => 
    `px-5 py-2 rounded-full text-lg font-semibold transition-all duration-300 
    ${isActive 
      ? "text-blue-600 bg-blue-100/60 dark:bg-blue-900/40 shadow-sm ring-1 ring-blue-200/50" 
      : "text-slate-600 dark:text-gray-300 hover:text-blue-500 hover:bg-white/50"
    }`;

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
          </div>

          <div className="lg:hidden flex items-center space-x-3">
            <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-gray-400" aria-label="Toggle theme">
              {mode === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-2xl bg-white/80 dark:bg-gray-800 text-slate-900 dark:text-white"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`
        lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-indigo-50/95 dark:bg-gray-900/95 backdrop-blur-xl
        ${isOpen 
          ? "max-h-[600px] opacity-100 border-t border-indigo-100/50 dark:border-gray-800 shadow-2xl visible" 
          : "max-h-0 opacity-0 invisible"
        }
      `}>
        <div className="px-5 py-10 space-y-4">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/track" onClick={() => setIsOpen(false)}>Tracker</MobileNavLink>
          <MobileNavLink to="/contributors" onClick={() => setIsOpen(false)}>Contributors</MobileNavLink>
          
          <div className="pt-8 mt-6 border-t border-indigo-100/50 dark:border-gray-800 grid grid-cols-2 gap-5">
            <Link to="/login" className="flex items-center justify-center py-4 text-lg font-bold text-slate-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-indigo-100/50 dark:border-gray-700" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/signup" className="flex items-center justify-center py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl shadow-lg" onClick={() => setIsOpen(false)}>Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const MobileNavLink = ({ to, children, onClick }: { to: string, children: React.ReactNode, onClick: () => void }) => (
  <NavLink to={to} onClick={onClick} className={({ isActive }) => `block px-6 py-4 rounded-2xl text-xl font-bold transition-all ${isActive ? "bg-blue-600 text-white shadow-lg translate-x-2" : "text-slate-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-gray-800/40"}`}>{children}</NavLink>
);

export default Navbar;