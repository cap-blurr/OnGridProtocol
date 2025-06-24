"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Calendar,
  Activity,
  Sun,
  Heart,
  ArrowUpRight,
  Wallet,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useGetAllPools, useUserPoolInvestments } from '@/hooks/contracts/useLiquidityPoolManager';
import PoolInvestmentCard from '@/components/project/PoolInvestmentCard';
import LoadingScreen from '@/components/ui/loading-screen';
import { TransactionList } from '@/components/dashboard/TransactionDetails';
import { useDashboardData } from '@/hooks/contracts/useDashboardData';
import { formatUnits } from 'viem';

export default function InvestmentPools() {
  const { address, isConnected } = useAccount();
  const { pools, isLoading: poolsLoading } = useGetAllPools();
  const { 
    poolIds: userPoolIds, 
    shares: userShares, 
    values: userValues,
    isLoading: userDataLoading 
  } = useUserPoolInvestments(address);
  
  const { transactionHistory } = useDashboardData('investor');

  const isLoading = poolsLoading || userDataLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Enhanced pool data with metadata
  const enhancedPools = pools.map((pool, index) => {
    const poolId = index + 1;
    const userPoolIndex = userPoolIds.findIndex(id => Number(id) === poolId);
    const userInvestment = userPoolIndex >= 0 ? {
      shares: userShares[userPoolIndex],
      value: userValues[userPoolIndex],
      formattedValue: formatUnits(userValues[userPoolIndex] || BigInt(0), 6)
    } : null;

    // Mock additional data (would come from backend/IPFS in production)
    const mockMetadata = {
      description: `Diversified solar energy investment pool ${poolId} bringing clean power to communities across Africa`,
      minInvestment: 5000 + (index * 5000),
      riskLevel: index % 3 === 0 ? 'Low' : index % 3 === 1 ? 'Medium' : 'High',
      apy: 10 + (index * 2),
      duration: `${2 + index} years`,
      energyGenerated: `${180 + (index * 120)} MWh`,
      homesPowered: 45000 + (index * 25000),
      projects: [
        `${['Lagos', 'Abuja', 'Kano', 'Port Harcourt'][index % 4]} Solar Farm`,
        `${['Ghana', 'Kenya', 'Nigeria', 'Uganda'][index % 4]} Community Grid`,
        `${['Industrial', 'Residential', 'Commercial', 'Rural'][index % 4]} Solar Project`
      ],
      investors: 120 + (index * 40)
    };

    return {
      id: poolId,
      name: pool.name || `Solar Investment Pool ${poolId}`,
      ...mockMetadata,
      exists: pool.exists,
      totalAssets: pool.totalAssets,
      totalShares: pool.totalShares,
      formattedTotalAssets: formatUnits(pool.totalAssets || BigInt(0), 6),
      formattedTotalShares: formatUnits(pool.totalShares || BigInt(0), 6),
      userInvestment,
      status: pool.exists ? 'Active' : 'Inactive',
    };
  }).filter(pool => pool.exists); // Only show existing pools

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <Link href="/dashboard/investments" className="inline-flex items-center text-oga-green hover:text-oga-green/80 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Investment Dashboard
          </Link>
          
          {/* Clean Header */}
          <div className="bg-black/40 backdrop-blur-sm border border-oga-green/30 rounded-xl p-6 mb-6 lg:mb-8">
            <div className="flex items-center space-x-3">
              <Sun className="h-6 w-6 text-oga-green" />
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-oga-green">Solar Investment Pools</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-oga-green rounded-full mr-2"></div>
                    <span className="text-xs text-oga-green">Live Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout for larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Pool Investment Section - Takes 2/3 of the space */}
          <div className="lg:col-span-2 space-y-6">
            <PoolInvestmentCard />
          </div>

          {/* Recent Transactions Section - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <TransactionList 
              transactions={transactionHistory.recentTransactions} 
              maxItems={8}
              title="Recent Pool Transactions"
              className="h-fit"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 