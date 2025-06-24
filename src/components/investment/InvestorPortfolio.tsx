'use client';

import { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign, 
  TrendingUp,
  Users,
  BarChart3,
  Wallet,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Sun,
  Target
} from 'lucide-react';
import { formatUnits } from 'viem';
import Link from 'next/link';

// Simple interfaces
import { useUserPoolInvestments } from '@/hooks/contracts/useLiquidityPoolManager';
import { useUSDCBalance } from '@/hooks/contracts/useUSDC';

interface PoolInvestment {
  poolId: number;
  shares: bigint;
  value: bigint;
  poolName: string;
}

export default function InvestorPortfolio() {
  const { address: userAddress, isConnected } = useAccount();

  // Get USDC balance
  const { formattedBalance: usdcBalance } = useUSDCBalance(userAddress);

  // Get user's pool investments
  const { poolIds, shares: poolShares, values: poolValues, isLoading: isLoadingPools } = useUserPoolInvestments(userAddress);

  // Transform pool investments
  const poolInvestments: PoolInvestment[] = poolIds.map((id, index) => ({
    poolId: Number(id),
        shares: poolShares[index] || BigInt(0),
        value: poolValues[index] || BigInt(0),
    poolName: `Solar Pool ${Number(id)}`
  }));

  // Calculate simple portfolio totals
  const portfolioTotals = useMemo(() => {
    const poolTotal = poolValues.reduce((sum, value) => sum + Number(formatUnits(value, 6)), 0);

    return {
      totalInvested: poolTotal,
      highValueTotal: 0, // No direct projects for now
      poolTotal,
      totalClaimable: 0,
      projectCount: 0,
      poolCount: poolIds.length
    };
  }, [poolValues, poolIds.length]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Investment Portfolio</h1>
        <p className="text-xl text-gray-300">Please connect your wallet to view your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-oga-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${portfolioTotals.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-zinc-400">Across all investments</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pool Investments</CardTitle>
            <Users className="h-4 w-4 text-oga-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${portfolioTotals.poolTotal.toLocaleString()}</div>
            <p className="text-xs text-zinc-400">{portfolioTotals.poolCount} active pools</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">USDC Balance</CardTitle>
            <Wallet className="h-4 w-4 text-oga-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{usdcBalance} USDC</div>
            <p className="text-xs text-zinc-400">Available to invest</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-oga-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+12.5%</div>
            <p className="text-xs text-zinc-400">Average APR</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Tabs */}
      <Tabs defaultValue="pools" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <TabsTrigger value="pools" className="data-[state=active]:bg-oga-green">
            <Users className="h-4 w-4 mr-2" />
            Pool Investments ({portfolioTotals.poolCount})
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-oga-green">
            <BarChart3 className="h-4 w-4 mr-2" />
            Direct Projects ({portfolioTotals.projectCount})
          </TabsTrigger>
        </TabsList>

        {/* Pool Investments Tab */}
        <TabsContent value="pools" className="space-y-4">
          {isLoadingPools ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-oga-green" />
            </div>
          ) : poolInvestments.length === 0 ? (
            <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
              <CardContent className="py-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                <h3 className="text-lg font-semibold text-white mb-2">No Pool Investments</h3>
                <p className="text-zinc-400 mb-4">
                  You haven't invested in any liquidity pools yet.
                </p>
                <Link href="/dashboard/investments/pools">
                  <Button className="bg-oga-green hover:bg-oga-green/80 text-black">
                  Explore Pools
                </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {poolInvestments.map((investment) => (
                <Card key={investment.poolId} className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg flex items-center">
                        <Sun className="h-5 w-5 mr-2 text-oga-green" />
                        {investment.poolName}
                      </CardTitle>
                      <Badge className="bg-oga-green/20 text-oga-green border-oga-green/50">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-400">Investment Value</p>
                        <p className="text-white font-semibold">${formatUnits(investment.value, 6)} USDC</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Pool Shares</p>
                        <p className="text-oga-green font-semibold">{formatUnits(investment.shares, 6)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-zinc-700">
                      <Link href="/dashboard/investments/pools">
                        <Button variant="outline" className="w-full border-oga-green/30 text-oga-green hover:bg-oga-green/10">
                          <Target className="h-4 w-4 mr-2" />
                          Manage Investment
                          <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Direct Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-lg font-semibold text-white mb-2">No Direct Project Investments</h3>
              <p className="text-zinc-400 mb-4">
                You haven't invested in any direct projects yet.
              </p>
              <Link href="/projects">
                <Button className="bg-oga-green hover:bg-oga-green/80 text-black">
                  Browse Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Investment Summary */}
      {portfolioTotals.totalInvested > 0 && (
        <Alert className="bg-oga-green/10 border border-oga-green/30 text-oga-green">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            Your portfolio is performing well with ${portfolioTotals.totalInvested.toLocaleString()} invested across {portfolioTotals.poolCount} pools.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}