import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import DownloadExtension from "@/components/DownloadExtension";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DownloadExtension />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </>
  );
}