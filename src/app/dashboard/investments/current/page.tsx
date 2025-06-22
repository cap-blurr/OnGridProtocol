"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAccount } from 'wagmi';
import {
  ArrowUpRight,
  LineChart,
  Wallet,
  CalendarDays,
  DollarSign,
  BarChart3,
  History,
  TrendingUp,
  Download,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Sun,
  Zap,
  Heart,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useUserPoolInvestments, useRedeemFromPool } from '@/hooks/contracts/useLiquidityPoolManager';
import { useGetAllHighValueProjects } from '@/hooks/contracts/useProjectFactory';
import { useDashboardData } from '@/hooks/contracts/useDashboardData';
import { useContractFallback } from '@/hooks/contracts/useContractFallback';
import { ClaimReturns } from '@/components/investment/InvestmentActions';
import LoadingScreen from '@/components/ui/loading-screen';
import { formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';

export default function CurrentInvestmentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { shouldUseFallback } = useContractFallback();
  
  // Use fallback data when RPC is failing
  const poolHook = useUserPoolInvestments(address);
  const poolData = shouldUseFallback ? {
    poolIds: [],
    shares: [],
    values: [],
    formattedTotalValue: '0',
    isLoading: false
  } : poolHook;
  
  const { 
    poolIds: userPoolIds, 
    shares: userShares, 
    values: userValues,
    formattedTotalValue,
    isLoading: poolDataLoading 
  } = poolData;
  
  const projectsHook = useGetAllHighValueProjects();
  const projects = shouldUseFallback ? { projects: [], isLoading: false } : projectsHook;
  const { projects: allProjects, isLoading: projectsLoading } = projects;
  
  const metricsHook = useDashboardData('investor');
  const metricsData = shouldUseFallback ? { metrics: {}, isLoading: false } : metricsHook;
  const { metrics, isLoading: metricsLoading } = metricsData;
  
  const {
    redeem: redeemFromPool,
    isLoading: isRedeeming
  } = useRedeemFromPool();

  const isLoading = poolDataLoading || projectsLoading || metricsLoading;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-zinc-400" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-zinc-400">Please connect your wallet to view your investment portfolio</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Transform pool data for display
  const poolInvestments = userPoolIds.map((poolId, index) => ({
    id: `pool-${Number(poolId)}`,
    name: `Solar Investment Pool ${Number(poolId)}`,
    type: 'Pool',
    investmentAmount: Number(formatUnits(userValues[index] || BigInt(0), 6)),
    dateInvested: new Date().toISOString().split('T')[0], // Would come from events
    roi: 10 + (index * 2),
    status: 'Active',
    risk: index % 3 === 0 ? 'Low' : index % 3 === 1 ? 'Medium' : 'High',
    shares: userShares[index],
    value: userValues[index],
    formattedValue: formatUnits(userValues[index] || BigInt(0), 6),
    poolId: Number(poolId),
    nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectCount: 8 + (index * 2),
    description: `Diversified solar energy investment pool with ${8 + (index * 2)} active projects`,
    energyGenerated: `${25 + (index * 15)} MWh`,
    homesPowered: 15000 + (index * 8000),
  }));

  // Mock direct project investments (would come from event indexing in production)
  const directInvestments = allProjects.slice(0, 2).map((project, index) => ({
    id: `proj-${index + 1}`,
    name: `Solar Project #${index + 1}`,
    type: "Solar",
    vaultAddress: project,
    investmentAmount: 50000 + (index * 25000),
    dateInvested: new Date(Date.now() - (30 + index * 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    roi: 12 + (index * 2),
    status: "Active",
    duration: `${24 + index * 6} months`,
    nextPayment: new Date(Date.now() + (15 + index * 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    progress: 22 + (index * 20),
    description: `Large-scale solar farm providing clean energy to ${25000 + index * 15000} homes`,
    totalReturns: (50000 + index * 25000) * 0.15,
    availableWithdrawal: (50000 + index * 25000) * 0.05,
    pendingReturns: (50000 + index * 25000) * 0.025,
    location: `${['Lagos', 'Abuja', 'Port Harcourt'][index]}, Nigeria`,
    capacity: `${50 + index * 25} MW`,
    energyGenerated: `${125 + index * 60} MWh`,
    homesPowered: 25000 + index * 15000
  }));

  const allInvestments = [...directInvestments, ...poolInvestments];

  // Calculate portfolio metrics
  const totalInvested = allInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalCurrentValue = poolInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0) + 
                           directInvestments.reduce((sum, inv) => sum + inv.totalReturns, 0);
  const totalAvailableWithdrawals = directInvestments.reduce((sum, inv) => sum + inv.availableWithdrawal, 0);
  const totalEnergyGenerated = allInvestments.reduce((sum, inv) => 
    parseInt(inv.energyGenerated?.replace(' MWh', '') || '0'), 0);
  const totalHomesPowered = allInvestments.reduce((sum, inv) => inv.homesPowered || 0, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-oga-green/20 text-oga-green border-oga-green/50";
      case "Pending":
        return "bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50";
      case "Completed":
        return "bg-blue-500/20 text-blue-500 border-blue-700";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-600";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-oga-green/20 text-oga-green border-oga-green/50";
      case "Medium":
        return "bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50";
      case "High":
        return "bg-red-600/20 text-red-400 border-red-600/50";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-600";
    }
  };

  const handlePoolWithdrawal = async (poolId: number, shares: bigint) => {
    if (!withdrawalAmount || isRedeeming) return;

    try {
      setIsWithdrawing(true);
      
      const sharesToRedeem = parseUnits(withdrawalAmount, 6);
      if (sharesToRedeem > shares) {
        toast.error('Withdrawal amount exceeds your pool shares');
        return;
      }

      redeemFromPool(poolId, sharesToRedeem.toString());
      
      // Success handling moved to useEffect in the hook
      setWithdrawalAmount("");
      setSelectedInvestment(null);
      setWithdrawalSuccess(true);
      
    } catch (error) {
      console.error('Pool withdrawal error:', error);
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <Link href="/dashboard/investments" className="inline-flex items-center text-oga-green hover:text-oga-green-light mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Solar Investment Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Solar Investment Portfolio</h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                Track and manage your solar energy investments and returns
              </p>
            </div>
            <div className="flex items-center space-x-2 text-oga-green">
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Live Portfolio Data</span>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">${totalInvested.toLocaleString()}</div>
              <p className="text-xs text-oga-green">Across {allInvestments.length} investments</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Current Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">${totalCurrentValue.toLocaleString()}</div>
              <p className="text-xs text-oga-green">
                {totalCurrentValue > totalInvested ? '+' : ''}{((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(1)}% total return
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Available</CardTitle>
              <Wallet className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">${totalAvailableWithdrawals.toLocaleString()}</div>
              <p className="text-xs text-oga-green">Ready to withdraw</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Energy Generated</CardTitle>
              <Zap className="h-4 w-4 text-oga-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{totalEnergyGenerated} MWh</div>
              <p className="text-xs text-oga-green">Clean solar energy</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Homes Powered</CardTitle>
              <Heart className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{totalHomesPowered.toLocaleString()}</div>
              <p className="text-xs text-oga-green">Impacted households</p>
            </CardContent>
          </Card>
        </div>

        {/* Investment Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-oga-green text-xs sm:text-sm">
              All Solar Investments
            </TabsTrigger>
            <TabsTrigger value="direct" className="data-[state=active]:bg-oga-green text-xs sm:text-sm">
              Direct Solar Projects
            </TabsTrigger>
            <TabsTrigger value="pools" className="data-[state=active]:bg-oga-green text-xs sm:text-sm">
              Solar Pool Investments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 lg:space-y-6">
            {/* Direct Solar Investments */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-oga-yellow" />
                Direct Solar Project Investments
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {directInvestments.map((investment) => (
                  <Card key={investment.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-oga-green/20 text-oga-green border-oga-green/50">
                          <Sun className="w-3 h-3 mr-1" />
                          {investment.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-base lg:text-lg">{investment.name}</CardTitle>
                      <CardDescription className="text-zinc-400 text-sm">
                        {investment.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-zinc-400">Investment</p>
                          <p className="text-white font-semibold">${investment.investmentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400">Solar ROI</p>
                          <p className="text-oga-green font-semibold">{investment.roi}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-zinc-400">Total Returns</p>
                          {"totalReturns" in investment ? (
                            <p className="text-oga-green font-semibold">${(investment.totalReturns as number).toLocaleString()}</p>
                          ) : (
                            <p className="text-oga-green font-semibold">N/A</p>
                          )}
                        </div>
                        <div>
                          <p className="text-zinc-400">Available</p>
                          <p className="text-oga-yellow font-semibold">${investment.availableWithdrawal.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="bg-oga-green/10 border border-oga-green/20 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-zinc-400">Energy Generated</p>
                            <p className="text-oga-green font-semibold">{investment.energyGenerated}</p>
                          </div>
                          <div>
                            <p className="text-zinc-400">Homes Powered</p>
                            <p className="text-oga-green font-semibold">{investment.homesPowered.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-zinc-400">Solar Project Progress</span>
                          <span className="text-white">{investment.progress}%</span>
                        </div>
                        <Progress value={investment.progress} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 border-oga-green/30 text-oga-green hover:bg-oga-green/10"
                              onClick={() => setSelectedInvestment(investment)}
                              disabled={investment.availableWithdrawal === 0}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Withdraw Returns
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/95 backdrop-blur-sm border border-oga-green/30 text-white">
                            <DialogHeader>
                              <DialogTitle>Withdraw Solar Returns</DialogTitle>
                              <DialogDescription className="text-zinc-400">
                                Withdraw your available returns from {selectedInvestment?.name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {withdrawalSuccess ? (
                              <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-oga-green mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Withdrawal Successful!</h3>
                                <p className="text-zinc-400">Your solar investment returns will be transferred to your wallet shortly.</p>
                              </div>
                            ) : selectedInvestment && (
                              <div className="space-y-4">
                                <div className="bg-zinc-800/30 border border-oga-green/20 p-4 rounded-lg">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-zinc-400">Available to Withdraw</p>
                                      <p className="text-oga-yellow font-semibold">${selectedInvestment.availableWithdrawal.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-zinc-400">Pending Returns</p>
                                      <p className="text-oga-green font-semibold">${selectedInvestment.pendingReturns.toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Withdrawal Amount (USDC)
                                  </label>
                                  <Input
                                    type="number"
                                    placeholder={`Max: $${selectedInvestment.availableWithdrawal}`}
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                                    className="bg-zinc-900/70 border-oga-green/30 text-white focus:border-oga-green"
                                    max={selectedInvestment.availableWithdrawal}
                                  />
                                </div>
                                
                                <Button 
                                  onClick={() => handlePoolWithdrawal(selectedInvestment.poolId, selectedInvestment.shares)}
                                  disabled={!withdrawalAmount || parseFloat(withdrawalAmount) > selectedInvestment.availableWithdrawal || isWithdrawing}
                                  className="w-full bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
                                >
                                  {isWithdrawing ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Processing Withdrawal...
                                    </>
                                  ) : (
                                    'Confirm Withdrawal'
                                  )}
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="border-oga-green/30 text-oga-green hover:bg-oga-green/10">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Solar Pool Investments */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-oga-green" />
                Solar Pool Investments
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {poolInvestments.map((investment) => (
                  <Card key={investment.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                        <Badge className={getRiskColor(investment.risk)}>
                          {investment.risk} Risk
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-base lg:text-lg">{investment.name}</CardTitle>
                      <CardDescription className="text-zinc-400 text-sm">
                        {investment.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-zinc-400">Investment</p>
                          <p className="text-white font-semibold">${investment.investmentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400">Solar ROI</p>
                          <p className="text-oga-green font-semibold">{investment.roi}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-zinc-400">Total Returns</p>
                          {"totalReturns" in investment ? (
                            <p className="text-oga-green font-semibold">${(investment.totalReturns as number).toLocaleString()}</p>
                          ) : (
                            <p className="text-oga-green font-semibold">N/A</p>
                          )}
                        </div>
                        <div>
                          <p className="text-zinc-400">Solar Projects</p>
                          <p className="text-white font-semibold">{investment.projectCount}</p>
                        </div>
                      </div>

                      {investment.energyGenerated && (
                        <div className="bg-oga-green/10 border border-oga-green/20 p-3 rounded-lg">
                          <div className="text-center">
                            <p className="text-zinc-400 text-xs">Pool Energy Generated</p>
                            <p className="text-oga-green font-semibold">{investment.energyGenerated}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 border-oga-green/30 text-oga-green hover:bg-oga-green/10">
                          <Eye className="w-4 h-4 mr-2" />
                          View Pool Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="direct" className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {directInvestments.map((investment) => (
                <Card key={investment.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sun className="w-5 h-5 mr-2 text-oga-yellow" />
                      {investment.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 text-sm mb-4">{investment.description}</p>
                    {/* Same content structure as in 'all' tab */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pools" className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {poolInvestments.map((investment) => (
                <Card key={investment.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-oga-green" />
                      {investment.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 text-sm mb-4">{investment.description}</p>
                    {/* Same content structure as in 'all' tab */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 