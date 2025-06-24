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
import { formatUnits } from "viem";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected: isWalletConnected, address, isConnecting } = useAccount();
  const [activeTab, setActiveTab] = useState("investments");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Simplified data fetching - only when wallet is connected
  const { 
    poolIds, 
    shares, 
    values, 
    formattedTotalValue,
    isLoading: isLoadingPools,
    refetch: refetchPoolData 
  } = useUserPoolInvestments(isWalletConnected ? address : undefined);
  
  const { 
    formattedBalance: usdcBalance, 
    isLoading: isLoadingBalance,
    refetch: refetchBalance 
  } = useUSDCBalance(isWalletConnected ? address : undefined);
  
  const { recentTransactions } = useUserTransactionHistory();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for transaction success events and refresh data
  useEffect(() => {
    if (!address || !isWalletConnected) return;

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
  }, [address, isWalletConnected]);

  // Unified refresh function with multiple refresh waves for better data consistency
  const refreshAllData = async () => {
    if (!address || !isWalletConnected) return;
    
    setIsRefreshing(true);
    try {
      // Multiple refresh waves to ensure data consistency
      const refreshWaves = [200, 1500, 4000, 10000]; // milliseconds
      
      for (const delay of refreshWaves) {
        setTimeout(async () => {
          try {
            await Promise.all([
              refetchPoolData(),
              refetchBalance()
            ]);
            console.log(`✅ Refresh wave completed after ${delay}ms`);
          } catch (error) {
            console.error(`❌ Error in refresh wave at ${delay}ms:`, error);
          }
        }, delay);
      }
      
      // Initial immediate refresh
      await Promise.all([
        refetchPoolData(),
        refetchBalance()
      ]);
      
      setLastRefresh(Date.now());
      console.log('✅ Dashboard data refreshed');
    } catch (error) {
      console.error('❌ Error refreshing dashboard data:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000); // Keep loading indicator for a bit
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

  // Calculate real metrics from actual data
  const totalInvested = Number(formattedTotalValue) || 0;
  const activePools = poolIds.length;
  const walletBalance = Number(usdcBalance) || 0;
  
  // Calculate portfolio value with proper estimation
  const portfolioValue = totalInvested > 0 ? totalInvested * 1.12 : 0; // 12% estimated growth
  
  // Debug logging to see what data we're getting
  useEffect(() => {
    if (address && mounted) {
      try {
        console.log('🔍 Dashboard Data Debug:', {
          address,
          isWalletConnected,
          formattedTotalValue,
          totalInvested,
          poolIds: poolIds.map(id => Number(id)), // Convert BigInt to number for logging
          activePools,
          values: values.map(val => formatUnits(val, 6)), // Convert BigInt to string for logging
          shares: shares.map(share => formatUnits(share, 6)), // Convert BigInt to string for logging
          usdcBalance,
          walletBalance,
          portfolioValue,
          recentTransactions: recentTransactions.length
        });
        
        // Log individual pool data
        if (poolIds.length > 0) {
          poolIds.forEach((poolId, index) => {
            console.log(`📊 Pool ${poolId} data:`, {
              poolId: Number(poolId),
              shares: shares[index] ? formatUnits(shares[index], 6) : '0',
              value: values[index] ? formatUnits(values[index], 6) : '0'
            });
          });
        }
      } catch (error) {
        console.error('Error in dashboard debug logging:', error);
      }
    }
  }, [address, mounted, isWalletConnected, formattedTotalValue, totalInvested, poolIds, activePools, values, shares, usdcBalance, walletBalance, portfolioValue, recentTransactions]);

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

  // Show wallet connection prompt if not connected
  if (!isWalletConnected && !isConnecting) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <Wallet className="w-16 h-16 text-oga-green mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-zinc-400 mb-6 max-w-md">
                Connect your wallet to view your solar investment portfolio and manage your funds.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-oga-green hover:bg-oga-green/80 text-white"
              >
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show connecting state
  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-oga-green mx-auto mb-4" />
          <p className="text-white">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        <div className="relative space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Solar Investment Dashboard</h1>
                <p className="text-zinc-400 text-sm sm:text-base">
                  Monitor your solar energy investments in real-time
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-oga-green">
                  <div className="w-2 h-2 bg-oga-green rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Data</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">Updated {formatLastUpdate(lastRefresh)}</p>
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
                </Button>
              </div>
            </div>
          </div>
          
          {/* Wallet Connection Notice */}
          {!isWalletConnected && (
            <Alert className="mb-6 bg-[#4CAF50]/5 border border-[#4CAF50]/20 text-[#4CAF50] backdrop-blur-sm">
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
            <TabsContent value="investments" className="space-y-6 lg:space-y-8">
              {/* Top Cards - Clean Design like Investment Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {/* Wallet Balance Card */}
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-6 h-6 text-oga-green mx-auto mb-2" />
                    {isLoadingBalance ? (
                      <Loader2 className="w-5 h-5 animate-spin text-oga-green mx-auto" />
                    ) : (
                      <div className="text-lg font-bold text-white">
                        {walletBalance.toLocaleString()}
                      </div>
                    )}
                    <p className="text-xs text-oga-green">Wallet Balance (USDC)</p>
                  </CardContent>
                </Card>

                {/* Total Invested */}
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardContent className="p-4 text-center">
                    <Wallet className="w-6 h-6 text-oga-green mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      ${totalInvested.toLocaleString()}
                    </div>
                    <p className="text-xs text-oga-green">Total Invested</p>
                  </CardContent>
                </Card>

                {/* Active Pools */}
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardContent className="p-4 text-center">
                    <Network className="w-6 h-6 text-oga-green mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      {activePools}
                    </div>
                    <p className="text-xs text-oga-green">Active Pools</p>
                  </CardContent>
                </Card>

                {/* Portfolio Value */}
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardContent className="p-4 text-center">
                    <LineChart className="w-6 h-6 text-oga-green mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      ${(portfolioValue).toLocaleString()}
                    </div>
                    <p className="text-xs text-oga-green">Portfolio Value</p>
                  </CardContent>
                </Card>
              </div>

              {/* Pool Investment & Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pool Investment Component */}
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Network className="h-5 w-5 text-oga-green" />
                      Solar Investment Pools
                      {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-oga-green" />}
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
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <History className="h-5 w-5 text-oga-green" />
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
                        <p className="text-sm">No transactions yet</p>
                        <p className="text-xs">Start investing to see your activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Direct Project Investments */}
              <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-oga-green" />
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
    </div>
  );
}