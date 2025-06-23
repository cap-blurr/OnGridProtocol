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
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useGetAllPools, useUserPoolInvestments } from '@/hooks/contracts/useLiquidityPoolManager';
import PoolInvestmentCard from '@/components/project/PoolInvestmentCard';
import LoadingScreen from '@/components/ui/loading-screen';
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
          
          {/* Enhanced Header */}
          <div className="bg-black/40 backdrop-blur-sm border border-oga-green/30 rounded-xl p-6 mb-6 lg:mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-oga-green/20 p-3 rounded-lg">
                <Sun className="h-6 w-6 text-oga-green" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-oga-green">Solar Investment Pools</h1>
                <p className="text-oga-green/80 text-sm">Professional solar portfolio management</p>
              </div>
            </div>
            
            <p className="text-oga-green/90 text-sm lg:text-base max-w-3xl">
              Invest in diversified solar energy pools with professional management and risk distribution across multiple projects.
            </p>
          </div>
        </div>

        {/* Pool Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 lg:mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 lg:p-6 text-center">
              <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-oga-green mx-auto mb-3" />
              <h3 className="text-oga-green font-semibold mb-2 text-sm lg:text-base">Risk Diversification</h3>
              <p className="text-oga-green/80 text-xs lg:text-sm">Spread risk across multiple solar projects and regions</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 lg:p-6 text-center">
              <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-oga-green mx-auto mb-3" />
              <h3 className="text-oga-green font-semibold mb-2 text-sm lg:text-base">Professional Management</h3>
              <p className="text-oga-green/80 text-xs lg:text-sm">Expert solar portfolio management and project selection</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 lg:p-6 text-center">
              <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-oga-yellow mx-auto mb-3" />
              <h3 className="text-oga-green font-semibold mb-2 text-sm lg:text-base">Lower Entry Barrier</h3>
              <p className="text-oga-green/80 text-xs lg:text-sm">Access high-value solar projects with smaller investments</p>
            </CardContent>
          </Card>
        </div>

        {/* Pool Status Summary */}
        {isConnected && userPoolIds.length > 0 && (
          <Card className="mb-6 lg:mb-8 bg-oga-green/10 border border-oga-green/30">
            <CardHeader>
              <CardTitle className="text-oga-green flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Your Pool Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-oga-green">{userPoolIds.length}</div>
                  <p className="text-sm text-oga-green/80">Pools Invested</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-oga-green">
                    ${userValues.reduce((sum, value) => sum + Number(formatUnits(value, 6)), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-oga-green/80">Total Value</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-oga-green">
                    {enhancedPools.filter(pool => pool.userInvestment).length}
                  </div>
                  <p className="text-sm text-oga-green/80">Active Positions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investment Pools */}
        <div className="space-y-4 lg:space-y-6">
          {enhancedPools.length > 0 ? (
            enhancedPools.map((pool) => (
              <Card key={pool.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-colors duration-300">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-oga-green text-lg lg:text-xl mb-2 flex items-center">
                        <Sun className="w-5 h-5 mr-2 text-oga-yellow" />
                        {pool.name}
                      </CardTitle>
                      <p className="text-oga-green/90 text-sm mb-3 leading-relaxed">{pool.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-oga-green/80">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {pool.investors} investors
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {pool.duration}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1 text-oga-green" />
                          {pool.homesPowered.toLocaleString()} homes powered
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <Badge className="bg-oga-green/20 text-oga-green border-oga-green/50">
                        {pool.status}
                      </Badge>
                      <Badge className={`text-xs ${
                        pool.riskLevel === 'Low' ? 'bg-oga-green/20 text-oga-green border-oga-green/50' :
                        pool.riskLevel === 'Medium' ? 'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50' :
                        'bg-red-600/20 text-red-400 border-red-600/50'
                      }`}>
                        {pool.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 lg:space-y-6">
                  {/* User Investment Status */}
                  {pool.userInvestment && (
                    <div className="bg-oga-green/10 border border-oga-green/20 p-4 rounded-lg">
                      <h4 className="text-oga-green font-semibold mb-3 text-sm flex items-center">
                        <Wallet className="w-4 h-4 mr-2" />
                        Your Investment in this Pool
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-oga-green">${pool.userInvestment.formattedValue}</div>
                          <p className="text-xs text-oga-green/80">Current Value</p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-oga-green">{formatUnits(pool.userInvestment.shares, 6)}</div>
                          <p className="text-xs text-oga-green/80">Pool Shares</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pool Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-oga-green/5 border border-oga-green/20 p-3 rounded text-center">
                      <div className="text-lg font-bold text-oga-green">${pool.formattedTotalAssets}</div>
                      <p className="text-xs text-oga-green/80">Total Pool Value</p>
                    </div>
                    <div className="bg-oga-green/5 border border-oga-green/20 p-3 rounded text-center">
                      <div className="text-lg font-bold text-oga-green">{pool.apy}%</div>
                      <p className="text-xs text-oga-green/80">APY</p>
                    </div>
                    <div className="bg-oga-green/5 border border-oga-green/20 p-3 rounded text-center">
                      <div className="text-lg font-bold text-oga-green">${pool.minInvestment.toLocaleString()}</div>
                      <p className="text-xs text-oga-green/80">Min Investment</p>
                    </div>
                    <div className="bg-oga-green/5 border border-oga-green/20 p-3 rounded text-center">
                      <div className="text-lg font-bold text-oga-green">{pool.projects.length}</div>
                      <p className="text-xs text-oga-green/80">Solar Projects</p>
                    </div>
                  </div>

                  {/* Solar Projects in Pool */}
                  <div className="bg-oga-green/5 border border-oga-green/20 p-4 rounded-lg">
                    <h4 className="text-oga-green font-semibold mb-3 text-sm">Solar Projects in Pool</h4>
                    <div className="space-y-2">
                      {pool.projects.map((project, index) => (
                        <div key={index} className="flex items-center justify-between bg-oga-green/10 p-3 rounded">
                          <span className="text-oga-green/90 text-sm">{project}</span>
                          <Badge className="bg-oga-green/20 text-oga-green border-oga-green/50 text-xs">
                            Active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investment Action */}
                  <div className="pt-4 border-t border-oga-green/20">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-oga-green font-semibold text-sm mb-1">Ready to invest?</h4>
                        <p className="text-oga-green/80 text-sm">
                          Join {pool.investors} other investors in funding solar energy across Africa
                        </p>
                      </div>
                      <Button className="bg-oga-green hover:bg-oga-green/80 text-black font-semibold px-6 py-2">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Invest in Pool
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Sun className="w-16 h-16 mx-auto mb-4 text-oga-green/60" />
              <h3 className="text-xl font-bold text-oga-green mb-2">No Investment Pools Available</h3>
              <p className="text-oga-green/80">
                No solar investment pools are currently available. Check back soon for new opportunities!
              </p>
            </div>
          )}
        </div>

        {/* Pool Investment Form Component */}
        <div className="mt-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader>
              <CardTitle className="text-oga-green flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pool Investment Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PoolInvestmentCard />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 