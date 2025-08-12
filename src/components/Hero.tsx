import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Track GitHub Activity
            <span className="block text-blue-600">Like Never Before</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Monitor and analyze GitHub user activity with powerful insights. Perfect for developers,
            project managers, and teams who want to understand contribution patterns and repository engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <Link to='/track'>Start Tracking</Link>
            </button>
            {/*
            <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2">
              <span>View Demo</span>
              <ArrowRight className="h-5 w-5" />
            </button>*/}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
