const About = () => {
  return (
    <div className="about-container w-full bg-gradient-to-br from-indigo-100 to-slate-100 dark:from-blue-950 dark:to-gray-900">
      {/* Main Flex Wrapper */}
      <div className="flex flex-col lg:flex-row mt-8 items-center justify-around gap-8 px-4">
        {/* Image Section */}
        <div className="border p-10 sm:p-14 border-indigo-400 rounded-lg shadow-lg hover:scale-105 duration-300 transition-all">
          <img className="w-32 sm:w-64 max-w-full h-auto" src="/crl-icon.png" alt="Logo" />
        </div>

        {/* About & Mission Sections */}
        <div className="w-full lg:w-2/3">
          <section className="hero text-gray-900 dark:text-white py-10 sm:py-16 px-4 md:px-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">About Us</h1>
            <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg leading-relaxed border border-gray-300 dark:border-gray-600 px-6 py-4 rounded-lg hover:scale-105 transition-all duration-300 shadow-md dark:shadow-gray-800">
              Welcome to <span className="font-semibold text-indigo-600 dark:text-indigo-400">GitHub Tracker</span>! 
              We simplify issue tracking for developers with clean design and powerful tools.
            </p>
          </section>

          <section className="mission py-10 sm:py-16 px-4 md:px-12 text-center text-gray-800 dark:text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg leading-relaxed border border-gray-300 dark:border-gray-600 px-6 py-4 rounded-lg hover:scale-105 transition-all duration-300 shadow-md dark:shadow-gray-800">
              We aim to provide an efficient and user-friendly way to track GitHub issues and pull requests. 
              Our goal is to keep developers focused and organized without the hassle.
            </p>
          </section>
        </div>
      </div>

      {/* Features Section */}
      <section className="features py-10 sm:py-16 px-4 md:px-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white">What We Do</h2>
        <div className="mt-10 flex flex-col md:flex-row justify-center items-stretch gap-10">
          {/* Feature 1 */}
          <div className="feature-item flex-1 max-w-sm w-full mx-auto text-center border border-gray-300 dark:border-gray-700 rounded-xl p-6 hover:bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-900 dark:to-pink-900 transition-all duration-300 shadow-md dark:shadow-lg">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold dark:text-white">Simple Issue Tracking</h3>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              Track GitHub issues with intuitive filters and fast search tools.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-item flex-1 max-w-sm w-full mx-auto text-center border border-gray-300 dark:border-gray-700 rounded-xl p-6 hover:bg-gradient-to-br from-green-100 to-yellow-100 dark:from-green-900 dark:to-yellow-900 transition-all duration-300 shadow-md dark:shadow-lg">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold dark:text-white">Team Collaboration</h3>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              Collaborate in real-time with your team and manage pull requests effectively.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-item flex-1 max-w-sm w-full mx-auto text-center border border-gray-300 dark:border-gray-700 rounded-xl p-6 hover:bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 transition-all duration-300 shadow-md dark:shadow-lg">
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold dark:text-white">Customizable Settings</h3>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              Tailor your workflow and preferences to fit your team’s needs and goals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
