import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { Toaster } from "react-hot-toast";
import Router from "./Routes/Router";
import ThemeWrapper from "./context/ThemeContext";

function App() {
  return (
    <ThemeWrapper>
      <div className="relative flex flex-col min-h-screen">
        <ScrollProgressBar />

        <Navbar />

        <main className="flex-grow bg-white dark:bg-dark flex justify-center items-center">
          <Router />
        </main>

        <Footer />

        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName="mt-12"
          toastOptions={{
            className: "bg-white dark:bg-dark-lighter text-black dark:text-white",
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
