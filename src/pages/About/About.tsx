const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4">
        <h1 className="text-4xl font-bold text-center">About Us</h1>
        <p className="text-lg text-center mt-4">
          Welcome to GitHub Tracker! We simplify issue tracking for developers.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mission py-12 text-gray-800 dark:text-gray-100 px-4">
        <h2 className="text-3xl font-semibold text-center">Our Mission</h2>
        <p className="text-lg text-center mt-4 max-w-3xl mx-auto">
          We aim to provide an efficient and user-friendly way to track GitHub
          issues and pull requests. Our goal is to make it easy for developers to
          stay organized and focused on their projects without getting bogged down
          by the details.
        </p>
      </section>

      {/* Features Section */}
      <section className="features bg-gray-100 dark:bg-gray-800 py-12 text-gray-800 dark:text-gray-100 px-4">
        <h2 className="text-3xl font-semibold text-center">What We Do</h2>
        <div className="flex justify-around mt-8 flex-wrap gap-8">
          <div className="feature-item text-center max-w-xs">
            <div className="feature-icon text-4xl">🔍</div>
            <h3 className="font-semibold mt-4">Simple Issue Tracking</h3>
            <p className="text-lg mt-2 dark:text-gray-300">
              Track your GitHub issues seamlessly with intuitive filters and search options.
            </p>
          </div>
          <div className="feature-item text-center max-w-xs">
            <div className="feature-icon text-4xl">👥</div>
            <h3 className="font-semibold mt-4">Team Collaboration</h3>
            <p className="text-lg mt-2 dark:text-gray-300">
              Collaborate with your team in real-time, manage issues and pull requests effectively.
            </p>
          </div>
          <div className="feature-item text-center max-w-xs">
            <div className="feature-icon text-4xl">⚙️</div>
            <h3 className="font-semibold mt-4">Customizable Settings</h3>
            <p className="text-lg mt-2 dark:text-gray-300">
              Customize your issue tracking workflow to match your team's needs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
