import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { Toaster } from "react-hot-toast";
import Router from "./Routes/Router";

function App() {
  return (
    <div
      className="relative flex flex-col min-h-screen transition-theme"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <ScrollProgressBar />
      <Navbar />

      <main className="flex-grow" style={{ backgroundColor: "var(--color-bg)" }}>
        <Router />
      </main>

      <Footer />

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{ top: 72 }}
        toastOptions={{
          style: {
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
          },
          duration: 4000,
          success: {
            duration: 3000,
            iconTheme: { primary: "#198038", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#DA1E28", secondary: "#fff" },
          },
        }}
      />
    </div>
  );
}

export default App;