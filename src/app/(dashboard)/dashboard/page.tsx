"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  ArrowRight,
  Globe2,
  RefreshCw,
  Clock,
  Trees,
  BarChart3,
  History,
  Network,
  Wallet,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateProjectModal } from "@/components/project/create-project";
import GradientSection from "@/components/ui/gradient-section";
import Link from "next/link";
import DeviceOverview from "@/components/project/project-dashboard/device-overview";
import { IconSolarPanel } from "@tabler/icons-react";

const mockData = {
  base: {
    credits: 1250,
    value: 125000,
    projects: 3,
    change: 12.5,
    distributions: [
      {
        id: 1,
        project: "Amazon Rainforest Conservation",
        amount: 25000,
        status: "Pending",
        timestamp: "2024-02-21T10:00:00",
      },
      {
        id: 2,
        project: "Indonesian Mangrove Restoration",
        amount: 15000,
        status: "Completed",
        timestamp: "2024-02-20T15:30:00",
      },
    ],
  },
  solana: {
    credits: 3400,
    value: 340000,
    projects: 5,
    change: -2.3,
    distributions: [
      {
        id: 3,
        project: "African Wildlife Conservation",
        amount: 45000,
        status: "Completed",
        timestamp: "2024-02-19T09:15:00",
      },
    ],
  },
  // avalanche: {
  //   credits: 890,
  //   value: 89000,
  //   projects: 2,
  //   change: 5.7,
  //   distributions: [
  //     {
  //       id: 4,
  //       project: "Brazilian Forest Protection",
  //       amount: 30000,
  //       status: "Pending",
  //       timestamp: "2024-02-21T11:45:00",
  //     },
  //   ],
  // },
};

const projects = [
  {
    id: 1,
    name: "Amazon Rainforest Conservation",
    chain: "base",
    credits: 500,
    claimed: 375,
    total: 1000,
  },
  {
    id: 2,
    name: "Indonesian Mangrove Restoration",
    chain: "solana",
    credits: 300,
    claimed: 150,
    total: 500,
  },
  {
    id: 3,
    name: "African Wildlife Conservation",
    chain: "solana",
    credits: 800,
    claimed: 600,
    total: 1000,
  },
];

