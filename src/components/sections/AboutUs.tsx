'use client';

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define particle type
interface Particle {
  width: number;
  height: number;
  left: number;
  top: number;
  color: string;
  yMove: number;
  xMove: number;
  duration: number;
  delay: number;
}

export function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Client-side only state for random elements is managed elsewhere

  // Only render full content when in view to improve performance
  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 lg:py-32 overflow-hidden bg-black"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-800/30 to-transparent" />

        {/* Section heading */}
        <div className="mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-emerald-500 font-mono mb-4">About Ongrid Protocol</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Powering the Future of Clean Energy
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Ongrid Protocol is transforming how clean energy is financed, tracked, and scaled in emerging markets. 
              By leveraging blockchain technology, we connect investors with solar companies, ensuring capital 
              flows seamlessly to projects that bring affordable and sustainable energy to underserved regions.
            </p>
          </motion.div>
        </div>

        {/* Conditional rendering based on visibility for better performance */}
        {isInView && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-20">
            {/* Left column */}
            <motion.div 
              className="lg:col-span-5 mb-16 lg:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative aspect-[3/4] mb-10">
                <div className="absolute inset-0 -m-4 border border-emerald-900/50 -z-10" />
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80" 
                    alt="Renewable Energy" 
                    fill
                    className="object-cover"
                    loading="lazy" // Changed from priority to lazy for performance
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-2">Our Mission</h3>
                  <p className="text-zinc-300 text-sm">
                    To accelerate the transition to clean energy while providing transparent, data-driven solutions for carbon credit issuance and trading.
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-emerald-800/40 pl-6 py-2">
                <h3 className="text-2xl font-semibold text-white mb-3">Our Vision</h3>
                <p className="text-zinc-400">
                  A world where access to reliable, affordable clean energy is universal, driving economic growth while significantly reducing carbon emissions.
                </p>
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div 
              className="lg:col-span-7 lg:pl-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="mb-16">
                <div className="inline-block mb-6 relative">
                  <span className="inline-block relative z-10 text-white font-semibold text-lg">Why Ongrid Protocol?</span>
                  <div className="absolute bottom-0 left-0 h-3 w-full bg-emerald-900/30 -z-0" />
                </div>
                
                <div className="space-y-12">
                  <div className="flex gap-8">
                    <div className="flex-shrink-0 w-16 h-16 bg-black border border-emerald-800/50 flex items-center justify-center">
                      <span className="text-3xl font-bold text-emerald-500">01</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-3">Direct Impact</h4>
                      <p className="text-zinc-400">
                        Your investment fuels real change—providing electricity to homes, schools, and businesses while cutting CO₂ emissions.
                    </p>
                  </div>
                </div>

                  <div className="flex gap-8">
                    <div className="flex-shrink-0 w-16 h-16 bg-black border border-emerald-800/50 flex items-center justify-center">
                      <span className="text-3xl font-bold text-emerald-500">02</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-3">Trust & Transparency</h4>
                      <p className="text-zinc-400">
                        Blockchain-powered tracking ensures security and accountability in all transactions.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8">
                    <div className="flex-shrink-0 w-16 h-16 bg-black border border-emerald-800/50 flex items-center justify-center">
                      <span className="text-3xl font-bold text-emerald-500">03</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-3">Sustainable Growth</h4>
                      <p className="text-zinc-400">
                        Empowering communities with clean energy drives long-term economic development.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Button asChild className="group">
                  <Link href="/about">
                    Learn More About Us
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
