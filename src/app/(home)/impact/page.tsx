"use client";

import Header from "@/components/layout/Header";
import WhyItMatters from "@/components/impact/WhyItMatters";
import { GetInvolved } from "@/components/impact/GetInvolved";
import Footer from "@/components/layout/Footer";
import ImpactHero from "@/components/impact/ImpactHero";
import { ScrollAnimate } from "@/components/ui/scroll-animation";

export default function AboutSection() {
  return (
    <>
      <Header isHome={false} />
      <ScrollAnimate delay={0.5}>
        <ImpactHero />
      </ScrollAnimate>
      <ScrollAnimate delay={0.5}>
        <WhyItMatters />
      </ScrollAnimate>
      <ScrollAnimate delay={0.5}>
        <GetInvolved />
      </ScrollAnimate>
      <Footer />
    </>
  );
}
