import Hero from "../../components/Hero";
import HowItWorks from "../../components/HowItWorks";
import Features from "../../components/Features";

function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
        <Hero />
        <Features />
        <HowItWorks />
    </div>
  )
}

export default Home
