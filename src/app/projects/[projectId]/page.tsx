"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Globe,
  Twitter,
  Github,
  DiscIcon as Discord,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CircleDollarSign,
  Coins,
  Lock,
  Share2,
} from "lucide-react";
import Link from "next/link";
import GradientSection from "@/components/ui/gradient-section";
import Image from "next/image";

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
      image: "https://images.unsplash.com/vector-1738293681271-4a36c9ae10c6?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Jane Smith",
      role: "CTO",
      image: "https://images.unsplash.com/vector-1738442077422-5cad79f1c10b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  roadmap: [
    {
      phase: "Phase 1",
      title: "Launch & Initial Development",
      status: "completed",
      items: ["Platform Launch", "Community Building", "Smart Contract Audit"],
    },
    {
      phase: "Phase 2",
      title: "Expansion",
      status: "in-progress",
      items: [
        "Feature Development",
        "Partnership Programs",
        "Marketing Campaign",
      ],
    },
    {
      phase: "Phase 3",
      title: "Scaling",
      status: "upcoming",
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
      <div className="min-h-screen md:pt-24 bg-transparent dark">
        <div className="bg-background text-foreground">
          {/* Hero Section */}
          <div className="relative bg-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-[#28a745]/20 to-[#2E7D32]/20" />
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-10" />

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

          <div className="container mx-auto px-6 py-8">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CircleDollarSign className="h-4 w-4" />
                      Market Cap
                    </div>
                    <TrendingUp className="h-4 w-4 text-[#28a745]" />
                  </div>
                  <div className="text-2xl font-bold">
                    ${project.marketCap.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-[#28a745]">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+2.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Coins className="h-4 w-4" />
                      Total Supply
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {project.totalSupply}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Circulating: {project.circulatingSupply}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Participants
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {project.participants.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Active Contributors
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wallet className="h-4 w-4" />
                      Raised Amount
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    ${project.raised.toLocaleString()}
                  </div>
                  <Progress value={project.progress} className="h-1 mt-2" />
                  <div className="text-sm text-muted-foreground mt-1">
                    {project.progress}% of ${project.target.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="w-full rounded-full">
                    <TabsTrigger value="overview" className="flex-1 rounded-full  data-[state=active]:bg-oga-green">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="tokenomics" className="flex-1 rounded-full  data-[state=active]:bg-oga-green">
                      Tokenomics
                    </TabsTrigger>
                    <TabsTrigger value="roadmap" className="flex-1 rounded-full data-[state=active]:bg-oga-green">
                      Roadmap
                    </TabsTrigger>
                    <TabsTrigger value="team" className="flex-1 rounded-full  data-[state=active]:bg-oga-green">
                      Team
                    </TabsTrigger>
                   
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium commodi nam enim blanditiis doloremque placeat rem error
                        </p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Project Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">
                              Token Price
                            </span>
                            <span className="font-medium">
                              {project.tokenPrice} USDT
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">
                              Total Supply
                            </span>
                            <span className="font-medium">
                              {project.totalSupply}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">
                              Access
                            </span>
                            <span className="font-medium">
                              {project.access}
                            </span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Chain</span>
                            <span className="font-medium">{project.chain}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Pool Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">
                              Min Allocation
                            </span>
                            <span className="font-medium">
                              {project.minAllocation} USDT
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">
                              Max Allocation
                            </span>
                            <span className="font-medium">
                              {project.maxAllocation} USDT
                            </span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">
                              Participants
                            </span>
                            <span className="font-medium">
                              {project.participants.toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="tokenomics">
                    <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                      <CardContent className="pt-6 space-y-6">
                        {project.tokenomics.distribution.map((item) => (
                          <div key={item.category} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {item.category}
                              </span>
                              <span className="font-medium">
                                {item.percentage}%
                              </span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="team">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.team.map((member) => (
                        <Card
                          key={member.name}
                          className="bg-card/50 backdrop-blur-sm border-white/20"
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                              <Image
                                src={member.image}
                                alt={member.name}
                                className="h-16 w-16 rounded-full ring-2 ring-[#28a745]/20"
                              />
                              <div>
                                <h3 className="font-semibold">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="roadmap">
                    <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                      <CardContent className="pt-6">
                        <div className="space-y-8">
                          {project.roadmap.map((phase) => (
                            <div
                              key={phase.phase}
                              className="relative pl-8 pb-8 last:pb-0"
                            >
                              <div className="absolute left-0 top-0 h-full w-px bg-muted">
                                <div
                                  className={`absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full
                                  ${
                                    phase.status === "completed"
                                      ? "bg-[#28a745]"
                                      : phase.status === "in-progress"
                                      ? "bg-[#FFDC00]"
                                      : "bg-muted"
                                  }`}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">
                                  {phase.phase}: {phase.title}
                                </h3>
                                <ul className="space-y-2">
                                  {phase.items.map((item) => (
                                    <li
                                      key={item}
                                      className="flex items-center text-sm text-muted-foreground"
                                    >
                                      <ChevronRight className="h-4 w-4 mr-2 text-[#28a745]" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Card className="bg-card/50 backdrop-blur-sm border-white/20 sticky top-6">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Investment details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between py-2 border-b border-white/20">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-medium">
                              ${project.tokenPrice} USDT
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/20">
                            <span className="text-muted-foreground">
                              Min Allocation
                            </span>
                            <span className="font-medium">
                              {project.minAllocation} USDT
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/20">
                            <span className="text-muted-foreground">
                              Max Allocation
                            </span>
                            <span className="font-medium">
                              {project.maxAllocation} USDT
                            </span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">
                              Access
                            </span>
                            <div className="flex items-center gap-1">
                              <Lock className="h-4 w-4" />
                              <span className="font-medium">
                                {project.access}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-[#28a745] font-medium">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {project.raised.toLocaleString()} USDT
                          </span>
                          <span className="text-muted-foreground">
                            {project.target.toLocaleString()} USDT
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full bg-oga-green text-white hover:bg-oga-yellow hover:text-gray-700">
                          Invest
                        </Button>
                        <div className="flex items-center justify-center gap-4">
                          {Object.entries(project.socials).map(
                            ([platform, url]) => (
                              <Link
                                key={platform}
                                href={url}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {platform === "website" && (
                                  <Globe className="h-5 w-5" />
                                )}
                                {platform === "twitter" && (
                                  <Twitter className="h-5 w-5" />
                                )}
                                {platform === "github" && (
                                  <Github className="h-5 w-5" />
                                )}
                                {platform === "discord" && (
                                  <Discord className="h-5 w-5" />
                                )}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      </GradientSection>
    </>
  );
}
