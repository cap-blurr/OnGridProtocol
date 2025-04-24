"use client";
import { ProjectGrid } from "@/components/project/project.grid";
import GradientSection from "@/components/ui/gradient-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Projects() {
  return (
    <GradientSection primaryColor="rgba(40, 167, 69, 0.2)" secondaryColor="rgba(34, 197, 94, 0.15)">
      <main className="relative pt-32 md:pt-40 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/projects/grid-pattern.svg')] bg-center opacity-10" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 mb-16 md:mb-24">
            <div className="flex justify-center mb-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-oga-green/20 to-oga-green/10 backdrop-blur-sm border border-oga-green/20">
                <span className="text-xs font-medium text-oga-green">Carbon Credit Marketplace</span>
              </div>
            </div>
            
            <h1 className="text-center text-4xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                Carbon Credit Projects
              </span>
            </h1>
            
            <p className="mx-auto max-w-[800px] mt-4 text-center text-base md:text-xl text-gray-400/90">
              Explore and support high-impact carbon credit projects across
              multiple blockchain networks. Contribute to global
              sustainability efforts while benefiting from eco-friendly
              investments.
            </p>
            
            <div className="flex justify-center mt-6">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-oga-green"></div>
                  <span className="text-sm text-gray-400">Verified Projects</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-gray-400">Sustainable Impact</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-gray-400">Blockchain Transparency</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-oga-green/20 rounded-full filter blur-[100px]" />
            <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-[100px]" />
            <ProjectGrid />
          </div>
          
          {/* Bottom CTA Section */}
          <div className="mt-32 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 backdrop-blur-md -z-10 rounded-3xl"></div>
            <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-oga-green/10 rounded-full filter blur-[120px] -z-10"></div>
            
            <div className="grid md:grid-cols-2 gap-12 p-8 md:p-12 rounded-3xl border border-zinc-800/50">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-oga-green/20 border border-oga-green/30">
                  <span className="text-xs font-medium text-oga-green">For Project Creators</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Launch your carbon credit project on OnGrid
                </h2>
                <p className="text-zinc-400">
                  Our platform provides the tools, audience, and blockchain infrastructure you need to launch and manage successful carbon credit projects. Join the growing ecosystem of sustainable initiatives.
                </p>
                <div className="pt-4">
                  <Link href="/">
                    <Button className="bg-white text-zinc-900 hover:bg-zinc-200 rounded-xl h-12 px-6 shadow-lg">
                      Submit Your Project
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-6 md:border-l border-zinc-800/70 md:pl-12 flex flex-col justify-center">
                <h3 className="text-xl font-medium text-white">Why launch with OnGrid?</h3>
                <ul className="space-y-4">
                  {[
                    "Access to a global network of environmentally conscious investors",
                    "Transparent blockchain-based verification and tracking",
                    "Comprehensive tools for project management and reporting",
                    "Marketing support to maximize your project's visibility"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 rounded-full bg-oga-green/20 p-1">
                        <svg className="h-4 w-4 text-oga-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </GradientSection>
  );
}
