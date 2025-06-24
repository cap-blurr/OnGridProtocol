"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from 'wagmi';
import { useUSDCBalance } from '@/hooks/contracts/useUSDC';
import { useUserPoolInvestments } from '@/hooks/contracts/useLiquidityPoolManager';
import { Loader2, Network, DollarSign } from 'lucide-react';
import PoolInvestmentCard from '@/components/project/PoolInvestmentCard';

export default function PoolTestPage() {
  const { address } = useAccount();
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simplified data fetching
  const { 
    poolIds, 
    formattedTotalValue,
    isLoading: isLoadingPools,
    refetch: refetchPoolData 
  } = useUserPoolInvestments(address);
  
  const { 
    formattedBalance: usdcBalance, 
    isLoading: isLoadingBalance,
    refetch: refetchBalance 
  } = useUSDCBalance(address);

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
      console.log('✅ Pool test data refreshed');
    } catch (error) {
      console.error('❌ Error refreshing pool test data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Listen for transaction success events
  useEffect(() => {
    if (!address) return;

    const handleTransactionSuccess = (event: any) => {
      if (event.detail && event.detail.userAddress === address) {
        console.log('🔄 Transaction detected in pool test, refreshing...');
        refreshAllData();
      }
    };

    window.addEventListener('transactionSuccess', handleTransactionSuccess);
    
    return () => {
      window.removeEventListener('transactionSuccess', handleTransactionSuccess);
    };
  }, [address]);

  const totalInvested = Number(formattedTotalValue) || 0;
  const activePools = poolIds.length;
  const walletBalance = Number(usdcBalance) || 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Pool Investment Test</h1>
        <p className="text-zinc-400 text-lg">Test pool investments and data refresh</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-[#4CAF50]/20 via-black/70 to-[#4CAF50]/10 backdrop-blur-sm border border-[#4CAF50]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-oga-green" />
          </CardHeader>
          <CardContent>
            {isLoadingBalance ? (
              <Loader2 className="w-5 h-5 animate-spin text-oga-green" />
            ) : (
              <div className="text-2xl font-bold text-white">${walletBalance.toLocaleString()} USDC</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Invested</CardTitle>
            <Network className="h-4 w-4 text-[#4CAF50]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalInvested.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Pools</CardTitle>
            <Network className="h-4 w-4 text-[#4CAF50]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activePools}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pool Investment Component */}
      <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-[#4CAF50]" />
              Pool Investment Test
            </CardTitle>
            <Button
              onClick={refreshAllData}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-[#4CAF50]/30 text-[#4CAF50] hover:bg-[#4CAF50]/10"
            >
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PoolInvestmentCard onInvestmentUpdate={refreshAllData} />
        </CardContent>
      </Card>
    </div>
  );
} 