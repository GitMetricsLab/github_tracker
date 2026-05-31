import { Link } from "react-router-dom";
import { Home, Ghost } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Animated Ghost Illustration */}
        <div className="relative flex flex-col items-center justify-center mb-8">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Ghost className="h-32 w-32 text-indigo-500 dark:text-indigo-400 drop-shadow-2xl" strokeWidth={1.5} />
          </motion.div>

          {/* Floating Shadow */}
          <motion.div
            animate={{ scale: [1, 0.7, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute -bottom-6 w-20 h-5 bg-gray-400 dark:bg-black rounded-[100%] blur-md"
          />
        </div>

        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-3 drop-shadow-sm">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Spooky... This page is a ghost town.
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
          The link you followed has vanished into the digital void, or maybe it never existed at all!
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:-translate-y-1 active:translate-y-0"
        >
          <Home className="h-5 w-5" />
          <span>Teleport Back Home</span>
        </Link>
      </motion.div>
      
      {/* Background decorative blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
};

export default NotFound;
