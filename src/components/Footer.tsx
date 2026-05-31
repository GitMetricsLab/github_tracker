import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaDiscord, FaArrowRight, FaEnvelope } from 'react-icons/fa';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up to backend
    alert('Thanks — subscription received!');
    setEmail('');
  };

  return (
    <footer className="bg-slate-50 dark:bg-gray-900 text-slate-700 dark:text-slate-300 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/crl-icon.png" alt="logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">GitHub Tracker</span>
            </Link>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
              Track repos, contributors and code activity with clear visualizations and quick insights.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/GitMetricsLab/github_tracker" target="_blank" rel="noreferrer" className="p-2 rounded-md text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <FaGithub className="w-5 h-5" />
              </a>

              <a href="#" className="p-2 rounded-md text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 transition">
                <FaTwitter className="w-5 h-5" />
              </a>

              <a href="#" className="p-2 rounded-md text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition">
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/track" className="hover:text-blue-600">Tracker</Link></li>
                <li><Link to="/contributors" className="hover:text-blue-600">Contributors</Link></li>
                <li><Link to="/community" className="hover:text-blue-600">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-600">Privacy</Link></li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Get updates</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Subscribe for release notes and highlights.</p>

            <form onSubmit={handleSubscribe} className="mt-3 flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-3 py-2 rounded-l-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md flex items-center gap-2">
                <span className="text-sm">Join</span>
                <FaArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} GitHub Tracker. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-xs hover:text-blue-600">Terms</Link>
            <Link to="/privacy" className="text-xs hover:text-blue-600">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

