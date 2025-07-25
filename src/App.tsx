import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from './components/ScrollProgressBar';
import { Toaster } from "react-hot-toast";

import Router from "./Routes/Router";

function App() {
  return (
      <div className="relative flex flex-col min-h-screen">
        <ScrollProgressBar/>
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow bg-gray-50 flex justify-center items-center">
          <Router/>
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