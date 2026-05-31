import { NavLink, Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, Menu, X, ChevronDown, BadgeInfo, LogOut, User } from "lucide-react";

type NavbarUser = {
  id?: string;
  username?: string;
  email?: string;
};

const AUTH_STORAGE_KEY = "github_tracker_auth_user";

const readStoredUser = (): NavbarUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser) as NavbarUser;
    return parsedUser?.username ? parsedUser : null;
  } catch {
    return null;
  }
};

type ProfileDropdownProps = {
  user: NavbarUser;
  onLogout: () => void;
  onCloseMenu?: () => void;
  mobile?: boolean;
};

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout, onCloseMenu, mobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const displayName = useMemo(() => user.username ?? "Profile", [user.username]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const closeMenu = () => setIsOpen(false);

  if (mobile) {
    return (
      <div className="mt-2 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{displayName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email ?? "Signed in"}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            to="/profile"
            onClick={onCloseMenu}
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white dark:text-slate-200 dark:hover:bg-white/5"
          >
            <User className="h-4 w-4" />
            View Profile
          </Link>
          <Link
            to={user.username ? `/contributor/${user.username}` : "/contributors"}
            onClick={onCloseMenu}
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white dark:text-slate-200 dark:hover:bg-white/5"
          >
            <BadgeInfo className="h-4 w-4" />
            Account Details
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden xl:block">
          <span className="block text-sm font-semibold text-slate-900 dark:text-white">{displayName}</span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">Signed in</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Account</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{displayName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email ?? "No email available"}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-cyan-300"
            >
              <User className="h-4 w-4" />
              View Profile
            </Link>
            <Link
              to={user.username ? `/contributor/${user.username}` : "/contributors"}
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-cyan-300"
            >
              <BadgeInfo className="h-4 w-4" />
              Account Details
            </Link>
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<NavbarUser | null>(() => readStoredUser());

  const themeContext = useContext(ThemeContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!themeContext || !authContext) return null;

  const { toggleTheme, mode } = themeContext;
  const { isAuthenticated, isLoading, logout } = authContext;

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${
      isActive
        ? "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40 shadow-sm"
        : "text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
    }`;

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

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white"
        >
          <img src="/crl-icon.png" alt="CRL Icon" className="h-8 w-8 object-contain" />
          <span>GitHub Tracker</span>
        </Link>

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
            <NavLink to="/" className={navLinkStyles} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/track" className={navLinkStyles} onClick={closeMenu}>
              Tracker
            </NavLink>
            <NavLink to="/contributors" className={navLinkStyles} onClick={closeMenu}>
              Contributors
            </NavLink>

            {user ? (
              <ProfileDropdown user={user} onLogout={handleLogout} onCloseMenu={closeMenu} mobile />
            ) : (
              <NavLink to="/login" className={navLinkStyles} onClick={closeMenu}>
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;