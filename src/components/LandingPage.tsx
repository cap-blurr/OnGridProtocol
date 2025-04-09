"use client";

import { useEffect } from "react";
import { useAnimation } from "framer-motion";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Hero from "./sections/Hero";
import { gradients } from "@/styles/gradients";
import { AboutSection } from "./sections/AboutUs";
import { ScrollAnimate } from "./ui/scroll-animation";
import StakeDeployTrack from "./sections/HowItWorks";
import HowItWorks from "./sections/HowItWorks";
import CTA from "./sections/CTA";
import WhyOngrid from "./sections/WhyOngrid";

export default function LandingPage() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      background: [gradients.primary, gradients.secondary, gradients.primary],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
      },
    });
  }, [controls]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Header isHome={true} />
      <main className="flex-grow">
        <Hero />
        <ScrollAnimate id="about" delay={0.5}>
          <AboutSection />
        </ScrollAnimate>

        <ScrollAnimate id="how-it-works" delay={0.5}>
          <HowItWorks />
        </ScrollAnimate>

        <ScrollAnimate delay={0.5}>
          <WhyOngrid />
        </ScrollAnimate>

        <ScrollAnimate delay={0.5}>
          <CTA />
        </ScrollAnimate>
      </main>
      <Footer />
    </div>
  );
}
