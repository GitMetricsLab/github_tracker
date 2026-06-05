import { motion } from "framer-motion";
import { Search, Users, Settings, Lightbulb, Github } from "lucide-react";

const features = [
  {
    icon: <Search size={40} />,
    title: "Simple Issue Tracking",
    description:
      "Track GitHub issues effortlessly with powerful filters and search capabilities.",
  },
  {
    icon: <Users size={40} />,
    title: "Team Collaboration",
    description:
      "Collaborate seamlessly with your team and manage pull requests efficiently.",
  },
  {
    icon: <Settings size={40} />,
    title: "Custom Workflows",
    description:
      "Adapt issue management workflows to fit your team's unique needs.",
  },
];

const stats = [
  { value: "10K+", label: "Repositories Tracked" },
  { value: "50K+", label: "Issues Managed" },
  { value: "2K+", label: "Contributors" },
  { value: "99.9%", label: "Platform Uptime" },
];

const team = [
  {
    name: "John Doe",
    role: "Frontend Developer",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Sarah Smith",
    role: "Backend Developer",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Alex Brown",
    role: "UI/UX Designer",
    image: "https://i.pravatar.cc/150?img=8",
  },
];

const testimonials = [
  {
    name: "Michael Johnson",
    quote:
      "GitHub Tracker transformed the way our team handles issues and pull requests.",
  },
  {
    name: "Emily Davis",
    quote:
      "Beautiful UI, excellent performance, and a huge productivity boost.",
  },
  {
    name: "David Wilson",
    quote: "The best GitHub issue management experience we've ever used.",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const About = () => {
  return (
    <main className="bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black text-black dark:text-white overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Hero Section */}
      <section className="relative py-32">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-sm mb-6">
              <Github size={16} />
              GitHub Issue Management Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Manage GitHub Issues
              <span className="block text-indigo-600 dark:text-indigo-400">
                Smarter & Faster
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Stay organized, collaborate effectively, and track repositories
              with a modern dashboard built for developers and teams.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                aria-label="Get Started"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
              >
                Get Started
              </button>

              <button
                aria-label="View Demo"
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              alt="GitHub Tracker Dashboard"
              className="rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 text-center"
            >
              <h3 className="text-4xl font-bold text-indigo-600">
                {stat.value}
              </h3>
              <p className="text-gray-500 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Lightbulb size={52} className="mx-auto text-indigo-600 mb-6" />

          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We believe developers should spend less time managing issues and
            more time building amazing products. GitHub Tracker simplifies
            repository management, issue tracking, and team collaboration in one
            streamlined platform.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-4xl font-bold text-center mb-14">What We Do</h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{
                y: -10,
              }}
              className="group bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>

              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section className="py-24 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Dashboard</h2>

          <p className="text-gray-600 dark:text-gray-300 mb-10">
            Visualize repository activity, monitor issues, and track pull
            requests from one beautiful interface.
          </p>

          <img
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
            alt="Dashboard Showcase"
            className="rounded-3xl shadow-2xl mx-auto"
          />
        </motion.div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-4xl font-bold text-center mb-14">
          Meet Our Contributors
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center shadow-lg"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-5"
              />

              <h3 className="text-xl font-bold">{member.name}</h3>

              <p className="text-gray-500">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-14">What Users Say</h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg"
            >
              <p className="italic text-gray-600 dark:text-gray-300 mb-4">
                "{testimonial.quote}"
              </p>

              <h4 className="font-semibold">{testimonial.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">
              GitHub Tracker
            </h3>

            <p>Modern repository and issue management built for developers.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>

            <ul className="space-y-2">
              <li>Features</li>
              <li>Dashboard</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>

            <ul className="space-y-2">
              <li>Documentation</li>
              <li>Support</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>

            <ul className="space-y-2">
              <li>About</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12 text-sm border-t border-gray-800 pt-6">
          © 2026 GitHub Tracker. All rights reserved.
        </div>
      </footer>
    </main>
  );
};

export default About;
