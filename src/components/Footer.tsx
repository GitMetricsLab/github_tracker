import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaArrowRight,
  FaEnvelope,
  FaInfoCircle,
  FaShieldAlt, // ✅ Added Privacy Icon
} from 'react-icons/fa';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Replace with API call
    alert('Thank you for subscribing!');

    setEmail('');
  };

  return (
    <footer
      className="
        w-full relative overflow-hidden transition-colors duration-300
        border-t border-zinc-200 dark:border-zinc-800/80
        bg-white dark:bg-[#0f172a]
        font-sans select-none
        before:absolute before:inset-0
        before:bg-gradient-to-b before:from-blue-500/5
        before:to-transparent before:pointer-events-none
      "
    >
      <div className="max-w-7xl mx-auto px-8 pt-16 pb-10 relative z-10">
        {/* Upper Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-200 dark:border-zinc-800/60">

          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-3 text-xl font-bold tracking-tight group w-fit"
            >
              <div className="p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200">
                <FaGithub className="h-5 w-5" />
              </div>

              <span className="font-bold text-zinc-900 dark:text-zinc-50">
                GitHub Tracker
              </span>
            </Link>

            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 max-w-sm">
              Track repositories, analyze contributions, and explore GitHub
              insights with a clean and intuitive interface.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Quick Links
            </h3>

            <div className="flex flex-col space-y-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <FaEnvelope className="h-3.5 w-3.5" />
                Contact Us
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <FaInfoCircle className="h-3.5 w-3.5" />
                About
              </Link>

              {/* ✅ New Privacy Policy link integration */}
              <Link
                to="/privacy"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <FaShieldAlt className="h-3.5 w-3.5" />
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-5">
            <div className="
              p-6 md:p-8 rounded-2xl relative overflow-hidden
              border border-zinc-200/80 dark:border-zinc-800/60
              bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm
              flex flex-col space-y-4
            ">
              {/* Subtle background gradient to match design language */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col space-y-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-full border border-blue-100 dark:border-blue-900/30 w-fit">
                  <FaEnvelope className="h-3 w-3" />
                  <span>Newsletter</span>
                </span>

                <h3 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Stay updated with GitHub Tracker
                </h3>

                <p className="text-xs md:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Get monthly insights, product updates, and repository analytics delivered directly to your inbox.
                </p>
              </div>

              <form
                onSubmit={handleSubscribe}
                className="relative z-10 flex flex-col gap-3 w-full"
              >
                <div className="relative w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full text-sm px-4 py-3.5 pl-11
                      bg-white dark:bg-zinc-900/60
                      border border-zinc-200 dark:border-zinc-700/50
                      rounded-xl
                      focus:outline-none focus:ring-2
                      focus:ring-blue-500/20 focus:border-blue-500
                      text-zinc-900 dark:text-white
                      placeholder-zinc-400 dark:placeholder-zinc-500
                      transition-all
                    "
                    aria-label="Email address"
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>

                <button
                  type="submit"
                  className="
                    w-full px-5 py-3.5 text-sm font-bold
                    bg-blue-600 hover:bg-blue-700
                    text-white rounded-xl shadow-md hover:shadow-lg
                    active:scale-[0.98]
                    transition-all duration-300
                    hover:shadow-blue-500/20
                    flex items-center justify-center gap-1.5
                    whitespace-nowrap
                  "
                >
                  <span>Subscribe Now</span>
                  <FaArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">

          {/* Copyright */}
          <div className="text-center md:text-left text-gray-600 dark:text-gray-400">
            <p className="text-xs md:text-sm font-semibold">
              &copy; {new Date().getFullYear()}{' '}
              <span className="font-semibold">GitHub Tracker</span>. All rights reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-5">
            <a
              href="https://github.com/GitMetricsLab/github_tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
              aria-label="GitHub Repository"
            >
              <FaGithub className="h-6 w-6" />
            </a>

            <a
              href="https://x.com/your_handle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 dark:text-zinc-500 hover:text-sky-500 dark:hover:text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter className="h-6 w-6" />
            </a>

            <a
              href="https://discord.gg/your_invite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
              aria-label="Discord"
            >
              <FaDiscord className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;