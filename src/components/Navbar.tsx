import { Link, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", to: "/", section: null },
  { label: "Features", to: "/#features", section: "features" },
  { label: "How It Works", to: "/#how-it-works", section: "how-it-works" },
  { label: "Tracker", to: "/track", section: null },
  { label: "Contributors", to: "/contributors", section: null },
  { label: "Login", to: "/login", section: null },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();

  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  const { toggleTheme, mode } = themeContext;

  const navLinkStyles = (isActive: boolean) =>
    `px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${isActive
      ? "text-blue-600 bg-blue-100 dark:bg-blue-900/40 shadow-sm"
      : "text-slate-700 dark:text-gray-300 hover:text-blue-500"
    }`;

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["features", "how-it-works"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)[0];

        if (visibleSection?.target?.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        threshold: 0.4,
        rootMargin: "-30% 0px -55% 0px",
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const getLinkActive = (item: { to: string; section: string | null }) => {
    if (item.section) {
      return (
        location.pathname === "/" &&
        (activeSection === item.section || location.hash === `#${item.section}`)
      );
    }

    if (item.to === "/") {
      return location.pathname === "/" && !location.hash;
    }

    return location.pathname === item.to;
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={navLinkStyles(getLinkActive(item))}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}

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

            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={navLinkStyles(getLinkActive(item))}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
