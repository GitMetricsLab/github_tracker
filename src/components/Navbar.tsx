import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
       <Link
  to="/"
  className="text-2xl font-bold hover:text-gray-300 cursor-pointer flex items-center"
>
  <img src="/crl-icon.png" alt="CRL Icon" className="h-8 mr-2" />
  GitHub Tracker
</Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/home"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Contact
          </Link>
          <Link
            to="/contributors"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >
            Contributors
          </Link>
          <Link
            to="/login"
            className="text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
          >Login</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-8 h-8 flex flex-col space-y-[5px] items-center group focus:outline-none"
          >
            <span
              className={`block h-[3px] w-full bg-white rounded-lg transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-[3px] w-full bg-white rounded-lg transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-[3px] w-full bg-white rounded-lg transition-transform duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="space-y-4 px-6 py-4">
            <Link
              to="/home"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/contributors"
              className="block text-lg font-medium hover:text-gray-300 transition-all px-2 py-1 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setIsOpen(false)}
            >
              Contributors
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
