import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import DownloadExtension from "@/components/DownloadExtension";
import DemoVideo from "@/components/DemoVideo";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DownloadExtension />
        <DemoVideo />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </>
  );
}