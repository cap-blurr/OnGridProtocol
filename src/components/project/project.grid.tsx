"use client";

import { ProjectCard } from "./project-card";
import { Search } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  "All",
  "Green",
  "Renewable",
  "Sustainable",
  "Infrastructure",
  "Cross-chain",
  "Web3",
];
const chains = ["All Chains", "Base", "Solana"];
const statuses = ["All", "Live", "Upcoming", "Ended"];

export function ProjectGrid() {
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedChain, setSelectedChain] = useState("All Chains");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === "All" || project.tags.includes(selectedCategory);
    const matchesChain =
      selectedChain === "All Chains" || project.chain === selectedChain;
    const matchesStatus =
      selectedStatus === "All" || project.status === selectedStatus;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesChain && matchesStatus && matchesSearch;
  });

  // const featuredProjects = projects.filter((p) => p.featured)
  // const trendingProjects = projects.filter((p) => p.trending)
  return (
    <>
      <div className="sticky top-0 z-10 bg-transparent backdrop-blur py-4 border-b mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative rounded-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9 rounded-full dark"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-[140px] border-oga-green rounded-full">
                <SelectValue placeholder="Chain" />
              </SelectTrigger>
              <SelectContent>
                {chains.map((chain) => (
                  <SelectItem key={chain} value={chain}>
                    {chain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px] border-oga-green rounded-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              </Button> */}
          </div>
        </div>

        <Tabs
          defaultValue="All"
          className="w-full dark"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <TabsList className="w-full mx-auto overflow-scroll  justify-start rounded-full">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-1 rounded-full md:flex-none data-[state=active]:bg-oga-green"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className={"mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching your criteria.</p>
          </div>
        )}
    </>
  );
}
