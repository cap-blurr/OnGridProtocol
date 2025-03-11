"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Share2,
} from "lucide-react";
import GradientSection from "@/components/ui/gradient-section";
import Image from "next/image";
import ProjectFinancing from "@/components/project/project-dashboard/project-financing";
import DeviceOverview from "@/components/project/project-dashboard/device-overview";

const project = {
  id: 1,
  name: "Green DeFi",
  description:
    "Revolutionary sustainable DeFi protocol with advanced yield farming mechanisms and eco-friendly blockchain solutions",
  image: "/placeholder.svg?height=400&width=1200",
  status: "Live",
  participants: 1234,
  timeLeft: "2 days",
  raised: 850000,
  target: 1000000,
  progress: 85,
  tokenPrice: 0.85,
  priceChange: 5.67,
  volume24h: 1234567,
  marketCap: 8500000,
  totalSupply: "100,000,000",
  circulatingSupply: "45,000,000",
  minAllocation: 50,
  maxAllocation: 5000,
  access: "Public",
  chain: "Ethereum",
  socials: {
    website: "https://example.com",
    twitter: "https://twitter.com",
    github: "https://github.com",
    discord: "https://discord.com",
  },
  tags: ["DeFi", "Yield Farming", "Green"],
  tokenomics: {
    distribution: [
      { category: "Public Sale", percentage: 30 },
      { category: "Team", percentage: 20 },
      { category: "Treasury", percentage: 25 },
      { category: "Ecosystem", percentage: 25 },
    ],
  },
  team: [
    {
      name: "John Doe",
      role: "CEO",
      image:
        "https://images.unsplash.com/vector-1738293681271-4a36c9ae10c6?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Jane Smith",
      role: "CTO",
      image:
        "https://images.unsplash.com/vector-1738442077422-5cad79f1c10b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  roadmap: [
    {
      phase: "Phase 1",
      title: "Launch & Initial Development",
      status: "completed" as const,
      items: ["Platform Launch", "Community Building", "Smart Contract Audit"],
    },
    {
      phase: "Phase 2",
      title: "Expansion",
      status: "in-progress" as const,
      items: [
        "Feature Development",
        "Partnership Programs",
        "Marketing Campaign",
      ],
    },
    {
      phase: "Phase 3",
      title: "Scaling",
      status: "upcoming" as const,
      items: [
        "Cross-chain Integration",
        "Mobile App",
        "Governance Implementation",
      ],
    },
  ],
};

export default function ProjectDashboard() {
  return (
    <>
      <GradientSection>
        <div className="min-h-screen pt-24 dark">
          <div className="bg-transparent text-foreground">
            <div className="relative ">
              <div className="absolute inset-0 bg-gradient-to-r opacity-15 from-[#28a745]/20 to-[#2E7D32]/20" />
              <div className="absolute rounded-xl inset-0 bg-[url('https://images.unsplash.com/photo-1523774294084-94691d7bb289?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] opacity-90" />

              <div className="container mx-auto px-6 py-4 relative">
                <div className="flex justify-end items-center py-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:text-white hover:border-white/40"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:text-white hover:border-white/40"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  </div>
                </div>

                <div className="py-12">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Image
                          src="https://images.unsplash.com/vector-1739203295425-aad07a496d27?q=80&w=2748&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          alt={project.name}
                          width={500}
                          height={500}
                          className="w-12 h-12 rounded-full ring-2 ring-[#28a745]/50"
                        />
                        <div>
                          <h1 className="text-3xl font-bold text-white mb-1">
                            {project.name}
                          </h1>
                          <div className="flex gap-2">
                            {project.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="border-white/20 text-white"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-white">
                          ${project.tokenPrice}
                        </span>
                        <Badge
                          variant="outline"
                          className={`${
                            project.priceChange >= 0
                              ? "border-[#28a745] text-[#28a745]"
                              : "border-red-500 text-red-500"
                          }`}
                        >
                          {project.priceChange >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(project.priceChange)}%
                        </Badge>
                      </div>
                      <span className="text-sm text-white/60">
                        24h Volume: ${project.volume24h.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className=" mt-8">
              <TabsList className="bg-transparent h-10 pb-5 gap-12 w-full justify-start border-b border-white/20">
                <TabsTrigger
                  value="overview"
                  className="text-white text-xl pb-5 rounded-none data-[state=active]:text-oga-green data-[state=active]:border-b data-[state=active]:border-b-oga-green"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="device"
                  className="text-white text-xl pb-5 rounded-none data-[state=active]:text-oga-green data-[state=active]:border-b data-[state=active]:border-b-oga-green"
                >
                  Device
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ProjectFinancing project={project} />
              </TabsContent>

              <TabsContent value="device">
                <DeviceOverview/>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </GradientSection>
    </>
  );
}
