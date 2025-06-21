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
  Zap,
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
          <Link href="/dashboard/investments" className="inline-flex items-center text-[#4CAF50] hover:text-[#4CAF50]/80 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Solar Investment Dashboard
          </Link>
          
          {/* Enhanced Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4CAF50]/20 via-black/60 to-[#4CAF50]/10 backdrop-blur-sm border border-[#4CAF50]/30 rounded-xl p-8 mb-8">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#4CAF50]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4CAF50]/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-[#4CAF50]/20 p-4 rounded-xl">
                      <Sun className="h-8 w-8 text-[#4CAF50]" />
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Solar Investment Pools</h1>
                      <div className="flex items-center space-x-3">
                        <span className="bg-gradient-to-r from-[#4CAF50]/20 to-[#4CAF50]/10 px-3 py-1 rounded-full border border-[#4CAF50]/30 text-[#4CAF50] text-sm font-medium">
                          ✨ Enhanced Interface
                        </span>
                        <span className="text-zinc-400 text-sm">New Design & Features</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-lg max-w-2xl">
                    Join diversified solar investment pools with our redesigned interface. 
                    Experience reduced risk, steady returns, and seamless investment management.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                  <div className="bg-black/40 p-4 rounded-lg border border-[#4CAF50]/20 text-center">
                    <div className="text-2xl font-bold text-[#4CAF50] mb-1">Live</div>
                    <div className="text-sm text-zinc-400">Pool Data</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-[#4CAF50]/20 text-center">
                    <div className="text-2xl font-bold text-[#4CAF50] mb-1">Real-time</div>
                    <div className="text-sm text-zinc-400">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pool Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 lg:mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 lg:p-6 text-center">
              <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-oga-green mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2 text-sm lg:text-base">Risk Diversification</h3>
              <p className="text-zinc-400 text-xs lg:text-sm">Spread risk across multiple solar projects and regions</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 lg:p-6 text-center">
              <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-oga-green mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2 text-sm lg:text-base">Professional Management</h3>
              <p className="text-zinc-400 text-xs lg:text-sm">Expert solar portfolio management and project selection</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 lg:p-6 text-center">
              <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-oga-yellow mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2 text-sm lg:text-base">Lower Entry Barrier</h3>
              <p className="text-zinc-400 text-xs lg:text-sm">Access high-value solar projects with smaller investments</p>
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
                  <div className="text-2xl font-bold text-white">{userPoolIds.length}</div>
                  <p className="text-sm text-oga-green">Pools Invested</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    ${userValues.reduce((sum, value) => sum + Number(formatUnits(value, 6)), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-oga-green">Total Value</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {enhancedPools.filter(pool => pool.userInvestment).length}
                  </div>
                  <p className="text-sm text-oga-green">Active Positions</p>
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
                      <CardTitle className="text-white text-lg lg:text-xl mb-2 flex items-center">
                        <Sun className="w-5 h-5 mr-2 text-oga-yellow" />
                        {pool.name}
                      </CardTitle>
                      <p className="text-zinc-300 text-sm mb-3 leading-relaxed">{pool.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-400">
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
                      <Badge 
                        className={
                          pool.riskLevel === 'Low' ? 'bg-oga-green/20 text-oga-green border-oga-green/50' :
                          pool.riskLevel === 'Medium' ? 'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50' : 
                          'bg-red-600/20 text-red-400 border-red-600/50'
                        }
                      >
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
                          <div className="text-lg font-bold text-white">${pool.userInvestment.formattedValue}</div>
                          <p className="text-xs text-oga-green">Current Value</p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{formatUnits(pool.userInvestment.shares, 6)}</div>
                          <p className="text-xs text-oga-green">Pool Shares</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Solar Impact Metrics */}
                  <div className="bg-oga-green/10 border border-oga-green/20 p-4 rounded-lg">
                    <h4 className="text-oga-green font-semibold mb-3 text-sm flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Solar Impact Generated
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{pool.energyGenerated}</div>
                        <p className="text-xs text-oga-green">Clean Energy</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{pool.homesPowered.toLocaleString()}</div>
                        <p className="text-xs text-oga-green">Homes Powered</p>
                      </div>
                    </div>
                  </div>

                  {/* Pool Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg lg:text-xl font-bold text-white">${pool.formattedTotalAssets}</div>
                      <p className="text-xs text-zinc-400">Total Pool Value</p>
                    </div>
                    <div>
                      <div className="text-lg lg:text-xl font-bold text-oga-green">{pool.apy}%</div>
                      <p className="text-xs text-zinc-400">APY</p>
                    </div>
                    <div>
                      <div className="text-lg lg:text-xl font-bold text-white">${pool.minInvestment.toLocaleString()}</div>
                      <p className="text-xs text-zinc-400">Min Investment</p>
                    </div>
                    <div>
                      <div className="text-lg lg:text-xl font-bold text-white">{pool.projects.length}</div>
                      <p className="text-xs text-zinc-400">Solar Projects</p>
                    </div>
                  </div>

                  {/* Pool Projects */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm">Pool Projects</h4>
                    <div className="space-y-2">
                      {pool.projects.map((project, index) => (
                        <div key={index} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded">
                          <span className="text-zinc-300 text-sm">{project}</span>
                          <Badge variant="outline" className="border-oga-green/30 text-oga-green text-xs">
                            Solar
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investment Action - New Enhanced Interface */}
                  <div className="border-t border-[#4CAF50]/20 pt-6 mt-6">
                    <div className="bg-gradient-to-br from-[#4CAF50]/10 via-black/40 to-[#4CAF50]/5 p-6 rounded-xl border border-[#4CAF50]/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#4CAF50]/10 rounded-full blur-xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-bold text-lg flex items-center">
                            <div className="bg-[#4CAF50]/20 p-2 rounded-lg mr-3">
                              <DollarSign className="w-5 h-5 text-[#4CAF50]" />
                            </div>
                            Investment Interface
                          </h4>
                          <div className="bg-gradient-to-r from-[#4CAF50]/20 to-[#4CAF50]/10 px-3 py-1 rounded-full border border-[#4CAF50]/30">
                            <span className="text-[#4CAF50] text-xs font-medium">✨ New Design</span>
                          </div>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6">
                          Experience our redesigned investment interface with enhanced UX and real-time feedback.
                        </p>
                        <PoolInvestmentCard />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-zinc-400">
                <Sun className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Active Pools</h3>
                <p>Investment pools are being prepared. Check back soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 