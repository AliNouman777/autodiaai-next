import React from "react";
import Navbar from "@/components/Landing/Navbar";
import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import HowItWorks from "@/components/Landing/HowItWorks";
import UseCases from "@/components/Landing/UseCases";
import FAQ from "@/components/Landing/FAQ";
import Footer from "@/components/Landing/Footer";
import PromptExamples from "@/components/Landing/PromptExamples";

export default function Page() {
  return (
    <div className="text-sm justify-center container mx-auto  ">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <PromptExamples />
      <FAQ />
      <Footer />
    </div>
  );
}