export default function DashboardPage() {
  const [isDistributing, setIsDistributing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleDistribute = async () => {
    setIsDistributing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDistributing(false);
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsClaiming(false);
  };

  //filter projects by chain
  const data = mockData["base" as keyof typeof mockData];

  return (
    <GradientSection>
      <div className="min-h-screen pt-0 dark">
        <div className="container mx-auto md:px-4 py-2">
          {/* Chain Selector and Stats */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-200 mb-4">
                  My Dashboard
                </h1>
                <p className="text-zinc-400">
                  Monitor your carbon credits and returns across chains
                </p>
              </div>
              <div className="mt-4">
                <CreateProjectModal />
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-oga-black backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Credits
                  </CardTitle>
                  <Leaf className="h-4 w-4 text-[#FFDC00]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.credits.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm ${
                        data.change >= 0 ? "text-[#FFDC00]" : "text-destructive"
                      }`}
                    >
                      {data.change >= 0 ? (
                        <ArrowUpRight className="inline h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="inline h-4 w-4" />
                      )}
                      {Math.abs(data.change)}%
                    </span>
                    <span className="text-zinc-500 text-sm">vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-oga-black backdrop-blur-sm  border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Value (USD)
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${data.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Based on current market rates
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-oga-black backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Projects
                  </CardTitle>
                  <Trees className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.projects}</div>
                  <p className="text-xs text-zinc-500">Across {2} chains</p>
                </CardContent>
              </Card>

              <Card className="bg-oga-black backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Network Status
                  </CardTitle>
                  <Network className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-zinc-500">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-1 text-zinc-400 mb-2">
                  <span>Carbon Credits</span>
                  <span className="rounded-full bg-zinc-800 w-5 h-5 inline-flex items-center justify-center text-xs">
                    ?
                  </span>
                </div>
                <div className="text-3xl font-bold text-white">1250</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-1 text-zinc-400 mb-2">
                  <span>Total Value (USD)</span>
                  <span className="rounded-full bg-zinc-800 w-5 h-5 inline-flex items-center justify-center text-xs">
                    ?
                  </span>
                </div>
                <div className="text-3xl font-bold text-white">$125,000</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-1 text-zinc-400 mb-2">
                  <span>Active Projects</span>
                  <span className="rounded-full bg-zinc-800 w-5 h-5 inline-flex items-center justify-center text-xs">
                    ?
                  </span>
                </div>
                <div className="text-3xl font-bold text-white">3</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-1 text-zinc-400 mb-2">
                  <span>Connected Devices</span>
                  <span className="rounded-full bg-zinc-800 w-5 h-5 inline-flex items-center justify-center text-xs">
                    ?
                  </span>
                </div>
                <div className="text-3xl font-bold text-white">5</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="">
            {/* <Tabs defaultValue="projects" className="space-y-4">
                <TabsList className="bg-transparent h-10 rounded-full">
                  <TabsTrigger
                    value="projects"
                    className="flex-1 rounded-full h-full data-[state=active]:bg-oga-green"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="distributions"
                    className="flex-1 rounded-full h-full data-[state=active]:bg-oga-green"
                  >
                    Distributions
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex-1 rounded-full h-full data-[state=active]:bg-oga-green"
                  >
                    History
                  </TabsTrigger>
                </TabsList>
                


           
              </Tabs> */}
            <Tabs defaultValue="investments" className=" mt-8">
              <TabsList className="bg-transparent h-10 pb-5 gap-12 w-full justify-start border-b border-white/20 rounded-none mb-4">
                <TabsTrigger
                  value="investments"
                  className="text-white text-sm sm:text-base pb-5 rounded-none data-[state=active]:text-oga-green data-[state=active]:border-b-2 data-[state=active]:border-b-oga-green data-[state=active]:mt-2 md:data-[state=active]:mt-1"
                >
                  Investments
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="text-white text-sm sm:text-base pb-5 rounded-none data-[state=active]:text-oga-green data-[state=active]:border-b-2 data-[state=active]:border-b-oga-green data-[state=active]:mt-2 md:data-[state=active]:mt-1"
                >
                  My Projects
                </TabsTrigger>
                <TabsTrigger
                  value="device"
                  className="text-white text-sm sm:text-base pb-5 rounded-none data-[state=active]:text-oga-green data-[state=active]:border-b-2 data-[state=active]:border-b-oga-green data-[state=active]:mt-2 md:data-[state=active]:mt-1"
                >
                  My Devices
                </TabsTrigger>
              </TabsList>

              <TabsContent value="investments">
                <Link href="/investments/balanced-growth">
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Balanced Growth</h3>
                            <p className="text-sm text-zinc-400">
                              Renewable Energy
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-sm text-zinc-400">Investment</p>
                            <p className="font-medium">$45,000</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-400">
                              Expected ROI
                            </p>
                            <p className="font-medium text-green-400">12.5%</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-400">Status</p>
                            <Badge className="bg-green-900/50 text-green-400 hover:bg-green-900 border-green-800">
                              Active
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-400">Date</p>
                            <p className="font-medium">Jan 15, 2023</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-800 hover:bg-zinc-800"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Wallet className="h-4 w-4 mr-2" />
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </TabsContent>

              <TabsContent value="projects">
                <Card className="bg-oga-black backdrop-blur-sm border-border/5">
                  <div className="space-y-4">
                    {projects
                      // .filter((project) => project.chain === selectedChain)
                      .map((project) => (
                        <div
                          key={project.id}
                          className="p-4 rounded-lg bg-zinc-900 border border-zinc-700"
                        >
                          <Link href="/projects/1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">
                                  {project.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                  <Globe2 className="h-4 w-4" />
                                  <span>{project.chain}</span>
                                </div>
                              </div>
                              <div className="flex flex-col-reverse md:flex-row gap-3  items-center">
                                <span className="text-white text-xs cursor-pointer hover:underline hover:text-oga-yellow-light">
                                  View Details{" "}
                                </span>
                                <Button
                                  className="rounded-full bg-oga-green hover:bg-oga-yellow hover:text-gray-800 text-white text-sm"
                                  onClick={handleDistribute}
                                  disabled={isDistributing}
                                >
                                  {isDistributing && (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Distribute Returns
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Progress</span>
                                <span className="text-green-500">
                                  {(
                                    (project.claimed / project.total) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={(project.claimed / project.total) * 100}
                                className="h-2 bg-background"
                              />
                              <div className="flex justify-between text-sm text-zinc-400">
                                <span>
                                  {project.claimed.toLocaleString()} claimed
                                </span>
                                <span>
                                  {project.total.toLocaleString()} total
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="device">
                <Link href="/devices/1">
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center">
                            <IconSolarPanel className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Solar Panel Array</h3>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-900/50 text-green-400 hover:bg-green-900 border-green-800">
                                Online
                              </Badge>
                              <span className="text-xs text-zinc-400">
                                ID: SP-2023-001
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-zinc-400">
                              Carbon Credits
                            </p>
                            <p className="font-medium">325</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-400">
                              Energy Generated
                            </p>
                            <p className="font-medium">12.5 MWh</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-400">Last Synced</p>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-green-400" />
                              <p className="font-medium text-sm">
                                2 minutes ago
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-800 hover:bg-zinc-800"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Monitor
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                {/* <DeviceOverview/> */}
              </TabsContent>
            </Tabs>
          </div>

          {/* <div className="space-y-6">
              <Card className="bg-oga-black backdrop-blur-sm border-border/5">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="rounded-full bg-gradient-to-r from-[#28a745] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#28a745] text-white"
                    onClick={handleDistribute}
                    disabled={isDistributing}
                  >
                    {isDistributing && (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Distribute All Returns
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border/5 hover:bg-accent"
                    onClick={handleClaim}
                    disabled={isClaiming}
                  >
                    {isClaiming && (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Claim All Available
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-oga-black backdrop-blur-sm border-border/5">
                <CardHeader>
                  <CardTitle>Network Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Gas Price</span>
                    <span className="font-medium">32 Gwei</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Block Height</span>
                    <span className="font-medium">18,245,123</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Network Load</span>
                    <span className="font-medium text-[#FFDC00]">Low</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-oga-black backdrop-blur-sm border-border/5">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.distributions.slice(0, 3).map((dist, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            dist.status === "Completed"
                              ? "bg-[#FFDC00]"
                              : "bg-[#28a745]"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{dist.project}</p>
                          <p className="text-xs text-zinc-400">
                            {new Date(dist.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert className="bg-[#28a745]/20 border border-[#28a745]/50">
                <AlertDescription className="text-[#28a745]">
                  All network operations are running smoothly
                </AlertDescription>
              </Alert>
            </div> */}
        </div>
      </div>
    </GradientSection>
  );
}
