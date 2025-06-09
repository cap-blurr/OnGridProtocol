"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  CreditCard,
  LineChart,
  PieChart,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useAccount } from "wagmi";
import LoadingScreen from "@/components/ui/loading-screen";
import { DashboardTabs } from "@/components/ui/custom-tabs";
import PoolInvestmentCard from "@/components/project/PoolInvestmentCard";
import DirectProjectInvestmentList from "@/components/project/DirectProjectInvestmentList";
import { useDashboardData } from "@/hooks/contracts/useDashboardData";

// Temporary mock data for stable dashboard display
const mockData = {
  totalInvested: 385000,
  totalProjects: 5,
  monthlyGrowth: 8.5,
  averageROI: 12.7,
  activePools: 3,
  recentTransactions: [
    {
      id: "1",
      projectName: "California Solar Farm",
      amount: "50000",
      type: "investment" as const,
      timestamp: Date.now() - 86400000 * 5,
      status: "completed" as const,
    },
    {
      id: "2",
      projectName: "Green Energy Pool A",
      amount: "25000",
      type: "investment" as const,
      timestamp: Date.now() - 86400000 * 10,
      status: "completed" as const,
    },
    {
      id: "3",
      projectName: "Texas Wind Farm",
      amount: "35000",
      type: "investment" as const,
      timestamp: Date.now() - 86400000 * 15,
      status: "completed" as const,
    },
  ],
  poolInvestments: {
    totalValue: "150000",
    poolCount: 2,
  },
  projectInvestments: {
    totalValue: 235000,
    projectCount: 3,
  },
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("investments");
  
  // Use real contract data in background (for future integration)
  const dashboardData = useDashboardData('investor');
  
  // For now, use mock data for stable display
  const metrics = mockData;
  const transactionHistory = { transactions: mockData.recentTransactions };

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative">
      {/* Enhanced subtle grid background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Enhanced background accents using the primary gradient */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-[#4CAF50]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-[#4CAF50]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      
      <div className="relative space-y-8 pb-12">
        <div className="mb-12 relative pl-8">
          {/* Enhanced accent line with gradient */}
          <div className="absolute -left-4 top-0 h-full w-[2px] bg-gradient-to-b from-[#4CAF50]/60 to-[#4CAF50]/0" />
          
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-[#4CAF50] mb-3 relative group">
            Investor Dashboard
            <div className="absolute -left-8 top-1/2 w-4 h-[2px] bg-gradient-to-r from-[#4CAF50] to-[#4CAF50]/0 group-hover:w-6 transition-all duration-300" />
          </span>
          
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Monitor your investments and carbon credits in real-time
          </p>
        </div>
        
        {/* Wallet Connection Notice with enhanced styling */}
        {!isConnected && (
          <Alert className="mb-8 bg-[#4CAF50]/5 border border-[#4CAF50]/20 text-[#4CAF50] backdrop-blur-sm">
            <Wallet className="h-4 w-4" />
            <AlertDescription className="text-[#4CAF50]/90">
              Connect your wallet to access full investment features and make transactions.
            </AlertDescription>
          </Alert>
        )}
        
        <DashboardTabs
          tabs={[
            { value: "investments", label: "Investments" },
          ]}
          activeTab={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsContent value="investments" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Enhanced Investment Overview Card */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 transition-all duration-300 cursor-pointer overflow-hidden group">
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-white">
                    Total Investments
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-[#4CAF50] group-hover:text-[#4CAF50]/80 transition-colors" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white group-hover:text-[#4CAF50]/90 transition-colors">
                    ${(metrics?.totalInvested || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-3 w-3 text-[#4CAF50] mr-1" />
                    <span className="text-xs text-[#4CAF50]">{metrics?.monthlyGrowth || 0}% monthly growth</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 transition-colors cursor-pointer overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Average ROI
                  </CardTitle>
                  <LineChart className="h-4 w-4 text-[#4CAF50]" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    {metrics?.averageROI || 0}%
                  </div>
                  <p className="text-xs text-zinc-400">
                    Annual percentage return
                  </p>
                </CardContent>
              </Card>

              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 transition-colors cursor-pointer overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Active Pools
                  </CardTitle>
                  <Network className="h-4 w-4 text-[#4CAF50]" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    {metrics?.activePools || 0}
                  </div>
                  <p className="text-xs text-zinc-400">
                    With varied APY rates
                  </p>
                </CardContent>
              </Card>

              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 transition-colors cursor-pointer overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Total Projects
                  </CardTitle>
                  <Trees className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    {metrics?.totalProjects || 0}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Direct and pooled investments
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Recent Transactions Card */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 overflow-hidden group hover:border-[#4CAF50]/30 transition-all duration-300">
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <History className="h-5 w-5 text-[#4CAF50]" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription className="text-zinc-400 mt-2">
                    Your latest investment activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="space-y-5">
                    {transactionHistory?.transactions?.length > 0 ? (
                      transactionHistory.transactions.slice(0, 3).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between border-b border-[#4CAF50]/10 pb-4 group/item hover:border-[#4CAF50]/20 transition-colors">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-white group-hover/item:text-[#4CAF50]/90 transition-colors">{tx.projectName}</span>
                            <span className="text-sm text-zinc-500">{new Date(tx.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-medium text-[#4CAF50]">${parseFloat(tx.amount).toLocaleString()}</span>
                            <Badge variant="outline" className="text-xs border-[#4CAF50]/20 bg-[#4CAF50]/5 text-[#4CAF50] px-2">
                              {tx.type}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-zinc-400">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No transactions yet</p>
                        <p className="text-sm">Start investing to see your activity here</p>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" className="w-full justify-center text-zinc-400 hover:text-[#4CAF50] hover:bg-[#4CAF50]/5 group" asChild>
                    <Link href="/dashboard/investments/current" className="flex items-center">
                      View all transactions <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Enhanced Investment Distribution Card */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5 text-[#4CAF50]" />
                    Investment Distribution
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Allocation of your investments across projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    {metrics?.poolInvestments?.poolCount > 0 || metrics?.projectInvestments?.projectCount > 0 ? (
                      <>
                        {/* Pool Investments */}
                        {metrics.poolInvestments.poolCount > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Pool Investments</span>
                              <span className="text-zinc-300">
                                {Math.round((Number(metrics.poolInvestments.totalValue) / metrics.totalInvested) * 100) || 0}%
                              </span>
                            </div>
                            <Progress 
                              value={(Number(metrics.poolInvestments.totalValue) / metrics.totalInvested) * 100 || 0} 
                              className="h-1.5 bg-zinc-800/70" 
                              indicatorClassName="bg-[#4CAF50]" 
                            />
                          </div>
                        )}
                        
                        {/* Direct Project Investments */}
                        {metrics.projectInvestments.projectCount > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Direct Projects</span>
                              <span className="text-zinc-300">
                                {Math.round((metrics.projectInvestments.totalValue / metrics.totalInvested) * 100) || 0}%
                              </span>
                            </div>
                            <Progress 
                              value={(metrics.projectInvestments.totalValue / metrics.totalInvested) * 100 || 0} 
                              className="h-1.5 bg-zinc-800/70" 
                              indicatorClassName="bg-[#4CAF50]" 
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-zinc-400">
                        <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No investments yet</p>
                        <p className="text-sm">Start investing to see distribution</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-[#4CAF50]" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Button 
                  variant="outline" 
                  className="border-zinc-800 bg-zinc-900/50 text-zinc-100 hover:bg-gradient-to-r hover:from-[#3D9970] hover:to-[#4CAF50] hover:text-white hover:border-transparent transition-all duration-300 h-12 text-base" 
                  asChild
                >
                  <Link href="/dashboard/investments/opportunities">
                    Browse Investment Opportunities
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-zinc-800 bg-zinc-900/50 text-zinc-100 hover:bg-gradient-to-r hover:from-[#3D9970] hover:to-[#4CAF50] hover:text-white hover:border-transparent transition-all duration-300 h-12 text-base" 
                  asChild
                >
                  <Link href="/dashboard/investments/pools">
                    Explore Investment Pools
                  </Link>
                </Button>
              </div>
            </div>

            {/* Enhanced dividers with new color scheme */}
            <div className="relative my-12">
              <hr className="border-[#4CAF50]/10" />
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-background">
                <Trees className="h-6 w-6 text-[#4CAF50]" />
              </div>
            </div>

            {/* Pool Investment Section */}
            <PoolInvestmentCard />

            {/* Enhanced divider */}
            <div className="relative my-12">
              <hr className="border-[#4CAF50]/10" />
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-background">
                <Network className="h-6 w-6 text-[#4CAF50]" />
              </div>
            </div>

            {/* Direct Project Investment Section */}
            <DirectProjectInvestmentList />

          </TabsContent>
        </DashboardTabs>
      </div>
    </div>
  );
}