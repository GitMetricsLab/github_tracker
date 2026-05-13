import { motion } from "framer-motion";
import { Lightbulb, Users, Settings, Search } from "lucide-react";

const features = [
  {
    icon: <Search size={40} className="text-indigo-600 dark:text-indigo-400" />,
    title: "Simple Issue Tracking",
    description: "Track your GitHub issues seamlessly with intuitive filters and search options.",
  },
  {
    icon: <Users size={40} className="text-indigo-600 dark:text-indigo-400" />,
    title: "Team Collaboration",
    description: "Collaborate with your team in real-time, manage issues and pull requests effectively.",
  },
  {
    icon: <Settings size={40} className="text-indigo-600 dark:text-indigo-400" />,
    title: "Customizable Settings",
    description: "Customize your issue tracking workflow to match your team's needs.",
  },
];

const About = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white min-h-screen">
      
      {/* Hero Section */}
      <section className="py-24 text-center relative overflow-hidden">
        <motion.h1 
          className="text-5xl font-extrabold mb-4 drop-shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h1>
        <motion.p 
          className="text-xl max-w-xl mx-auto text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to <strong>GitHub Tracker</strong> — your smart solution to manage GitHub issues without chaos.
        </motion.p>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Lightbulb size={48} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed">
            We aim to provide an efficient and user-friendly way to track GitHub issues and pull requests.
            Our goal is to make it easy for developers to stay organized and focused on their projects
            without getting bogged down by the details.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-4xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl hover:shadow-xl transition duration-300 text-center border border-gray-100 dark:border-gray-700"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
