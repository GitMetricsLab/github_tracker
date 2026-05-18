import { FaGithub } from 'react-icons/fa';
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
    <footer className="dark:text-white bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center p-3">
          <div className="flex items-center space-x-2 md:mb-0">
            <a
                href="https://github.com/GitMetricsLab/github_tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-gray-300 transition-colors"
            >
                <FaGithub className="h-5 w-5 mr-1" />
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
          <div className="flex space-x-6 text-gray-600 dark:text-gray-300">
            <Link to='/contact' className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</Link>
            <Link to='/about' className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
          </div>
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p className="text-xs md:text-sm font-semibold">
                &copy; {new Date().getFullYear()}{" "}
                <span className="font-semibold">GitHub Tracker</span>. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;