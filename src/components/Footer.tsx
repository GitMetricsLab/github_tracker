import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
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
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Project Info */}
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">GitHub Tracker</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Track and analyze GitHub repositories with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">Quick Links</h4>
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex flex-col space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">Connect With Us</h4>
            <a
              href="https://github.com/GitMetricsLab/github_tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              <FaGithub className="h-5 w-5 mr-2" />
              GitHub
            </a>
            <a
              href="https://twitter.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              <FaTwitter className="h-5 w-5 mr-2" />
              Twitter
            </a>
            <a
              href="https://linkedin.com/company/example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              <FaLinkedin className="h-5 w-5 mr-2" />
              LinkedIn
            </a>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 text-center text-gray-600 dark:text-gray-400">
          <p className="text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} GitHub Tracker. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;