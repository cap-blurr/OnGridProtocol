'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  DollarSign, 
  Sun,
  Users,
  Zap,
  Search,
  Target,
  AlertCircle,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

// Import enhanced components
import InvestorPortfolio from '@/components/investment/InvestorPortfolio';
import ProjectDiscovery from '@/components/investment/ProjectDiscovery';
import PoolInvestmentCard from '@/components/project/PoolInvestmentCard';
import { useUserEvents } from '@/hooks/contracts/useContractEvents';
import { useUSDCBalance } from '@/hooks/contracts/useUSDC';

export default function InvestmentDashboard() {
  const { address: userAddress, isConnected } = useAccount();
  
  // Get user's USDC balance
  const { formattedBalance: usdcBalance, isLoading: isLoadingBalance } = useUSDCBalance(userAddress);
  
  // Get user-specific events
  const { events: userEvents } = useUserEvents(userAddress);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="text-center py-12">
            <div className="mb-8">
              <Sun className="h-24 w-24 mx-auto mb-4 text-oga-yellow opacity-50" />
              <h1 className="text-4xl font-bold text-white mb-4">Solar Investment Dashboard</h1>
              <p className="text-xl text-zinc-400 mb-8">
                Connect your wallet to access solar energy investment opportunities across Africa
              </p>
            </div>
            
            <Alert className="max-w-md mx-auto bg-oga-green/20 border-oga-green/50 text-oga-green">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to view your investment portfolio and discover new projects.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Solar Investment Dashboard</h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                Manage your solar energy investments and discover new opportunities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-oga-green">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {isLoadingBalance ? 'Loading...' : `${usdcBalance} USDC`}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-oga-green">
                <Sun className="h-5 w-5" />
                <span className="text-sm font-medium">Powered by Solar Energy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Alert */}
        {userEvents.length > 0 && (
          <Alert className="mb-6 bg-oga-green/20 border-oga-green/50 text-oga-green">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              You have {userEvents.length} recent transaction{userEvents.length !== 1 ? 's' : ''} in your portfolio.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-oga-green text-xs sm:text-sm">
              <DollarSign className="h-4 w-4 mr-2" />
              My Portfolio
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-oga-green text-xs sm:text-sm">
              <Search className="h-4 w-4 mr-2" />
              Discover Projects
            </TabsTrigger>
            <TabsTrigger value="pools" className="data-[state=active]:bg-oga-green text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-2" />
              Liquidity Pools
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab - Enhanced with real contract integration */}
          <TabsContent value="portfolio" className="space-y-4 lg:space-y-6">
            <InvestorPortfolio />
          </TabsContent>

          {/* Project Discovery Tab - Enhanced with real contract data */}
          <TabsContent value="discover" className="space-y-4 lg:space-y-6">
            <ProjectDiscovery />
          </TabsContent>

          {/* Liquidity Pools Tab - Enhanced with real pool data */}
          <TabsContent value="pools" className="space-y-4 lg:space-y-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Solar Liquidity Pools</h2>
                  <p className="text-zinc-400">
                    Invest in diversified pools that fund multiple low-value solar projects
                  </p>
                </div>
                <div className="flex items-center gap-2 text-oga-green">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Pool Investments</span>
                </div>
              </div>

              {/* Pool Investment Cards */}
              <PoolInvestmentCard />

              {/* Pool Benefits */}
              <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-oga-green" />
                    Why Invest in Solar Pools?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-oga-green" />
                        <h3 className="font-semibold text-white">Diversification</h3>
                      </div>
                      <p className="text-zinc-400 text-sm">
                        Your investment is spread across multiple solar projects, reducing individual project risk.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-oga-green" />
                        <h3 className="font-semibold text-white">Lower Minimum</h3>
                      </div>
                      <p className="text-zinc-400 text-sm">
                        Start investing with smaller amounts compared to direct project investments.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-oga-green" />
                        <h3 className="font-semibold text-white">Steady Returns</h3>
                      </div>
                      <p className="text-zinc-400 text-sm">
                        Earn consistent returns as projects in the pool make repayments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Footer */}
        <div className="mt-8 p-4 bg-black/40 backdrop-blur-sm border border-oga-green/30 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Ready to grow your solar portfolio?</h3>
              <p className="text-zinc-400 text-sm">
                Explore new investment opportunities and track your existing investments.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/projects">
                <Button className="bg-oga-green hover:bg-oga-green/80 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Browse All Projects
                </Button>
              </Link>
              <Link href="/dashboard/investments/opportunities">
                <Button variant="outline" className="border-oga-green/30 text-oga-green hover:bg-oga-green/10">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  View Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 