"use client";

import { ProjectCard } from "./project-card";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

// Sample project data with enhanced details
const projects = [
  {
    id: 1,
    name: "Green DeFi",
    description:
      "Revolutionary sustainable DeFi protocol with advanced yield farming mechanisms and eco-friendly blockchain solutions",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop",
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
  },
  {
    id: 2,
    name: "EcoChain",
    description:
      "Next-generation NFT trading platform with cross-chain compatibility and zero-fee trading for selected collections",
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1000&auto=format&fit=crop",
    status: "Upcoming",
    participants: 892,
    timeLeft: "5 days",
    raised: 425000,
    target: 1500000,
    progress: 28,
    tokenPrice: 1.2,
    totalSupply: "50,000,000",
    minAllocation: 100,
    maxAllocation: 10000,
    access: "Whitelist",
    chain: "Solana",
    socials: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
      discord: "https://discord.com",
    },
    tags: ["Green", "Energy", "Cross-chain"],
  },

  {
    id: 3,
    name: "WindLedger",
    description:
      "Automated yield farming protocol offering optimized returns with multi-chain liquidity aggregation.",
    image:
      "https://images.unsplash.com/photo-1523774294084-94691d7bb289?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    status: "Live",
    participants: 1250,
    timeLeft: "12 days",
    raised: 780000,
    target: 2000000,
    progress: 39,
    tokenPrice: 0.85,
    totalSupply: "100,000,000",
    minAllocation: 50,
    maxAllocation: 5000,
    access: "Public",
    chain: "Solana",
    socials: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
      discord: "https://discord.com",
    },
    tags: ["Green", "Renewable", "Sustainable"],
  },
];

const categories = [
  { id: "All", icon: "🌍", description: "All available projects" },
  { id: "Green", icon: "🌱", description: "Environmentally friendly initiatives" },
  { id: "Renewable", icon: "♻️", description: "Renewable energy projects" },
  { id: "Sustainable", icon: "🌿", description: "Long-term sustainable solutions" },
  { id: "Infrastructure", icon: "🏗️", description: "Green infrastructure development" },
  { id: "Cross-chain", icon: "⛓️", description: "Projects spanning multiple blockchains" },
  { id: "Web3", icon: "🌐", description: "Web3 sustainability innovation" },
];

export function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-r from-zinc-950/70 via-zinc-900/70 to-zinc-950/70 backdrop-blur-md rounded-2xl p-6 border border-zinc-800/50 shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-8/12 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search for carbon credit projects..."
              className="pl-10 h-12 rounded-xl bg-zinc-900/60 border-zinc-800 focus:border-oga-green/50 focus:ring-1 focus:ring-oga-green/30 transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="md:w-auto h-12 flex items-center gap-2 rounded-xl bg-zinc-900/60 text-zinc-300 border-zinc-800 hover:bg-oga-green/10 hover:text-white hover:border-oga-green/50 transition-all shadow-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Advanced Filters</span>
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Categories</h3>
          <div className="overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex gap-3">
              {categories.map((category) => (
                <TooltipProvider key={category.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "flex items-center gap-2 min-w-28 px-4 py-3 rounded-xl transition-all",
                          selectedCategory === category.id
                            ? "bg-gradient-to-r from-[#28a745] to-[#2E7D32] text-white shadow-md shadow-green-900/20"
                            : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-300 border border-zinc-800 hover:border-oga-green/30"
                        )}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.id}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-zinc-900 border-zinc-800">
                      <p>{category.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/50 mb-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Status</label>
              <div className="flex gap-2">
                <Badge className="bg-oga-green cursor-pointer">Live</Badge>
                <Badge className="bg-zinc-700 cursor-pointer">Upcoming</Badge>
                <Badge className="bg-zinc-700 cursor-pointer">Completed</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Network</label>
              <div className="flex gap-2">
                <Badge className="bg-zinc-700 cursor-pointer">Base</Badge>
                <Badge className="bg-zinc-700 cursor-pointer">Solana</Badge>
                <Badge className="bg-zinc-700 cursor-pointer">All</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Sort By</label>
              <div className="flex gap-2">
                <Badge className="bg-zinc-700 cursor-pointer">Newest</Badge>
                <Badge className="bg-zinc-700 cursor-pointer">Progress</Badge>
                <Badge className="bg-zinc-700 cursor-pointer">Target</Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-zinc-900/40 rounded-xl border border-zinc-800/50">
          <div className="mx-auto w-16 h-16 rounded-full bg-zinc-800/60 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-zinc-300 mb-2">No projects found</h3>
          <p className="text-zinc-500 max-w-md mx-auto">
            We couldn't find any projects matching your search criteria. Try adjusting your filters or check back later.
          </p>
        </div>
      )}

      <div className="my-20 text-center space-y-6 bg-gradient-to-r from-zinc-900/60 via-zinc-800/40 to-zinc-900/60 backdrop-blur-sm rounded-2xl p-10 border border-zinc-800/50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-oga-green/20 to-oga-green/30 flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl">🌱</span>
        </div>
        <h3 className="text-2xl font-semibold text-zinc-200">Looking for more carbon credit projects?</h3>
        <p className="text-zinc-400 max-w-xl mx-auto">
          New projects are added regularly. Check back often or join our waitlist to be notified when new opportunities become available.
        </p>
        <Button className="mt-4 px-6 py-6 rounded-xl bg-gradient-to-r from-oga-green to-emerald-600 text-white hover:from-emerald-600 hover:to-oga-green border-0 shadow-md shadow-green-900/20">
          Join Our Waitlist
        </Button>
      </div>
    </div>
  );
}
