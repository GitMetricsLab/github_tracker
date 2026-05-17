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
    <nav className="sticky top-0 z-50 w-full bg-indigo-50/70 dark:bg-gray-900/95 backdrop-blur-xl border-b border-indigo-100/50 dark:border-gray-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center shrink-0 group transition-all active:scale-95">
            <img src="/crl-icon.png" alt="CRL Icon" className="h-10 w-10 mr-3 drop-shadow-md group-hover:rotate-6 transition-transform" />
            <div className="flex items-center tracking-tight">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">GitHub</span>
              <span className="text-2xl font-extrabold text-blue-600 ml-1">Tracker</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center justify-center flex-1 space-x-1">
            <NavLink to="/" className={navLinkStyles}>Home</NavLink>
            <NavLink to="/track" className={navLinkStyles}>Tracker</NavLink>
            <NavLink to="/contributors" className={navLinkStyles}>Contributors</NavLink>
          </div>

          <div className="hidden lg:flex items-center space-x-5">
            <div className="h-8 w-[1.5px] bg-indigo-200/60 dark:bg-gray-700 mx-2 rounded-full" />

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-500 dark:text-gray-400 bg-white/40 dark:bg-gray-800/40 hover:bg-white transition-all shadow-sm"
              aria-label={mode === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <Link to="/login" className="text-lg font-bold text-slate-700 dark:text-gray-200 hover:text-blue-600 px-2">Login</Link>
            <Link to="/signup" className="flex items-center space-x-2 px-7 py-3 text-lg font-bold text-white bg-blue-600 rounded-full hover:shadow-lg transition-all active:scale-95">
              <UserPlus className="h-5 w-5" />
              <span>Sign Up</span>
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