import { NavLink, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, Menu, X, Github } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  const { toggleTheme, mode } = themeContext;

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${
      isActive
        ? "text-blue-600 bg-blue-100 dark:bg-blue-900/40 shadow-sm"
        : "text-slate-700 dark:text-gray-300 hover:text-blue-500"
    }`;

  const closeMenu = () => setIsOpen(false);

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
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white"
        >
          <img
            src="/crl-icon.png"
            alt="CRL Icon"
            className="h-8 w-8 object-contain"
          />

          <span>GitHub Tracker</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/" className={navLinkStyles}>
            Home
          </NavLink>

          <NavLink to="/track" className={navLinkStyles}>
            Tracker
          </NavLink>

          <NavLink to="/contributors" className={navLinkStyles}>
            Contributors
          </NavLink>

          <NavLink to="/login" className={navLinkStyles}>
            Login
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {mode === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Main menu"
            aria-expanded={isOpen}
            className="relative w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-dark-lighter rounded-full focus:outline-none"
          >
            <div className="flex flex-col space-y-1.5 w-5">
              <span className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`block h-0.5 w-full bg-current rounded-full transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </div>
        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {mode === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-white" />
            )}
          </button>

          {/* Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-slate-900 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-slate-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-6 py-5 flex flex-col gap-3">

            <NavLink
              to="/"
              className={navLinkStyles}
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/track"
              className={navLinkStyles}
              onClick={closeMenu}
            >
              Tracker
            </NavLink>

            <NavLink
              to="/contributors"
              className={navLinkStyles}
              onClick={closeMenu}
            >
              Contributors
            </NavLink>

            <NavLink
              to="/login"
              className={navLinkStyles}
              onClick={closeMenu}
            >
              Login
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
