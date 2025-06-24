"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from 'wagmi';
import { useUSDCBalance } from '@/hooks/contracts/useUSDC';
import { useUserPoolInvestments } from '@/hooks/contracts/useLiquidityPoolManager';
import { useEnhancedDashboardData } from '@/hooks/contracts/useEnhancedDashboardData';
import { Loader2, RefreshCw, CheckCircle, DollarSign } from 'lucide-react';
import PoolInfoTest from '@/components/developer/PoolInfoTest';

export default function PoolTestPage() {
  const { address } = useAccount();
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastEventTime, setLastEventTime] = useState<number>(0);

  // Test real-time data hooks
  const { formattedBalance: usdcBalance, refetch: refetchBalance } = useUSDCBalance(address);
  const { 
    poolIds, 
    formattedTotalValue, 
    refetch: refetchPools 
  } = useUserPoolInvestments(address);
  
  const {
    metrics,
    isRefreshing,
    lastRefresh,
    refreshData
  } = useEnhancedDashboardData();

  // Listen for transaction events
  useEffect(() => {
    const handleTransactionSuccess = (event: any) => {
      if (event.detail && event.detail.userAddress === address) {
        console.log('🎯 Test page caught transaction event:', event.detail);
        setLastEventTime(Date.now());
        setRefreshCount(prev => prev + 1);
      }
    };

    window.addEventListener('transactionSuccess', handleTransactionSuccess);
    
    return () => {
      window.removeEventListener('transactionSuccess', handleTransactionSuccess);
    };
  }, [address]);

  const manualRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    await Promise.all([
      refetchBalance(),
      refetchPools(),
      refreshData()
    ]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Real-time Pool Test</h1>
        <p className="text-zinc-400">Test real-time updates after pool deposits</p>
      </div>

      {/* Connection Status */}
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="text-oga-green flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">Wallet Connected:</span>
              <span className={`ml-2 ${address ? 'text-oga-green' : 'text-red-400'}`}>
                {address ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400">Address:</span>
              <span className="ml-2 text-oga-green font-mono text-xs">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Data Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader>
            <CardTitle className="text-oga-green flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              USDC Balance
              {isRefreshing && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {usdcBalance} USDC
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time wallet balance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader>
            <CardTitle className="text-oga-green flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Pool Investments
              {isRefreshing && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${formattedTotalValue} USDC
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Across {poolIds.length} pool{poolIds.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader>
            <CardTitle className="text-oga-green flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Event Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {refreshCount}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Events caught
            </p>
            {lastEventTime > 0 && (
              <p className="text-xs text-oga-green mt-1">
                Last: {new Date(lastEventTime).toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Manual Controls */}
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="text-oga-green">Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={manualRefresh}
              disabled={isRefreshing}
              className="bg-oga-green hover:bg-oga-green/80 text-black"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Manual Refresh
                </>
              )}
            </Button>
            
            <Button
              onClick={() => {
                // Fire a test event
                const event = new CustomEvent('transactionSuccess', {
                  detail: {
                    type: 'poolDeposit',
                    userAddress: address,
                    hash: '0xtest123',
                    timestamp: Date.now()
                  }
                });
                window.dispatchEvent(event);
              }}
              variant="outline"
              className="border-oga-green/30 text-oga-green hover:bg-oga-green/10"
            >
              Fire Test Event
            </Button>
          </div>
          
          <div className="text-xs text-zinc-400">
            <p>Last dashboard refresh: {new Date(lastRefresh).toLocaleTimeString()}</p>
            <p>Dashboard refreshing: {isRefreshing ? 'Yes' : 'No'}</p>
            <p>Total investments: ${metrics?.totalInvested || 0}</p>
          </div>
        </CardContent>
      </Card>

      {/* Pool Investment Test Component */}
      <PoolInfoTest />
    </div>
  );
} 