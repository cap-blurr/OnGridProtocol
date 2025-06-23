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
import { useEnhancedDashboardData } from "@/hooks/contracts/useEnhancedDashboardData";
import { useUserTransactionHistory } from "@/hooks/contracts/useDashboardData";
import { TransactionList } from "@/components/dashboard/TransactionDetails";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("investments");
  
  // Use simplified dashboard data
  const { 
    metrics, 
    poolInvestments, 
    isLoading: isLoadingDashboard,
    hasInvestments 
  } = useEnhancedDashboardData();

  // Get transaction history
  const { recentTransactions } = useUserTransactionHistory();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <LoadingScreen />;
  }

  // Show loading screen briefly
  if (isLoadingDashboard) {
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
                    Pool investments
                  </p>
                </CardContent>
              </Card>

              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 transition-colors cursor-pointer overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Projects
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-[#4CAF50]" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    {metrics?.totalProjects || 0}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Direct investments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Investment Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Allocation */}
              <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 hover:border-[#4CAF50]/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-[#4CAF50]" />
                    Portfolio Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hasInvestments ? (
                      <>
                        {/* Pool Investments */}
                        {metrics.activePools > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Pool Investments</span>
                              <span className="text-zinc-300">
                                {Math.round((Number(poolInvestments.totalValue || 0) / metrics.totalInvested) * 100) || 0}%
                              </span>
                            </div>
                            <Progress 
                              value={(Number(poolInvestments.totalValue || 0) / metrics.totalInvested) * 100 || 0} 
                              className="h-1.5 bg-zinc-800/70" 
                              indicatorClassName="bg-[#4CAF50]" 
                            />
                          </div>
                        )}
                        
                        {/* Direct Project Investments */}
                        {metrics.totalProjects > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Direct Projects</span>
                              <span className="text-zinc-300">
                                {Math.round(((metrics.totalInvested - Number(poolInvestments.totalValue || 0)) / metrics.totalInvested) * 100) || 0}%
                              </span>
                            </div>
                            <Progress 
                              value={((metrics.totalInvested - Number(poolInvestments.totalValue || 0)) / metrics.totalInvested) * 100 || 0} 
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

              {/* Transaction History - Replacing Quick Actions */}
              <TransactionList 
                transactions={recentTransactions} 
                maxItems={4}
                showDetails={true}
                title="Recent Transactions"
                className=""
              />
            </div>

            {/* Pool Investment Component */}
            <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Network className="h-5 w-5 text-[#4CAF50]" />
                  Pool Investment Center
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Invest in diversified solar energy pools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PoolInvestmentCard />
              </CardContent>
            </Card>

            {/* Direct Project Investments */}
            <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#4CAF50]" />
                  Direct Project Investments
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Invest directly in high-value solar projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DirectProjectInvestmentList />
              </CardContent>
            </Card>
          </TabsContent>
        </DashboardTabs>
      </div>
    </div>
  );
}