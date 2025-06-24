"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  DollarSign,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useAccount } from "wagmi";
import { DashboardTabs } from "@/components/ui/custom-tabs";
import PoolInvestmentCard from "@/components/project/PoolInvestmentCard";
import DirectProjectInvestmentList from "@/components/project/DirectProjectInvestmentList";
import { useUserPoolInvestments } from "@/hooks/contracts/useLiquidityPoolManager";
import { useUSDCBalance } from "@/hooks/contracts/useUSDC";
import { useUserTransactionHistory } from "@/hooks/contracts/useDashboardData";
import { TransactionList } from "@/components/dashboard/TransactionDetails";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected: isWalletConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState("investments");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Simplified data fetching
  const { 
    poolIds, 
    shares, 
    values, 
    formattedTotalValue,
    isLoading: isLoadingPools,
    refetch: refetchPoolData 
  } = useUserPoolInvestments(address);
  
  const { 
    formattedBalance: usdcBalance, 
    isLoading: isLoadingBalance,
    refetch: refetchBalance 
  } = useUSDCBalance(address);
  
  const { recentTransactions } = useUserTransactionHistory();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for transaction success events and refresh data
  useEffect(() => {
    if (!address) return;

    const handleTransactionSuccess = (event: any) => {
      if (event.detail && event.detail.userAddress === address) {
        console.log('🔄 Transaction detected, refreshing dashboard data...');
        refreshAllData();
      }
    };

    window.addEventListener('transactionSuccess', handleTransactionSuccess);
    
    return () => {
      window.removeEventListener('transactionSuccess', handleTransactionSuccess);
    };
  }, [address]);

  // Unified refresh function
  const refreshAllData = async () => {
    if (!address) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchPoolData(),
        refetchBalance()
      ]);
      setLastRefresh(Date.now());
      console.log('✅ Dashboard data refreshed');
    } catch (error) {
      console.error('❌ Error refreshing dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshAllData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [address]);

  // Calculate simple metrics
  const totalInvested = Number(formattedTotalValue) || 0;
  const activePools = poolIds.length;
  const walletBalance = Number(usdcBalance) || 0;

  // Format last update time
  const formatLastUpdate = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-oga-green mx-auto mb-4" />
          <p className="text-white">Initializing dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-[#4CAF50]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-[#4CAF50]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      
      <div className="relative space-y-8 pb-12">
        {/* Header */}
        <div className="mb-12 relative pl-8">
          <div className="absolute -left-4 top-0 h-full w-[2px] bg-gradient-to-b from-[#4CAF50]/60 to-[#4CAF50]/0" />
          
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block font-mono text-xs uppercase tracking-widest text-[#4CAF50] mb-3 relative group">
                Investor Dashboard
                <div className="absolute -left-8 top-1/2 w-4 h-[2px] bg-gradient-to-r from-[#4CAF50] to-[#4CAF50]/0 group-hover:w-6 transition-all duration-300" />
              </span>
              
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Investment Overview
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl">
                Monitor your solar energy investments in real-time
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <div className="text-right">
                <p className="text-xs text-zinc-500">Last updated</p>
                <p className="text-xs text-[#4CAF50]">{formatLastUpdate(lastRefresh)}</p>
              </div>
              <Button
                onClick={refreshAllData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="border-[#4CAF50]/30 text-[#4CAF50] hover:bg-[#4CAF50]/10"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wallet Connection Notice */}
        {!isWalletConnected && (
          <Alert className="mb-8 bg-[#4CAF50]/5 border border-[#4CAF50]/20 text-[#4CAF50] backdrop-blur-sm">
            <Wallet className="h-4 w-4" />
            <AlertDescription className="text-[#4CAF50]/90">
              Connect your wallet to access your investment portfolio.
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
            {/* Top Cards - Wallet Balance + Investment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wallet Balance Card */}
              <Card className="relative bg-gradient-to-br from-[#4CAF50]/20 via-black/70 to-[#4CAF50]/10 backdrop-blur-sm border border-[#4CAF50]/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#4CAF50]/20 rounded-full blur-xl"></div>
                {isRefreshing && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
                )}
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-white">
                    Wallet Balance
                  </CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-oga-green/30 to-oga-green/50 rounded-lg flex items-center justify-center border border-oga-green/30">
                    <DollarSign className="h-4 w-4 text-oga-green" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  {isLoadingBalance ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-oga-green" />
                      <span className="text-white">Loading...</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-white tracking-tight">
                          {walletBalance.toLocaleString()}
                        </span>
                        <span className="text-oga-green text-sm font-semibold uppercase tracking-wider">USDC</span>
                      </div>
                      <p className="text-xs text-zinc-400">Available for investments</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Total Invested */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 transition-all duration-300">
                {isRefreshing && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
                )}
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-white">
                    Total Invested
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-[#4CAF50]" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    ${totalInvested.toLocaleString()}
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-3 w-3 text-[#4CAF50] mr-1" />
                    <span className="text-xs text-[#4CAF50]">Pool investments</span>
                  </div>
                </CardContent>
              </Card>

              {/* Active Pools */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 transition-all duration-300">
                {isRefreshing && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
                )}
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-white">
                    Active Pools
                  </CardTitle>
                  <Network className="h-4 w-4 text-[#4CAF50]" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    {activePools}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Pool investments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pool Investment & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pool Investment Component */}
              <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Network className="h-5 w-5 text-[#4CAF50]" />
                    Solar Investment Pools
                    {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-[#4CAF50]" />}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Invest in diversified solar energy pools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PoolInvestmentCard onInvestmentUpdate={refreshAllData} />
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-[#4CAF50]" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your latest transactions and investments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList 
                    transactions={recentTransactions} 
                    maxItems={4}
                    showDetails={false}
                    title=""
                    className=""
                  />
                  {recentTransactions.length === 0 && (
                    <div className="text-center py-8 text-zinc-400">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions yet</p>
                      <p className="text-sm">Start investing to see your activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

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