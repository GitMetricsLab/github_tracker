
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from './components/ScrollProgressBar';
import { Toaster } from "react-hot-toast";
import { useTheme } from "./hooks/useTheme";

import Router from "./Routes/Router";

function App() {
  const { theme, setTheme } = useTheme();

  return (

      <div className="relative flex flex-col min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <ScrollProgressBar/>

        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow bg-gray-50 dark:bg-gray-800 flex justify-center items-center">
          <Router theme={theme} />
        </main>

        {/* Footer */}
        <Footer />

        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName="mt-12"
          containerStyle={{}}
          toastOptions={{
            className: 'bg-white',
            duration: 5000,
            //removeDelay: 1000,

            success: {
              duration: 3000,
              iconTheme: {
                primary: 'green',
                secondary: 'white',
              },
            },
          }}
        />
      </div>

  );
}

export default App;




