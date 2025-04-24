"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Lock, BarChart3, Users, ZapIcon, BrainCircuit } from "lucide-react";

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacityProgress = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.3, 1, 1, 0.3]);
  
  const steps = [
    {
      number: "01",
    title: "Tokenized Asset Staking",
      description: "Secure ownership in renewable assets through token-based staking, allowing fractional investment in clean energy projects.",
      icon: Lock,
      color: "bg-emerald-900/20",
      borderColor: "border-emerald-700/30",
      iconColor: "text-emerald-500",
      bgImage: "url('/assets/staking-bg.jpg')",
      defaultImage: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      number: "02",
    title: "Project Tracking",
      description: "Monitor real-time analytics of energy production and carbon credits from all deployed renewable assets in your portfolio.",
      icon: BarChart3,
      color: "bg-blue-900/20",
      borderColor: "border-blue-700/30",
      iconColor: "text-blue-500",
      bgImage: "url('/assets/tracking-bg.jpg')",
      defaultImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      number: "03",
    title: "Green DAO Participation",
      description: "Vote on project selection, deployment locations, and profit distribution through our decentralized governance system.",
      icon: Users,
      color: "bg-teal-900/20",
      borderColor: "border-teal-700/30",
      iconColor: "text-teal-500",
      bgImage: "url('/assets/dao-bg.jpg')",
      defaultImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      number: "04",
    title: "AI Insights",
      description: "Access predictive analytics and optimization recommendations for your energy investments powered by machine learning.",
      icon: BrainCircuit,
      color: "bg-purple-900/20",
      borderColor: "border-purple-700/30",
      iconColor: "text-purple-500",
      bgImage: "url('/assets/ai-bg.jpg')",
      defaultImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      number: "05",
    title: "DePin Carbon Mining",
      description: "Generate carbon credits through physical IoT devices that measure and verify emissions reduction in real-time.",
      icon: ZapIcon,
      color: "bg-amber-900/20",
      borderColor: "border-amber-700/30",
      iconColor: "text-amber-500",
      bgImage: "url('/assets/carbon-bg.jpg')",
      defaultImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-black"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />

      {/* Connection lines for workflow */}
      <div className="absolute left-1/2 top-[240px] bottom-32 w-px border-l border-dashed border-emerald-800/30 hidden lg:block" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section heading */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm uppercase tracking-widest text-emerald-500 font-mono mb-4">How It Works</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
        Stake, Build, Deploy & Track
          </h3>
          <p className="text-zinc-400 text-lg">
            Our comprehensive platform manages the entire lifecycle of renewable energy investments,
            from initial staking to real-time monitoring and carbon credit generation.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="space-y-24 relative"
          style={{ opacity: opacityProgress }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className={`flex flex-col lg:flex-row gap-8 lg:gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              {/* Content */}
              <div className="lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div className={`flex-shrink-0 w-14 h-14 ${step.color} border ${step.borderColor} flex items-center justify-center z-10`}>
                    <step.icon className={`h-7 w-7 ${step.iconColor}`} />
                  </div>
                  <div className="ml-4">
                    <span className="text-4xl font-bold text-zinc-700">{step.number}</span>
                  </div>
                </div>
                
                <h4 className="text-2xl font-semibold text-white mb-4">{step.title}</h4>
                <p className="text-zinc-400 mb-6 max-w-lg">{step.description}</p>
                
                <div className="inline-flex items-center text-emerald-500 text-sm font-semibold group cursor-pointer">
                  <span>Learn more</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Visual */}
              <div className="lg:w-1/2 h-80">
                <div className="relative h-full w-full overflow-hidden">
                  <div className="absolute inset-0 border border-zinc-800/60">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    <img 
                      src={step.bgImage} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = step.defaultImage;
                      }}
                    />
                  </div>
                  
                  {/* Data visualization overlay specific to each step */}
                  <div className="absolute inset-0 z-20 opacity-60">
                    {index === 0 && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="30" cy="30" r="8" fill="rgba(16, 185, 129, 0.2)" />
                        <circle cx="30" cy="30" r="4" fill="rgba(16, 185, 129, 0.4)" />
                        <circle cx="70" cy="40" r="6" fill="rgba(16, 185, 129, 0.2)" />
                        <circle cx="70" cy="40" r="3" fill="rgba(16, 185, 129, 0.4)" />
                        <circle cx="50" cy="70" r="10" fill="rgba(16, 185, 129, 0.2)" />
                        <circle cx="50" cy="70" r="5" fill="rgba(16, 185, 129, 0.4)" />
                        <path d="M30 30 L70 40 L50 70 Z" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="0.5" fill="none" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M10 80 L20 60 L30 70 L40 40 L50 50 L60 20 L70 30 L80 10 L90 15" 
                          stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1" fill="none" />
                        <circle cx="40" cy="40" r="4" fill="rgba(59, 130, 246, 0.5)" />
                        <circle cx="60" cy="20" r="4" fill="rgba(59, 130, 246, 0.5)" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(20, 184, 166, 0.3)" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(20, 184, 166, 0.1)" strokeWidth="0.5" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                          <line 
                            key={i}
                            x1="50" 
                            y1="50" 
                            x2={50 + 40 * Math.cos(angle * Math.PI / 180)} 
                            y2={50 + 40 * Math.sin(angle * Math.PI / 180)} 
                            stroke="rgba(20, 184, 166, 0.2)" 
                            strokeWidth="0.5" 
                          />
                        ))}
                      </svg>
                    )}
                    {index === 3 && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <path 
                            key={i}
                            d={`M${10 + i * 6} 80 Q${15 + i * 6} ${20 + Math.random() * 30} ${20 + i * 6} ${70 + Math.random() * 20}`}
                            stroke="rgba(147, 51, 234, 0.3)" 
                            strokeWidth="0.5" 
                            fill="none" 
                          />
                        ))}
                      </svg>
                    )}
                    {index === 4 && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <circle 
              key={i}
                            cx={20 + Math.random() * 60} 
                            cy={20 + Math.random() * 60} 
                            r={1 + Math.random() * 3}
                            fill="rgba(251, 191, 36, 0.3)" 
                          />
                        ))}
                        <line x1="20" y1="20" x2="80" y2="80" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="0.5" strokeDasharray="2,2" />
                        <line x1="20" y1="80" x2="80" y2="20" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="0.5" strokeDasharray="2,2" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Bottom information bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4 z-30">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-mono text-zinc-400">{`STEP ${step.number} / 05`}</div>
                      <div className={`h-1 w-16 ${step.iconColor} opacity-70`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Final CTA */}
        <motion.div 
          className="mt-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-8">
            <div className="px-6 py-2 rounded-full bg-black text-white font-medium">
              Ready to get started?
            </div>
          </div>
          <h4 className="text-2xl md:text-3xl font-bold text-white mb-6">Begin your journey in renewable energy investment</h4>
          <button className="px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200">
            Join the waitlist
          </button>
        </motion.div>
      </div>
    </section>
  );
}
