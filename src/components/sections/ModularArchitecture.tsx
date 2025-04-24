"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Users, Building, Leaf, Activity, LightbulbIcon } from "lucide-react";
import Link from "next/link";

export default function ModularArchitecture() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-black"
      id="how-it-works"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />

      {/* Subtle accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-800/30 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm uppercase tracking-widest text-emerald-500 font-mono mb-4">How It Works</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Power the Future with Ongrid Protocol
          </h3>
          <p className="text-zinc-400 text-lg mb-10">
            Invest in clean energy projects across emerging markets and drive real impact—empowering 
            communities, reducing CO₂ emissions, and earning sustainable returns. 
            With Ongrid Protocol, your investment fuels innovation, transparency, and the global energy transition.
          </p>
          <Link 
            href="https://forms.gle/weTesyUcPou2Snug9"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200"
          >
            Get Access <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>

        {/* For Investors & Solar Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* For Investors */}
          <motion.div 
            className="border border-zinc-800 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-14 h-14 bg-emerald-900/20 border border-emerald-700/30 flex items-center justify-center">
                <Users className="h-7 w-7 text-emerald-500" />
              </div>
              <h4 className="text-2xl font-semibold text-white ml-4">For Investors</h4>
            </div>
            
            <p className="text-zinc-400 mb-6">
              Invest in vetted clean energy projects across emerging markets. Your capital helps fund solar 
              companies that bring stable, affordable electricity to communities while generating measurable 
              environmental and social impact. In return, you earn sustainable yields on your investment—a true win-win.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="text-emerald-500 mt-1">
                  <div className="w-4 h-4 flex items-center justify-center">✓</div>
                </div>
                <span className="text-zinc-400">
                  <span className="font-semibold text-zinc-300">Secure & Transparent</span> – All loans undergo rigorous risk assessment before approval.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-emerald-500 mt-1">
                  <div className="w-4 h-4 flex items-center justify-center">✓</div>
                </div>
                <span className="text-zinc-400">
                  <span className="font-semibold text-zinc-300">Impact-Driven</span> – Support real-world projects reducing CO₂ emissions and empowering communities.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-emerald-500 mt-1">
                  <div className="w-4 h-4 flex items-center justify-center">✓</div>
                </div>
                <span className="text-zinc-400">
                  <span className="font-semibold text-zinc-300">Track & Reinvest</span> – Monitor your portfolio and reinvest repayments for even greater impact.
                </span>
              </li>
            </ul>
          </motion.div>
          
          {/* For Solar Companies */}
          <motion.div 
            className="border border-zinc-800 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-14 h-14 bg-blue-900/20 border border-blue-700/30 flex items-center justify-center">
                <Building className="h-7 w-7 text-blue-500" />
              </div>
              <h4 className="text-2xl font-semibold text-white ml-4">For Solar Companies</h4>
            </div>
            
            <p className="text-zinc-400 mb-6">
              Access the capital needed to scale clean energy solutions. Whether serving households, schools, 
              hospitals, or businesses, your company can expand its reach and accelerate the transition to sustainable power.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="text-blue-500 mt-1">
                  <div className="w-4 h-4 flex items-center justify-center">✓</div>
                </div>
                <span className="text-zinc-400">
                  <span className="font-semibold text-zinc-300">Flexible Financing</span> – Unlock funding to grow your operations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-blue-500 mt-1">
                  <div className="w-4 h-4 flex items-center justify-center">✓</div>
                </div>
                <span className="text-zinc-400">
                  <span className="font-semibold text-zinc-300">Seamless Integration</span> – Use Ongrid Protocol to track performance and impact.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-blue-500 mt-1">
                  <div className="w-4 h-4 flex items-center justify-center">✓</div>
                </div>
                <span className="text-zinc-400">
                  <span className="font-semibold text-zinc-300">Repay & Reinvest</span> – As you repay, investors receive returns, fueling continued expansion.
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* EdmondX Section */}
        <motion.div
          className="border border-zinc-800 p-8 mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-14 h-14 bg-amber-900/20 border border-amber-700/30 flex items-center justify-center">
              <Activity className="h-7 w-7 text-amber-500" />
            </div>
            <h4 className="text-2xl font-semibold text-white ml-4">Powered by EdmondX</h4>
          </div>
          
          <p className="text-zinc-400 mb-6 max-w-3xl">
            EdmondX enables real-time energy data tracking and on-chain carbon credit issuance. 
            By integrating your renewable infrastructure with EdmondX, you ensure full transparency 
            and unlock new revenue streams through carbon credit trading.
          </p>
        </motion.div>

        {/* Impact Section */}
        <motion.div
          className="mb-24 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h4 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Investing in Clean Energy, Empowering Communities
          </h4>
          <p className="text-zinc-400 text-lg mb-10">
            Every investment drives positive change—expanding access to clean electricity, 
            reducing CO₂ emissions, and fueling sustainable economic growth. By supporting 
            solar companies, you help power homes, businesses, and communities while earning a return.
          </p>
          <Link 
            href="https://forms.gle/weTesyUcPou2Snug9"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200"
          >
            Get Access to Make an Impact <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>

        {/* Why Section */}
        <motion.div
          className="border border-zinc-800 p-8 mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-14 h-14 bg-purple-900/20 border border-purple-700/30 flex items-center justify-center">
              <LightbulbIcon className="h-7 w-7 text-purple-500" />
            </div>
            <h4 className="text-2xl font-semibold text-white ml-4">Why Ongrid Protocol?</h4>
          </div>
          
          <p className="text-zinc-400 mb-6 max-w-3xl">
            High energy costs and unreliable power hinder economic growth in emerging markets. 
            Solar companies can bridge this gap, but they need capital to scale.
          </p>
          <p className="text-zinc-400 max-w-3xl">
            Ongrid Protocol connects these companies with private investors, enabling the expansion 
            of clean, affordable energy while offering investment opportunities that drive real-world 
            impact—powering communities, reducing CO₂ emissions, and fostering sustainable development.
          </p>
        </motion.div>
        
        {/* Final CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h4 className="text-2xl md:text-3xl font-bold text-white mb-6">Join the movement. Invest in clean energy. Make an impact.</h4>
          <Link 
            href="https://forms.gle/weTesyUcPou2Snug9"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200"
          >
            Join Us Today <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
