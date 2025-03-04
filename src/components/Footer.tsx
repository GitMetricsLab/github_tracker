import { FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-linear-to-r from-purple-800 via-pink-800 to-red-800 text-white py-2 mt-4 shadow-lg">
      <div className="container mx-auto text-center">
        <p className="text-sm md:text-base font-medium flex justify-center items-center space-x-2">
          <span>Made with ❤️ by <span className="font-semibold"><a href="https://github.com/mehul-m-prajapati"
            target="_blank">Mehul</a></span></span>
          <span>|</span>
          <a
            href="https://github.com/mehul-m-prajapati/github_tracker"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center text-white-400 hover:text-gray-600 transition duration-300 ease-in-out"
          >
            <FaGithub className="h-5 w-5 mr-2" /> {/* Using FaGithub icon */}
            GitHub Tracker
          </a>
        </p>
        <p className="text-sm md:text-base font-light mt-2">
          &copy; 2024 <span className="font-semibold">GitHub Tracker</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
