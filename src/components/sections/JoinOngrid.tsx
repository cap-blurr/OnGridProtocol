"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Code, Megaphone } from "lucide-react";

export default function JoinOngrid() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });



  // Color mapping for consistent styling
  const colorMap = {
    emerald: {
      bgLight: "bg-emerald-900/10",
      bgSolid: "bg-emerald-600",
      border: "border-emerald-700/40",
      text: "text-emerald-500",
      gradient: "from-emerald-600 to-emerald-400",
    },
    blue: {
      bgLight: "bg-blue-900/10",
      bgSolid: "bg-blue-600",
      border: "border-blue-700/40",
      text: "text-blue-500",
      gradient: "from-blue-600 to-blue-400",
    },
    amber: {
      bgLight: "bg-amber-900/10",
      bgSolid: "bg-amber-600",
      border: "border-amber-700/40",
      text: "text-amber-500",
      gradient: "from-amber-600 to-amber-400",
    },
  };

  return (
    <section 
      id="join"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-black"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Decorative elements */}
      <div className="absolute top-40 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-40 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section heading */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block mb-3">
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-sm font-mono">
              Join the Movement
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              ONLY One Earth
            </span>
            <span className="block mt-2 text-emerald-400">Invest to keep it GREEN</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Join OnGrid: Powering Clean Energy Together through community-driven investment, 
            innovation, and sustainable growth.
          </p>
        </motion.div>
        
          
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <div className="max-w-2xl mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to make an impact?</h3>
            <p className="text-zinc-400 mb-6">
              Join our community and be part of the solution for a sustainable future.
              Together, we can transform the energy landscape.
            </p>
            <Link
              href="https://forms.gle/moCpCKMtVwCpVa92A"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="px-8 py-6 h-auto bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-lg rounded-md">
                Build with us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
