import { motion } from "framer-motion";

interface Section {
  title: string;
  content: string;
}

interface LegalPageLayoutProps {
  title: string;
  intro: string;
  sections: Section[];
}

const LegalPageLayout = ({ title, intro, sections }: LegalPageLayoutProps) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white min-h-screen">
      
      {/* Hero */}
      <section className="py-24 text-center">
        <motion.h1
          className="text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-xl max-w-xl mx-auto text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>
      </section>

      {/* Content */}
      <section className="py-12 px-6 max-w-4xl mx-auto space-y-10 pb-24">
        <motion.p
          className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {intro}
        </motion.p>

        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            className="p-8 bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">
              {section.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default LegalPageLayout;