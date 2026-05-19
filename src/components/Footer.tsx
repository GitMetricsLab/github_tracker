import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaDiscord, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Removed raw console logging of emails to protect user data privacy (PII leak fix)
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="w-full relative overflow-hidden transition-colors duration-300 border-t border-zinc-200 dark:border-zinc-800/80
      /* Light Mode: Restored your original crisp daylight background */
      bg-white 
      /* Dark Mode: Retained matching deep navy navbar theme background */
      dark:bg-[#0f172a]
      font-sans select-none"
    >
      <div className="max-w-7xl mx-auto px-8 pt-16 pb-10 relative z-10">
        
        {/* Upper Area: Clean Layout Grid from the image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-200 dark:border-zinc-800/60">
          
          {/* Column 1: Brand Presentation */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-3 text-xl font-bold tracking-tight group w-fit">
              <div className="p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200">
                <FaGithub className="h-5 w-5" />
              </div>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">
                GitHub Tracker
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-zinc-500 dark:text-zinc-400 font-medium">
              A clean and intuitive dashboard built to monitor repository health metrics, analyze contribution trends, and streamline your open-source workflows.
            </p>
          </div>

          {/* Column 2: Navigation Categories */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            
            {/* Resources Category */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-400 uppercase tracking-widest">
                Resources
              </h3>
              <ul className="space-y-3 text-sm font-semibold">
                <li>
                  <Link to="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Contact Support</Link>
                </li>
                <li>
                  <a 
                    href="https://github.com/GitMetricsLab/github_tracker/blob/main/CONTRIBUTING.md" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    Contributing
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Category */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-400 uppercase tracking-widest">
                Legal
              </h3>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <Link to="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Terms of Service</Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Column 3: Subscription Form matched directly to design layout */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-400 uppercase tracking-widest">
              Get latest update
            </h3>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2 w-full max-w-sm lg:max-w-none">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow text-sm px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
              />
              <button
                type="submit"
                className="px-5 py-3 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap"
              >
                <span>Subscribe</span>
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Lower Tray Area: Exact positioning architecture from your layout image */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
          
          {/* Sub Navigation Tray Links */}
          <div className="flex items-center space-x-6 order-2 sm:order-1">
            <Link to="/terms" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Terms & condition</Link>
            <span className="text-zinc-200 dark:text-zinc-800">|</span>
            <Link to="/privacy" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Privacy Policy</Link>
          </div>

          {/* Copyright block centered on screen layout */}
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 order-3 text-center">
            &copy; {new Date().getFullYear()} <span className="font-bold text-zinc-500 dark:text-zinc-400">GitHub Tracker</span>. All rights reserved.
          </div>
          
          {/* Social Icons (Right Aligned) - Icon sizes increased to h-5 w-5 */}
          <div className="flex items-center space-x-5 order-1 sm:order-3">
            <a 
              href="https://github.com/GitMetricsLab/github_tracker" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200"
              aria-label="GitHub Repository"
            >
              <FaGithub className="h-7 w-7" />
            </a>
            <a 
              href="https://x.com/your_handle" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 dark:text-zinc-500 hover:text-sky-500 dark:hover:text-zinc-100 transition-colors duration-200" 
              aria-label="Twitter"
            >
              <FaTwitter className="h-7 w-7" />
            </a>
            <a 
              href="https://discord.gg/your_invite" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-zinc-100 transition-colors duration-200" 
              aria-label="Discord"
            >
              <FaDiscord className="h-7 w-7" />
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;