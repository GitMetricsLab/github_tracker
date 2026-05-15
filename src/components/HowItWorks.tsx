
const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Search Users',
      description: 'Enter GitHub usernames or search for users by name. Add them to your tracking dashboard.'
    },
    {
      number: 2,
      title: 'Monitor Activity',
      description: 'Watch insights of commits, pull requests, issues, and other GitHub activities.'
    },
    {
      number: 3,
      title: 'Analyze Insights',
      description: 'Review detailed analytics, export reports, and gain valuable insights into development patterns.'
    }
  ];

  return (
    <section id="how-it-works" className="px-6 py-10 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
