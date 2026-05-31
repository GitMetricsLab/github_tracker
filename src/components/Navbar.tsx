import { NavLink, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const themeContext = useContext(ThemeContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!themeContext || !authContext) return null;

  const { toggleTheme, mode } = themeContext;
  const { isAuthenticated, isLoading, logout } = authContext;

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${isActive
      ? "text-blue-600 bg-blue-100 dark:bg-blue-900/40 shadow-sm"
      : "text-slate-700 dark:text-gray-300 hover:text-blue-500"
    }`;

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      // optionally surface a toast/message
    } finally {
      closeMenu();
    }
  };

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

          {/* ✅ NEW FEATURE */}
          <NavLink to="/compare" className={navLinkStyles}>
            Compare
          </NavLink>

          <NavLink to="/contributors" className={navLinkStyles}>
            Contributors
          </NavLink>

          {!isLoading && !isAuthenticated && (
            <>
              <NavLink to="/login" className={navLinkStyles}>
                Login
              </NavLink>

              <NavLink to="/signup" className={navLinkStyles}>
                Signup
              </NavLink>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 text-white bg-rose-500 hover:bg-rose-600 shadow-sm"
            >
              Logout
            </button>
          )}

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

            <NavLink to="/" className={navLinkStyles} onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/track" className={navLinkStyles} onClick={closeMenu}>
              Tracker
            </NavLink>

            {/* ✅ NEW FEATURE */}
            <NavLink to="/compare" className={navLinkStyles} onClick={closeMenu}>
              Compare
            </NavLink>

            <NavLink to="/contributors" className={navLinkStyles} onClick={closeMenu}>
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

            {!isLoading && !isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  className={navLinkStyles}
                  onClick={closeMenu}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className={navLinkStyles}
                  onClick={closeMenu}
                >
                  Signup
                </NavLink>
              </>
            )}

            {!isLoading && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 text-white bg-rose-500 hover:bg-rose-600 shadow-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;