'use client';

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Clock, Coins, Github, Globe, Rocket, Target, Twitter, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IconBrandDiscord } from "@tabler/icons-react";

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

// Featured project data
const featuredProject = {
  id: 1,
  name: "Green DeFi",
  description: "Revolutionary sustainable DeFi protocol with advanced yield farming mechanisms and eco-friendly blockchain solutions",
  image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop",
  status: "Live",
  participants: 1234,
  timeLeft: "2 days",
  raised: 850000,
  target: 1000000,
  progress: 85,
  tokenPrice: 0.85,
  totalSupply: "100,000,000",
  minAllocation: 50,
  maxAllocation: 5000,
  access: "Public",
  chain: "Base",
  socials: {
    website: "https://example.com",
    twitter: "https://twitter.com",
    github: "https://github.com",
    discord: "https://discord.com",
  },
  tags: ["Sustainable", "Cross-chain", "Green"],
};

export function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Client-side only state for random elements with proper typing
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Move random calculations to useEffect to ensure client-side only execution
  useEffect(() => {
    setIsClient(true);
    
    // Generate consistent particles only on client-side
    const newParticles: Particle[] = Array(12).fill(0).map(() => ({
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: Math.random() > 0.6 
        ? 'rgba(52, 211, 153, 0.5)' 
        : Math.random() > 0.5 
          ? 'rgba(96, 165, 250, 0.5)' 
          : 'rgba(139, 92, 246, 0.5)',
      yMove: Math.random() * 30 - 15,
      xMove: Math.random() * 30 - 15,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5
    }));
    
    setParticles(newParticles);
  }, []);

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

        {/* Main content */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-20">
          {/* Left column */}
          <motion.div 
            className="lg:col-span-5 mb-16 lg:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
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
                  priority
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
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
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

            <div className="border-t border-zinc-800 pt-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <p className="text-white text-xl font-semibold mb-2">Join us in shaping a cleaner, greener future</p>
                  <p className="text-zinc-400">Where investing in energy means investing in people and the planet.</p>
                </div>
                <div>
                  <Link 
                    href="/access" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors duration-200"
                  >
                    Get Access
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Project Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 relative pb-0"
        >
          <div className="mb-6">
            <div className="flex justify-center mb-2">
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-oga-green/20 to-oga-green/10 backdrop-blur-sm border border-oga-green/20">
                <span className="text-xs font-medium text-oga-green">Featured Investment</span>
              </div>
            </div>
            <h2 className="text-center text-xl font-bold mb-2">
              <span className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                Start Investing Today
              </span>
            </h2>
            <p className="text-center text-xs text-zinc-400 max-w-md mx-auto mb-6">
              Begin your sustainable investment journey with our featured project.
            </p>
          </div>

          {/* Project card with impact cards */}
          <div className="relative max-w-5xl mx-auto px-4">
            {/* Left impact card */}
            {isClient && (
              <motion.div 
                className="absolute -left-4 md:-left-60 top-1/2 -translate-y-1/2 hidden md:block z-20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.div 
                  className="backdrop-blur-sm p-5 rounded-lg border border-zinc-800 w-48 bg-gradient-to-br from-zinc-900/80 to-zinc-950/90"
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: 'rgba(16, 185, 129, 0.5)',
                    boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <div className="flex items-start mb-3">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mr-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5"/>
                        <path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Ongrid Impact</h3>
                      <p className="text-xs text-zinc-400">Since 2025</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between items-center">
                        <div className="text-xs text-zinc-400">Clean Energy Deployed</div>
                        <div className="text-xs font-medium text-emerald-400">+34%</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">
                          <CountUpValue value={42.8} suffix="MW" />
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-1 flex justify-between items-center">
                        <div className="text-xs text-zinc-400">Communities Powered</div>
                        <div className="text-xs font-medium text-blue-400">+12%</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">
                          <CountUpValue value={187} suffix="" />
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-1 flex justify-between items-center">
                        <div className="text-xs text-zinc-400">Carbon Credits Issued</div>
                        <div className="text-xs font-medium text-purple-400">+56%</div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">
                          <CountUpValue value={105.3} suffix="k" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Right impact card - simplified and closer to the project card */}
            {isClient && (
              <motion.div 
                className="absolute -right-4 md:right-[-180px] top-1/2 -translate-y-1/2 hidden md:block z-20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                <motion.div 
                  className="backdrop-blur-sm p-5 rounded-lg border border-zinc-800 bg-zinc-900/90 w-48"
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: 'rgba(59, 130, 246, 0.5)'
                  }}
                >
                  <div className="mb-4">
                    <div className="rounded-full bg-blue-500/10 w-10 h-10 flex items-center justify-center mb-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white">Why Invest With Us</h3>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="rounded-full bg-emerald-500/10 w-5 h-5 flex items-center justify-center mt-0.5 mr-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12L10 17L20 7" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-zinc-300">Average 14% annual returns on green investments</span>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="rounded-full bg-emerald-500/10 w-5 h-5 flex items-center justify-center mt-0.5 mr-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12L10 17L20 7" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-zinc-300">100% transparent blockchain tracking</span>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="rounded-full bg-emerald-500/10 w-5 h-5 flex items-center justify-center mt-0.5 mr-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12L10 17L20 7" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-zinc-300">Direct impact on climate change reduction</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
            )}

            {/* Project card */}
            <div className="max-w-[300px] sm:max-w-sm mx-auto relative z-10">
              <div className="dark overflow-hidden bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm border border-zinc-800/60 hover:border-oga-green/50 rounded-lg transition-all shadow-md">
                <div className="aspect-[1.7/1] relative overflow-hidden rounded-t-lg">
                  <Image
                    src={featuredProject.image}
                    alt={featuredProject.name}
                    width={400}
                    height={240}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                  <div className="absolute top-1 right-1 flex gap-1">
                    <Badge
                      variant="outline"
                      className="bg-oga-green text-white border-oga-green/50 text-[10px] px-1 py-0"
                    >
                      {featuredProject.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-zinc-900/80 border-zinc-700/50 text-zinc-300 text-[10px] px-1 py-0"
                    >
                      {featuredProject.chain}
                    </Badge>
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
                    {featuredProject.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-zinc-900/80 text-[10px] border border-zinc-800/60 text-zinc-300 px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 space-y-3">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h2 className="text-lg font-bold text-zinc-200">{featuredProject.name}</h2>
                      <div className="flex gap-1">
                        {Object.entries(featuredProject.socials).map(([platform, url]) => (
                          <Link
                            key={platform}
                            href={url}
                            className="text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-800/50 hover:bg-oga-green/20 transition-all"
                          >
                            {platform === "website" && <Globe className="h-3 w-3" />}
                            {platform === "twitter" && <Twitter className="h-3 w-3" />}
                            {platform === "github" && <Github className="h-3 w-3" />}
                            {platform === "discord" && <IconBrandDiscord className="h-3 w-3" />}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-400 text-xs line-clamp-2">{featuredProject.description}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Funding Progress</span>
                      <span className="text-oga-green font-medium">{featuredProject.progress}%</span>
                    </div>
                    <div className="relative h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <Progress value={featuredProject.progress} className="h-full bg-gradient-to-r from-oga-green to-emerald-500 absolute inset-0" />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{(featuredProject.raised/1000).toLocaleString()}K USDT</span>
                      <span>{(featuredProject.target/1000).toLocaleString()}K USDT</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Target className="h-2.5 w-2.5" />
                        <span>Min Allocation</span>
                      </div>
                      <p className="font-medium text-zinc-300 text-xs">{featuredProject.minAllocation} USDT</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Rocket className="h-2.5 w-2.5" />
                        <span>Max Allocation</span>
                      </div>
                      <p className="font-medium text-zinc-300 text-xs">{featuredProject.maxAllocation} USDT</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Coins className="h-2.5 w-2.5" />
                        <span>Token Price</span>
                      </div>
                      <p className="font-medium text-zinc-300 text-xs">{featuredProject.tokenPrice} USDT</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <BarChart3 className="h-2.5 w-2.5" />
                        <span>Total Supply</span>
                      </div>
                      <p className="font-medium text-zinc-300 text-xs">{featuredProject.totalSupply}</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-zinc-500 border-t border-zinc-800/50 pt-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-2.5 w-2.5" />
                      <span>
                        {featuredProject.participants.toLocaleString()} participants
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{featuredProject.timeLeft} left</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Link href={`/projects/${featuredProject.id}`} className="w-full">
                      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg h-7 text-xs">
                        Details
                      </Button>
                    </Link>
                    <Link href={`/projects/${featuredProject.id}/invest`} className="w-full">
                      <Button className="w-full bg-gradient-to-r from-oga-green to-emerald-600 hover:from-emerald-600 hover:to-oga-green text-white border-0 rounded-lg h-7 text-xs shadow-sm">
                        Invest Now
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating particles - client-side only rendering */}
            {isClient && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: `${particle.width}px`,
                      height: `${particle.height}px`,
                      left: `${particle.left}%`,
                      top: `${particle.top}%`,
                      background: particle.color,
                    }}
                    animate={{
                      y: [0, particle.yMove],
                      x: [0, particle.xMove],
                      opacity: [0.7, 0.1, 0.7],
                    }}
                    transition={{
                      duration: particle.duration as number,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                      delay: particle.delay as number,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-2 mb-0">
            <Link href="/projects" className="inline-flex items-center text-oga-green hover:text-emerald-400 transition-colors text-xs">
              <span>View all projects</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// CountUpValue component - client-side animated counter
function CountUpValue({ value, suffix = '' }: { value: number, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  
  useEffect(() => {
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = easeOutQuad(progress) * value;
      
      if (progress >= 1) {
        clearInterval(counter);
        setDisplayValue(value);
      } else {
        setDisplayValue(Number(currentValue.toFixed(1)));
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [value]);
  
  return (
    <span>{displayValue}{suffix}</span>
  );
}

// Fix easeOutQuad function
function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}
