import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useRef } from "react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setIsAuthed(!!e.newValue);
    };

    const onAuthChange = () => {
      setIsAuthed(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChange", onAuthChange);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChange", onAuthChange);
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false); // close mobile menu on navigation
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthed(false);
    setUser(null);
    // notify same-tab listeners
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const [isAuthed, setIsAuthed] = useState<boolean>(
    !!localStorage.getItem("token")
  );
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
          {/* replace your auth block with this */}
          {isAuthed ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                {/* Avatar Icon */}
                <img
                  src={
                    JSON.parse(localStorage.getItem("user") || "{}")
                      ?.avatarUrl || "/profile.svg"
                  }
                  alt="avatar"
                  className="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />

                {/* Username beside icon */}
                {/* <span className="text-sm font-medium">
                  {JSON.parse(localStorage.getItem("user") || "{}")?.username ||
                    "Me"}
                </span> */}

                {/* Chevron icon */}
                <svg
                  className={`h-4 w-4 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-2"
                >
                  {/* User Info */}
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {JSON.parse(localStorage.getItem("user") || "{}")
                        ?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {JSON.parse(localStorage.getItem("user") || "{}")
                        ?.email || "email@example.com"}
                    </p>
                  </div>

                  {/* Menu Links */}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/profile/edit"
                    className="block px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
            >
              Login
            </Link>
          )}

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
            {isAuthed ? (
              <>
                <Link
                  to="/profile"
                  className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="block text-left text-lg font-medium px-2 py-1 border border-transparent hover:border-gray-400 rounded w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
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
