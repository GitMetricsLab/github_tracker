import { FaGithub, FaEnvelope, FaInfoCircle, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200/70 dark:border-gray-800/70 text-gray-700 dark:text-gray-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand Section */}
          <div className="space-y-3">
            <a
              href="https://github.com/GitMetricsLab/github_tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm">
                <FaGithub className="h-5 w-5" />
              </div>
              GitHub Tracker
            </a>

            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 max-w-sm">
              Track repositories, analyze contributions, and explore GitHub
              insights with a clean and intuitive interface.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Quick Links
            </h3>

            <div className="flex flex-col space-y-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <FaEnvelope className="h-3.5 w-3.5" />
                Contact Us
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <FaInfoCircle className="h-3.5 w-3.5" />
                About
              </Link>
            </div>
          </div>

          {/* Social Section */}
          <div className="space-y-3 md:text-right">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Connect
            </h3>

            <div className="flex md:justify-end">
              <a
                href="https://github.com/GitMetricsLab/github_tracker"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="group inline-flex items-center justify-center h-11 w-11 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all duration-300 hover:scale-105"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-500">
              Open source and community-driven.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-gray-500 dark:text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              GitHub Tracker
            </span>
            . All rights reserved.
          </p>

          <p className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            Made with <FaHeart className="h-3 w-3 text-red-500" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;