import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main ref={heroRef} className="relative min-h-screen overflow-hidden bg-black">
      {/* Grid background */}
      <div className="absolute inset-0 z-0" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111111' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-black/50 z-0"
        style={{
          backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
          transition: 'background-position 0.2s ease-out',
        }}
      />
      
      {/* Radial effect */}
      <div className="absolute inset-0 opacity-30 z-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)`,
          transition: 'background 0.1s ease-out',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-28 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative">
            {/* Thin accent line */}
            <div className="absolute -left-4 top-0 h-full w-px bg-emerald-700/30" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8 pl-6"
            >
              <span className="inline-block font-mono text-xs uppercase tracking-widest text-emerald-500 mb-2 relative">
                Blockchain Energy Network
                <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
              </span>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                Seamless <span className="text-emerald-400">Clean</span> <br className="hidden md:block" />
                Energy Transition <span className="relative">
                  for Enterprises
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M1 5C71.3333 -0.333333 141.667 -0.333333 212 5" stroke="#10B981" strokeWidth="2" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-zinc-400 text-lg max-w-xl">
                Support clean energy expansion in emerging markets—drive development, reduce CO₂, and earn sustainable returns.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link 
                  href="https://forms.gle/weTesyUcPou2Snug9" 
                  target="_blank"
                  className="inline-flex items-center justify-center px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200 group"
                >
                  Invest in a greener future
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/about" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-200 font-medium transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
              
              <div className="relative pt-12 grid grid-cols-3 gap-6 border-t border-zinc-800/60">
                <div>
                  <span className="text-3xl font-bold text-white">20+</span>
                  <p className="text-zinc-500 text-sm mt-1">Energy Partners</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-white">$1.2M</span>
                  <p className="text-zinc-500 text-sm mt-1">Energy Financed</p>
                </div>
                <div>
                  <span className="text-3xl font-bold text-white">30K</span>
                  <p className="text-zinc-500 text-sm mt-1">Carbon Credits</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 relative h-[400px] md:h-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-full w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent backdrop-blur-sm border border-emerald-900/30 overflow-hidden">
                {/* Inner designs */}
                <svg className="absolute top-0 right-0 w-full h-full opacity-40" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="150" stroke="#10B981" strokeWidth="0.5" strokeDasharray="3 3" />
                  <circle cx="200" cy="200" r="100" stroke="#10B981" strokeWidth="0.5" strokeDasharray="2 2" />
                  <circle cx="200" cy="200" r="50" stroke="#10B981" strokeWidth="0.5" />
                </svg>
                
                {/* Energy symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border border-emerald-800/60 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image src="/landing/turbine-green.png" alt="Turbine" width={50} height={50} className="w-16 h-16 object-contain" />
                    </div>
                  </div>
                </div>
                
                {/* Data points */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500 rounded-full">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                </div>
                <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-emerald-500 rounded-full">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                </div>
                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-emerald-500 rounded-full">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping" style={{ animationDuration: '5s' }} />
                </div>
                
                {/* Energy metrics */}
                <div className="absolute bottom-8 left-8 text-xs font-mono text-emerald-400 bg-black/50 px-2 py-1 flex items-center">
                  <span className="inline-block w-2 h-2 bg-emerald-500 mr-2"></span>
                  ENERGY OUTPUT: 24.5 KW
                </div>
                <div className="absolute top-8 right-8 text-xs font-mono text-emerald-400 bg-black/50 px-2 py-1 flex items-center">
                  <span className="inline-block w-2 h-2 bg-emerald-500 mr-2"></span>
                  CARBON OFFSET: 135.3 KG
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
