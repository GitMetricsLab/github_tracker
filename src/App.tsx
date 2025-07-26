import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { Toaster } from "react-hot-toast";
import Router from "./Routes/Router";
import ThemeWrapper from "./ThemeContext"; // ✅ import your wrapper

function App() {
  return (
    <ThemeWrapper>
      <div className="relative flex flex-col min-h-screen">
        <ScrollProgressBar />

        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
          <Router />
        </main>

        {/* Footer */}
        <Footer />

        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName="mt-12"
          toastOptions={{
            className: "bg-white dark:bg-gray-800 text-black dark:text-white",
            duration: 5000,
            success: {
              duration: 3000,
              iconTheme: {
                primary: "green",
                secondary: "white",
              },
            },
          }}
        />
      </div>
    </ThemeWrapper>
  );
}

export default App;