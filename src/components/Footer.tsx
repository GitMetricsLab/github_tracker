import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  FaGithub,
  FaDiscord,
  FaArrowRight,
  FaEnvelope,
  FaInfoCircle,
} from 'react-icons/fa';

import { FaXTwitter } from 'react-icons/fa6';

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
          <div className="lg:col-span-5 flex flex-col space-y-4">
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
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Subscribe
            </h3>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-stretch gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  flex-grow text-sm px-4 py-3
                  bg-zinc-50 dark:bg-zinc-800/40
                  border border-zinc-200 dark:border-zinc-700/50
                  rounded-xl
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500/20 focus:border-blue-500
                  text-zinc-900 dark:text-white
                  placeholder-zinc-400 dark:placeholder-zinc-500
                  transition-all
                "
              />

              <button
                type="submit"
                className="
                  px-5 py-3 text-sm font-bold
                  bg-blue-600 hover:bg-blue-700
                  text-white rounded-xl shadow-sm
                  active:scale-[0.98]
                  transition-all duration-300
                  hover:shadow-lg hover:shadow-blue-500/20
                  flex items-center justify-center gap-1.5
                  whitespace-nowrap
                "
              >
                <span>Subscribe</span>
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
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

            {/* GitHub */}
            <a
              href="https://github.com/GitMetricsLab/github_tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
              aria-label="GitHub Repository"
            >
              <FaGithub className="h-6 w-6" />
            </a>

            {/* X / Twitter */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:scale-110 opacity-70 cursor-not-allowed"
              aria-label="X"
            >
              <FaXTwitter className="h-6 w-6" />
            </a>

            {/* Discord */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:scale-110 opacity-70 cursor-not-allowed"
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