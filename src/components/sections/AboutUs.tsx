'use client';

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wallet, Sun, LucideArrowUpRight, Bird } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useUserType } from "@/providers/userType";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  const { isConnected } = useAccount();
  const router = useRouter();
  const { userType } = useUserType();
  
  const handleExploreProjects = () => {
    if (isConnected) {
      // If user is connected but has no type, they'll be shown the account type modal
      if (!userType) {
        router.push('/');
        return;
      }
      
      // Redirect to appropriate dashboard based on user type
      if (userType === 'developer') {
        router.push('/developer-dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      // This will trigger the ConnectButton modal in the header
      document.getElementById('connect-wallet-btn')?.click();
    }
  };

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
          <>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-20 mb-20">
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
                  <p className="text-zinc-400 mb-8">
                    A world where access to reliable, affordable clean energy is universal, driving economic growth while significantly reducing carbon emissions.
                  </p>
                </div>
              </motion.div>

              {/* Right column with Featured Projects */}
              <motion.div 
                className="lg:col-span-7 lg:pl-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mb-8">
                  <div className="inline-block mb-6 relative">
                    <span className="inline-block relative z-10 text-white font-semibold text-lg">Featured Projects</span>
                    <div className="absolute bottom-0 left-0 h-3 w-full bg-emerald-900/30 -z-0" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Featured Project Card 1 */}
                    <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                      
                      <div className="relative h-40 overflow-hidden">
                        <Image 
                          src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80" 
                          alt="Solar Farm California" 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <Badge variant="outline" className="absolute top-2 right-2 bg-emerald-900/30 text-emerald-300 border-emerald-700">
                          Featured
                        </Badge>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-semibold text-white">Solar Farm California</h4>
                          <Sun className="h-5 w-5 text-emerald-500" />
                        </div>
                        
                        <p className="text-zinc-400 text-sm mb-4">Large-scale solar installation providing clean energy to over 10,000 homes in Southern California.</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">ROI</span>
                            <span className="text-sm text-emerald-400 font-medium">12.5%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Raised</span>
                            <span className="text-sm text-white font-medium">$450,000</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Target</span>
                            <span className="text-sm text-white font-medium">$500,000</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full border border-emerald-800/50 text-emerald-400 hover:bg-emerald-700 hover:text-white hover:border-emerald-500 transition-colors"
                          onClick={handleExploreProjects}
                        >
                          View Project <LucideArrowUpRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                    
                    {/* Featured Project Card 2 */}
                    <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                      
                      <div className="relative h-40 overflow-hidden">
                        <Image 
                          src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80" 
                          alt="Wind Farm Texas" 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <Badge variant="outline" className="absolute top-2 right-2 bg-emerald-900/30 text-emerald-300 border-emerald-700">
                          High Yield
                        </Badge>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-semibold text-white">Wind Farm Texas</h4>
                          <Bird className="h-5 w-5 text-emerald-500" />
                        </div>
                        
                        <p className="text-zinc-400 text-sm mb-4">State-of-the-art wind turbine installation generating sustainable energy in West Texas.</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">ROI</span>
                            <span className="text-sm text-emerald-400 font-medium">14.8%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Raised</span>
                            <span className="text-sm text-white font-medium">$320,000</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Target</span>
                            <span className="text-sm text-white font-medium">$750,000</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full border border-emerald-800/50 text-emerald-400 hover:bg-emerald-700 hover:text-white hover:border-emerald-500 transition-colors"
                          onClick={handleExploreProjects}
                        >
                          View Project <LucideArrowUpRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Why Ongrid Protocol Section */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="inline-block mb-8 relative">
                <span className="inline-block relative z-10 text-white font-semibold text-xl">Why Ongrid Protocol?</span>
                <div className="absolute bottom-0 left-0 h-3 w-full bg-emerald-900/30 -z-0" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black/20 border border-emerald-800/30 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-900/20 rounded-full"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-900/50 border border-emerald-600/50">
                    <span className="text-sm font-bold text-emerald-400">01</span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Direct Impact</h4>
                    <p className="text-zinc-400 text-sm">
                      Your investment fuels real change—providing electricity to homes, schools, and businesses while cutting CO₂ emissions.
                    </p>
                  </div>
                </div>
                
                <div className="bg-black/20 border border-emerald-800/30 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-900/20 rounded-full"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-900/50 border border-emerald-600/50">
                    <span className="text-sm font-bold text-emerald-400">02</span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Trust & Transparency</h4>
                    <p className="text-zinc-400 text-sm">
                      Blockchain-powered tracking ensures security and accountability in all transactions.
                    </p>
                  </div>
                </div>
                
                <div className="bg-black/20 border border-emerald-800/30 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-emerald-900/20 rounded-full"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-900/50 border border-emerald-600/50">
                    <span className="text-sm font-bold text-emerald-400">03</span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold text-white mb-3">Sustainable Growth</h4>
                    <p className="text-zinc-400 text-sm">
                      Empowering communities with clean energy drives long-term economic development.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-10">
                <Link
                  href="#projects"
                  className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Sun size={16} className="mr-1" />
                  View Available Projects
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
