import Hero from "../../components/Hero";
import HowItWorks from "../../components/HowItWorks";
import Features from "../../components/Features";
import BackToTopButton from "../../components/Backtotop";

function Home() {
  return (
    <div className="">
        <Hero />
        <Features />
        <HowItWorks />
        <BackToTopButton/>
    </div>
  )
}

export default Home
