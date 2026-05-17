import { NavLink, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, Menu, X, UserPlus, GitBranch } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { toggleTheme, mode } = themeContext;

  const close = () => setIsOpen(false);

  return (
    <>
      <nav
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.10)" }}
        className="sticky top-0 z-50 w-full transition-theme"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Scroll progress indicator */}
        <div id="scroll-progress" />

        <div
          className="transition-theme"
          style={{ backgroundColor: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="gt-container px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2.5 shrink-0"
                aria-label="GitHub Tracker home"
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded"
                  style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}
                >
                  <GitBranch size={16} strokeWidth={2.5} />
                </span>
                <span
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "17px", color: "var(--color-text)" }}
                >
                  GitHub<span style={{ color: "var(--color-primary)" }}>Tracker</span>
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/track", label: "Tracker" },
                  { to: "/contributors", label: "Contributors" },
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" },
                ].map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded transition-theme text-sm font-semibold ${
                        isActive
                          ? "text-[var(--color-text)] bg-[var(--color-bg-2)]"
                          : "text-[var(--color-text-2)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-2)]"
                      }`
                    }
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>

              {/* Desktop Right */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="gt-btn-ghost p-2 rounded transition-theme"
                  aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  style={{ color: "var(--color-text-3)" }}
                >
                  {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div style={{ width: "1px", height: "20px", backgroundColor: "var(--color-border)" }} />

                <Link
                  to="/login"
                  className="gt-btn gt-btn-ghost text-sm"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text-2)", padding: "8px 16px" }}
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="gt-btn gt-btn-primary flex items-center gap-2 text-sm"
                  style={{ padding: "8px 20px" }}
                >
                  <UserPlus size={15} />
                  Sign up
                </Link>
              </div>

              {/* Mobile Controls */}
              <div className="lg:hidden flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded transition-theme"
                  aria-label="Toggle theme"
                  style={{ color: "var(--color-text-3)" }}
                >
                  {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded transition-theme"
                  aria-label="Toggle navigation menu"
                  aria-expanded={isOpen}
                  style={{ color: "var(--color-text)", backgroundColor: "var(--color-bg-2)" }}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div
              className="lg:hidden nav-mobile-open"
              style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <div className="px-4 py-4 space-y-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/track", label: "Tracker" },
                  { to: "/contributors", label: "Contributors" },
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" },
                ].map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={close}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded text-base font-semibold transition-theme ${
                        isActive
                          ? "bg-[var(--color-bg-2)] text-[var(--color-text)]"
                          : "text-[var(--color-text-2)] hover:bg-[var(--color-bg-2)] hover:text-[var(--color-text)]"
                      }`
                    }
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {label}
                  </NavLink>
                ))}

                <div
                  className="pt-3 mt-3 grid grid-cols-2 gap-2"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <Link
                    to="/login"
                    onClick={close}
                    className="gt-btn gt-btn-outline text-center text-sm"
                    style={{ padding: "10px 16px" }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={close}
                    className="gt-btn gt-btn-primary text-center text-sm"
                    style={{ padding: "10px 16px" }}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;