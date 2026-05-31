import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<NavbarUser | null>(() => readStoredUser());

  const themeContext = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!themeContext || !authContext) return null;

  const { toggleTheme, mode } = themeContext;
  const { isAuthenticated, isLoading, logout } = authContext;

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${
      isActive
        ? "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40 shadow-sm"
        : "text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
    }`;

  const featureLinkStyles =
    "px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 text-slate-700 dark:text-gray-300 hover:text-blue-500 cursor-pointer";

  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setUser(null);
    closeMenu();
  };

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

  // Smooth scroll to #features on homepage
  const handleFeaturesClick = () => {
    closeMenu();
    if (location.pathname === "/") {
      const section = document.getElementById("features");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#features");
      setTimeout(() => {
        const section = document.getElementById("features");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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

        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/" end className={navLinkStyles}>
            Home
          </NavLink>

          {/* Features: smooth scroll to #features section on homepage */}
          <span className={featureLinkStyles} onClick={handleFeaturesClick}>
            Features
          </span>

          <NavLink to="/about" className={navLinkStyles}>
            About
          </NavLink>

          <NavLink to="/track" className={navLinkStyles}>
            Tracker
          </NavLink>
          <NavLink to="/contributors" className={navLinkStyles}>
            Contributors
          </NavLink>

          {user ? (
            <ProfileDropdown user={user} onLogout={handleLogout} />
          ) : (
            <NavLink to="/login" className={navLinkStyles}>
              Login
            </NavLink>
          )}

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

      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-6 py-5 flex flex-col gap-3">
            <NavLink to="/" end className={navLinkStyles} onClick={closeMenu}>
              Home
            </NavLink>

            {/* Features: smooth scroll to #features section on homepage */}
            <span className={featureLinkStyles} onClick={handleFeaturesClick}>
              Features
            </span>

            <NavLink to="/about" className={navLinkStyles} onClick={closeMenu}>
              About
            </NavLink>

            <NavLink to="/track" className={navLinkStyles} onClick={closeMenu}>
              Tracker
            </NavLink>

            <NavLink to="/contributors" className={navLinkStyles} onClick={closeMenu}>
              Contributors
            </NavLink>

            <NavLink to="/login" className={navLinkStyles} onClick={closeMenu}>
              Login
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;