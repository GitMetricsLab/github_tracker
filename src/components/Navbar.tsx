import { NavLink, Link } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/track", label: "Tracker" },
  { to: "/contributors", label: "Contributors" },
  { to: "/login", label: "Login" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });
  
  const [scrolled,setScrolled]= useState(false);
  useEffect( () => {
    const handleScroll = () => {
      setScrolled(window.scrollY>20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  },[]);

  const navRef = useRef<HTMLDivElement>(null);
  const themeContext = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!themeContext || !authContext) return null;

  const { toggleTheme, mode } = themeContext;
  const { isAuthenticated, isLoading, logout } = authContext;

  const closeMenu = () => setIsOpen(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const nav = navRef.current;
    const item = e.currentTarget;
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setPillStyle({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setPillStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative z-10 px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-colors duration-200 ${
      isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-slate-700 dark:text-gray-300"
    }`;

  return (
      <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-gray-200 dark:border-gray-800 shadow-sm"
            : "bg-white dark:bg-gray-900 border-transparent"
        }`}
      >
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

        {/* Desktop Navigation */}
        <div
          ref={navRef}
          className="hidden md:flex items-center gap-1 relative"
          onMouseLeave={handleMouseLeave}
        >
          {/* Sliding pill */}
          <span
            className="absolute top-0 h-full rounded-xl bg-gray-100 dark:bg-gray-800 pointer-events-none"
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
              transition: "left 0.2s ease, width 0.2s ease, opacity 0.15s ease",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background:
                mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.35)",
              boxShadow:
                mode === "dark" ? "0 4px 20px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.08)",
            }}
          />

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={handleMouseEnter}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}

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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {mode === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-black" />
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
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ani-fade-in">
          <div className="px-6 py-5 flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 bg-blue-100 dark:bg-blue-900/40 shadow-sm"
                      : "text-slate-700 dark:text-gray-300 hover:text-blue-500"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;