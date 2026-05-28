import { NavLink, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ProfileDropDown from "./Profile/ProfileDropDown";
import { logoutUser } from "../services/auth";

import { Moon, Sun, Menu, X, Github } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  const { toggleTheme, mode } = themeContext;
  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data in local Storage");
    localStorage.removeItem("user");
    user = null;
  }

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${isActive
      ? "text-blue-600 bg-blue-100 dark:bg-blue-900/40 shadow-sm"
      : "text-slate-700 dark:text-gray-300 hover:text-blue-500"
    }`;

  const closeMenu = () => setIsOpen(false);

  return (
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
          {!user && (<NavLink
            to="/login"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Login
          </NavLink>)}

          {user && <ProfileDropDown user={user} />}
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
            {!user && (
              <NavLink
                to="/login"
                className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
                onClick={closeMenu}
              >
                Login
              </NavLink>
            )}
            {user && (
              <>
                <NavLink
                  to="/me"
                  className={navLinkStyles}
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </NavLink>

                <NavLink
                  to="/profile/edit"
                  className={navLinkStyles}
                  onClick={() => setIsOpen(false)}
                >
                  Edit Profile
                </NavLink>
                <button
                  className="px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 shadow-sm text-start"
                  onClick={
                    logoutUser
                  }
                >
                  Logout
                </button>
              </>
            )}

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
