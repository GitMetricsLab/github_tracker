import { FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-800 via-pink-800 to-red-800 text-white py-4 mt-8 shadow-lg">
      <div className="container mx-auto text-center px-4">
        <p className="text-sm md:text-base font-medium flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <span>
            Made with ❤️ by{" "}
            <a
              href="https://github.com/mehul-m-prajapati"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Mehul
            </a>
          </span>
          <span className="hidden sm:inline">|</span>
          <a
            href="https://github.com/mehul-m-prajapati/github_tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:text-gray-300 transition-colors"
          >
            <FaGithub className="h-5 w-5 mr-1" />
            GitHub Tracker
          </a>
        </p>
        <p className="text-xs md:text-sm font-light mt-2">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">GitHub Tracker</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
