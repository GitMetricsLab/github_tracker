import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaArrowRight,
  FaArrowUp,
  FaBookOpen,
  FaChartLine,
  FaDiscord,
  FaExternalLinkAlt,
  FaGithub,
  FaTwitter,
  FaUsers,
} from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

function Footer() {
  const themeContext = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const mode = themeContext?.mode ?? 'light';

  const isDark = mode === 'dark';
  const footerClass = isDark
    ? 'relative w-full overflow-hidden border-t border-white/10 bg-[#1e2130] text-slate-100 shadow-[0_-24px_80px_rgba(2,6,23,0.45)]'
    : 'relative w-full overflow-hidden border-t border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 shadow-[0_-16px_50px_rgba(15,23,42,0.08)]';
  const outerGlowClass = isDark
    ? 'absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,1))]'
    : 'absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_22%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(226,232,240,0.88))]';
  const panelClass = isDark
    ? 'rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10'
    : 'rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10';
  const titleClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const bodyClass = isDark ? 'text-slate-300' : 'text-slate-600';
  const cardChipClass = isDark
    ? 'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/50 hover:bg-white/10 hover:text-white'
    : 'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-slate-900';
  const secondaryChipClass = isDark
    ? 'inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-slate-800/80 hover:text-white'
    : 'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900';
  const iconShellClass = isDark
    ? 'flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-500/10 group-hover:text-blue-300'
    : 'flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600';
  const dividerClass = isDark
    ? 'my-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent'
    : 'my-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent';

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail) {
      toast.error('Enter an email address to subscribe.');
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      toast.error('Enter a valid email address.');
      return;
    }

    toast.success('Subscription saved. Welcome aboard.');
    setEmail('');
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const serviceLinks = [
    { to: '/track', label: 'Tracker', icon: FaChartLine },
    { to: '/community', label: 'Community', icon: FaUsers },
    { to: '/contributors', label: 'Contributors', icon: FaBookOpen },
    { to: '/activity', label: 'Activity', icon: FaArrowRight },
  ];

  const legalLinks = [
    { to: '/terms', label: 'Terms of Service' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/contact', label: 'Contact Support' },
  ];

  const socialLinks = [
    {
      href: 'https://github.com/GitMetricsLab/github_tracker',
      label: 'GitHub Repository',
      icon: FaGithub,
    },
    {
      href: 'https://x.com/your_handle',
      label: 'Twitter',
      icon: FaTwitter,
    },
    {
      href: 'https://discord.gg/your_invite',
      label: 'Discord',
      icon: FaDiscord,
    },
  ];

  return (
    <footer className={`${footerClass} font-sans`}>
      <div className={outerGlowClass} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className={panelClass}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-5 lg:col-span-4">
              <Link
                to="/"
                className="inline-flex w-fit items-center gap-3 text-xl font-bold tracking-tight transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 hover:scale-105">
                  <FaGithub className="h-5 w-5" />
                </div>

                <span className={isDark ? 'font-bold text-white' : 'font-bold text-slate-900'}>GitHub Tracker</span>
              </Link>

              <p className={`max-w-sm text-sm leading-7 ${bodyClass}`}>
                Track repositories, analyze contributions, and explore GitHub insights with a focused interface that stays readable on every screen.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/GitMetricsLab/github_tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardChipClass}
                >
                  View repository
                  <FaExternalLinkAlt className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={handleBackToTop}
                  className={secondaryChipClass}
                >
                  Back to top
                  <FaArrowUp className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <h3 className={`text-xs font-semibold uppercase tracking-[0.24em] ${titleClass}`}>
                Services
              </h3>

              <div className="flex flex-col gap-3">
                {serviceLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className={`group inline-flex items-center gap-3 text-sm transition-all duration-300 hover:-translate-y-0.5 ${bodyClass} ${isDark ? 'hover:text-white' : 'hover:text-slate-950'}`}
                  >
                    <span className={iconShellClass}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <h3 className={`text-xs font-semibold uppercase tracking-[0.24em] ${titleClass}`}>
                Legal
              </h3>

              <div className="flex flex-col gap-3">
                {legalLinks.map(({ to, label }) => (
                  <Link
                    key={label}
                    to={to}
                    className={`inline-flex items-center gap-2 text-sm transition-colors duration-300 ${bodyClass} ${isDark ? 'hover:text-white' : 'hover:text-slate-950'}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500/80" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              <h3 className={`text-xs font-semibold uppercase tracking-[0.24em] ${titleClass}`}>
                Subscribe
              </h3>

              <p className={`max-w-md text-sm leading-6 ${bodyClass}`}>
                Get occasional product updates and release notes. No noise, no spam, and no more than a few emails a month.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`min-w-0 flex-1 rounded-2xl border px-4 py-3 text-sm shadow-inner outline-none transition-all duration-300 placeholder:text-slate-500 focus:ring-2 ${
                    isDark
                      ? 'border-white/10 bg-slate-950/60 text-white shadow-black/20 focus:border-blue-400/70 focus:ring-blue-400/20'
                      : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/5 focus:border-blue-400/70 focus:ring-blue-400/20'
                  }`}
                />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30 active:translate-y-0"
                >
                  <span>Subscribe</span>
                  <FaArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              <p className={`text-xs leading-5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

          <div className={dividerClass} />

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className={`text-xs font-medium tracking-wide ${titleClass}`}>
                &copy; {new Date().getFullYear()} GitHub Tracker. All rights reserved.
              </p>

              <p className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                Designed to stay clear, compact, and responsive across mobile, tablet, and desktop.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                    isDark
                      ? 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
                      : 'border-slate-200 bg-white text-slate-500 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;