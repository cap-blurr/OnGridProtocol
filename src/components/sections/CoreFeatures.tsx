"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, BarChart2, Users, Zap, BrainCircuit, Coins } from "lucide-react";

export default function CoreFeatures() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const features = [
    {
      id: "investments",
      title: "Trustless Energy Investments",
      description: "Secure, verifiable transactions for effortless green investments, powered by AI to identify optimal returns and carbon impact.",
      icon: Leaf,
      color: "emerald",
      label: "INVEST",
      stats: ["$1.5M+ invested", "500+ backers", "12 active projects"]
    },
    {
      id: "layer2",
      title: "Scalable Layer 2 Framework",
      description: "High-speed, low-cost transactions suited for large-scale renewable energy initiatives.",
      icon: BarChart2,
      color: "blue",
      label: "CONNECT",
      stats: ["5,000+ TPS", "<$0.01 transaction fee", "99.97% uptime"]
    },
  
    {
      id: "depin",
      title: "DePin Devices & Carbon Credit Mining",
      description: "Deploy DePin (Decentralized Physical Infrastructure) devices to track, verify, and mine carbon credits on-chain—rewarding eco-friendly participation.",
      icon: Zap,
      color: "purple",
      label: "DEPLOY",
      stats: ["15K+ tons CO₂ offset", "750+ IoT devices", "Real-time verification"]
    },
  ];

  // Color mapping
  const colorMap = {
    emerald: {
      bgLight: "bg-emerald-900/10",
      bgDark: "bg-emerald-900/20",
      border: "border-emerald-700/40",
      text: "text-emerald-500",
      fill: "fill-emerald-500/20",
      stroke: "stroke-emerald-500/40"
    },
    blue: {
      bgLight: "bg-blue-900/10",
      bgDark: "bg-blue-900/20",
      border: "border-blue-700/40",
      text: "text-blue-500",
      fill: "fill-blue-500/20",
      stroke: "stroke-blue-500/40"
    },
    amber: {
      bgLight: "bg-amber-900/10",
      bgDark: "bg-amber-900/20",
      border: "border-amber-700/40",
      text: "text-amber-500",
      fill: "fill-amber-500/20",
      stroke: "stroke-amber-500/40"
    },
    purple: {
      bgLight: "bg-purple-900/10",
      bgDark: "bg-purple-900/20",
      border: "border-purple-700/40",
      text: "text-purple-500",
      fill: "fill-purple-500/20",
      stroke: "stroke-purple-500/40"
    },
    rose: {
      bgLight: "bg-rose-900/10",
      bgDark: "bg-rose-900/20",
      border: "border-rose-700/40",
      text: "text-rose-500",
      fill: "fill-rose-500/20",
      stroke: "stroke-rose-500/40"
    },
    teal: {
      bgLight: "bg-teal-900/10",
      bgDark: "bg-teal-900/20",
      border: "border-teal-700/40",
      text: "text-teal-500",
      fill: "fill-teal-500/20",
      stroke: "stroke-teal-500/40"
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-black"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section heading */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm uppercase tracking-widest text-emerald-500 font-mono mb-4">Platform Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Core Features
          </h3>
          <p className="text-zinc-400 text-lg">
            Our comprehensive platform combines renewable energy asset management, 
            AI-driven insights, and decentralized governance in one seamless ecosystem.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const colors = colorMap[feature.color as keyof typeof colorMap];
            
            return (
              <motion.div
                key={feature.id}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className={`relative p-6 border ${colors.border} h-full group hover:border-opacity-50 transition-all duration-300`}>
                  {/* Feature badge */}
                  <div className="absolute -top-3 left-6 px-2 py-1 text-xs font-mono tracking-wider bg-black">
                    <span className={colors.text}>{feature.label}</span>
                  </div>
                  
                  {/* Icon & title */}
                  <div className="mb-6 flex items-start">
                    <div className={`w-12 h-12 ${colors.bgLight} flex items-center justify-center mr-4 shrink-0`}>
                      <feature.icon size={24} className={colors.text} />
                    </div>
                    <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                  </div>
                  
                  {/* Description */}
                  <p className="text-zinc-400 mb-6">{feature.description}</p>
                  
                  {/* Background SVG patterns */}
                  <div className="absolute right-4 bottom-4 w-24 h-24 opacity-10">
                    <svg viewBox="0 0 100 100" className={colors.stroke}>
                      {feature.id === "investments" && (
                        <path d="M10,90 L30,50 L50,70 L70,30 L90,50" strokeWidth="2" fill="none" />
                      )}
                      {feature.id === "layer2" && (
                        <g>
                          <rect x="20" y="20" width="60" height="60" fill="none" strokeWidth="2" />
                          <rect x="30" y="30" width="40" height="40" fill="none" strokeWidth="2" />
                          <rect x="40" y="40" width="20" height="20" fill="none" strokeWidth="2" />
                        </g>
                      )}
                      {feature.id === "tokenization" && (
                        <g>
                          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="2" />
                          <circle cx="50" cy="50" r="30" fill="none" strokeWidth="2" />
                          <circle cx="50" cy="50" r="20" fill="none" strokeWidth="2" />
                        </g>
                      )}
                      {feature.id === "depin" && (
                        <g>
                          <path d="M20,50 L50,20 L80,50 L50,80 Z" fill="none" strokeWidth="2" />
                          <path d="M35,50 L50,35 L65,50 L50,65 Z" fill="none" strokeWidth="2" />
                        </g>
                      )}
                      {feature.id === "ai" && (
                        <g>
                          <path d="M25,25 C40,10 60,10 75,25 C90,40 90,60 75,75 C60,90 40,90 25,75 C10,60 10,40 25,25 Z" fill="none" strokeWidth="2" />
                          <circle cx="50" cy="50" r="10" fill="none" strokeWidth="2" />
                          <line x1="50" y1="20" x2="50" y2="40" strokeWidth="2" />
                          <line x1="50" y1="60" x2="50" y2="80" strokeWidth="2" />
                          <line x1="20" y1="50" x2="40" y2="50" strokeWidth="2" />
                          <line x1="60" y1="50" x2="80" y2="50" strokeWidth="2" />
                        </g>
                      )}
                      {feature.id === "dao" && (
                        <g>
                          <circle cx="50" cy="30" r="10" fill="none" strokeWidth="2" />
                          <circle cx="30" cy="70" r="10" fill="none" strokeWidth="2" />
                          <circle cx="70" cy="70" r="10" fill="none" strokeWidth="2" />
                          <line x1="50" y1="40" x2="30" y2="60" strokeWidth="2" />
                          <line x1="50" y1="40" x2="70" y2="60" strokeWidth="2" />
                          <line x1="30" y1="70" x2="70" y2="70" strokeWidth="2" />
                        </g>
                      )}
                    </svg>
                  </div>
                  
                  {/* Stats */}
                  <div className={`mt-6 pt-4 border-t border-zinc-800`}>
                    <ul className="grid grid-cols-1 gap-y-1">
                      {feature.stats.map((stat, statIndex) => (
                        <li key={statIndex} className="text-xs flex items-center">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors.bgDark} mr-2`}></span>
                          <span className="text-zinc-400">{stat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hover effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 -z-10 ${colors.bgLight} blur-sm`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative mt-16 border border-zinc-800/60 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/5 to-blue-900/5 -z-10" />
          
          <div className="mb-6 md:mb-0 md:max-w-xl">
            <h4 className="text-2xl font-bold text-white mb-3">Ready to join the green energy revolution?</h4>
            <p className="text-zinc-400">Experience the future of renewable energy investment with our comprehensive platform.</p>
          </div>
          
          <div className="inline-flex relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-md blur opacity-30"></div>
            <button className="relative bg-emerald-900/50 border border-emerald-700/30 px-6 py-3 text-white font-medium hover:bg-emerald-800/50 transition-colors duration-200">
              Join Waitlist
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
