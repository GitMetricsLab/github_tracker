import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { Toaster } from "react-hot-toast";
import Router from "./Routes/Router";
import ThemeWrapper from "./context/ThemeContext";
import ChatbotWidget from "./components/Chatbot/ChatbotWidget";

const FULLSCREEN_ROUTES = ["/signup", "/login"];

function App() {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  return (
      <div className="relative flex flex-col min-h-screen">
        {!isFullscreen && <ScrollProgressBar />}

        {!isFullscreen && <Navbar />}

        <main className={`flex justify-center items-center ${isFullscreen ? "flex-1" : "flex-grow bg-gray-50 dark:bg-gray-800"}`}>
          <Router />
        </main>

        {!isFullscreen && <Footer />}

        <ChatbotWidget />

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
  );
}

export default App;