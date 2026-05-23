import { Link } from "react-router-dom";

export default function Custom404() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 px-6">
      <div className="text-center">
        <h1 className="text-7xl md:text-8xl font-extrabold text-blue-600 mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 text-lg mb-8 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Go Back Home
        </Link>
      </div>
    </section>
  );
}