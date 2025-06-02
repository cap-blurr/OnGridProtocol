"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePrivy } from '@privy-io/react-auth';
import { useUserType } from '@/providers/userType';
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
  Heart
} from "lucide-react";
import Link from "next/link";

// Enhanced mock data for current solar investments
const mockInvestments = {
  totalInvested: 385000,
  totalProjects: 5,
  averageRoi: 12.7,
  totalReturns: 48750,
  availableWithdrawals: 12500,
  pendingReturns: 8750,
  totalEnergyGenerated: 428, // MWh
  homesPowered: 95000,
  directInvestments: [
    {
      id: "proj-1",
      name: "Lagos Solar Farm Alpha",
      type: "Solar",
      investmentAmount: 125000,
      dateInvested: "2024-03-15",
      roi: 14.5,
      status: "Active",
      duration: "24 months",
      nextPayment: "2024-07-15",
      progress: 22,
      description: "Large-scale solar farm providing clean energy to 50,000 homes",
      totalReturns: 18750,
      availableWithdrawal: 6250,
      pendingReturns: 3125,
      location: "Lagos, Nigeria",
      capacity: "50 MW",
      energyGenerated: "125 MWh",
      homesPowered: 25000
    },
    {
      id: "proj-2",
      name: "Abuja Solar Microgrid",
      type: "Solar",
      investmentAmount: 78000,
      dateInvested: "2024-02-10",
      roi: 12.8,
      status: "Active",
      duration: "20 months",
      nextPayment: "2024-06-10",
      progress: 35,
      description: "Solar microgrid system powering residential communities in Abuja",
      totalReturns: 12480,
      availableWithdrawal: 4160,
      pendingReturns: 2080,
      location: "Abuja, Nigeria",
      capacity: "30 MW",
      energyGenerated: "89 MWh",
      homesPowered: 18000
    },
    {
      id: "proj-3",
      name: "Port Harcourt Industrial Solar",
      type: "Solar",
      investmentAmount: 95000,
      dateInvested: "2024-01-20",
      roi: 15.2,
      status: "Active",
      duration: "36 months",
      nextPayment: "2024-06-20",
      progress: 45,
      description: "Industrial-scale solar facility for manufacturing sector",
      totalReturns: 17570,
      availableWithdrawal: 2070,
      pendingReturns: 3545,
      location: "Port Harcourt, Nigeria",
      capacity: "75 MW",
      energyGenerated: "156 MWh",
      homesPowered: 32000
    }
  ],
  poolInvestments: [
    {
      id: "pool-1",
      name: "Premium Solar Pool",
      investmentAmount: 75000,
      dateInvested: "2024-04-01",
      roi: 8.5,
      status: "Active",
      risk: "Low",
      nextPayment: "2024-07-01",
      projectCount: 12,
      description: "Low-risk pool of premium solar projects with established track records",
      totalReturns: 5312,
      availableWithdrawal: 0,
      pendingReturns: 0,
      energyGenerated: "58 MWh",
      homesPowered: 20000
    },
    {
      id: "pool-2",
      name: "Growth Solar Pool",
      investmentAmount: 42000,
      dateInvested: "2024-01-20",
      roi: 12.7,
      status: "Active",
      risk: "Medium",
      nextPayment: "2024-06-20",
      projectCount: 8,
      description: "Medium-risk pool with growing solar developers showing promising growth potential",
      totalReturns: 4452,
      availableWithdrawal: 0,
      pendingReturns: 0,
      energyGenerated: "25 MWh"
    }
  ],
  recentPayments: [
    {
      id: 1,
      project: "Lagos Solar Farm Alpha",
      amount: 1510.42,
      date: "2024-06-15",
      type: "Solar Interest Payment",
      status: "Completed"
    },
    {
      id: 2,
      project: "Premium Solar Pool",
      amount: 531.25,
      date: "2024-06-01",
      type: "Solar Dividend",
      status: "Completed"
    },
    {
      id: 3,
      project: "Abuja Solar Microgrid",
      amount: 832.50,
      date: "2024-05-10",
      type: "Solar Interest Payment",
      status: "Completed"
    },
    {
      id: 4,
      project: "Growth Solar Pool",
      amount: 688.54,
      date: "2024-05-20",
      type: "Solar Dividend",
      status: "Pending"
    }
  ]
};

export default function CurrentInvestmentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  
  const { authenticated, ready } = usePrivy();
  const { userType } = useUserType();

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
        return "bg-red-500/20 text-red-500 border-red-700";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-600";
    }
  };

  const handleWithdrawal = async () => {
    if (!selectedInvestment || !withdrawalAmount) return;
    
    setIsWithdrawing(true);
    try {
      // Simulate withdrawal transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWithdrawalSuccess(true);
      setWithdrawalAmount("");
      
      // Reset after showing success
      setTimeout(() => {
        setWithdrawalSuccess(false);
        setSelectedInvestment(null);
      }, 2000);
      
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-oga-green" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-zinc-400">Please connect your wallet to view your solar investments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Current Solar Investments</h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                Monitor your active solar investments and manage your returns
              </p>
            </div>
            <div className="flex items-center space-x-2 text-oga-green">
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Solar Portfolio</span>
            </div>
          </div>
        </div>

        {/* Solar Impact Overview */}
        <div className="bg-oga-green/10 border border-oga-green/20 p-4 lg:p-6 rounded-lg mb-6 lg:mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <Sun className="w-8 h-8 text-oga-yellow mx-auto mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{mockInvestments.totalEnergyGenerated} MWh</div>
              <p className="text-xs text-oga-green">Clean Energy Generated</p>
            </div>
            <div>
              <Heart className="w-8 h-8 text-oga-green mx-auto mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{mockInvestments.homesPowered.toLocaleString()}</div>
              <p className="text-xs text-oga-green">Homes Powered</p>
            </div>
            <div>
              <Zap className="w-8 h-8 text-oga-yellow mx-auto mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{mockInvestments.totalProjects}</div>
              <p className="text-xs text-oga-green">Solar Projects</p>
            </div>
            <div>
              <TrendingUp className="w-8 h-8 text-oga-green mx-auto mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{mockInvestments.averageRoi}%</div>
              <p className="text-xs text-oga-green">Average Solar ROI</p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">
                Total Invested
              </CardTitle>
              <Wallet className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">
                ${mockInvestments.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-oga-green">
                Across {mockInvestments.totalProjects} solar projects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">
                Solar Returns
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">
                ${mockInvestments.totalReturns.toLocaleString()}
              </div>
              <p className="text-xs text-oga-green">
                {((mockInvestments.totalReturns / mockInvestments.totalInvested) * 100).toFixed(1)}% total return
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">
                Available to Withdraw
              </CardTitle>
              <Download className="h-4 w-4 text-oga-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">
                ${mockInvestments.availableWithdrawals.toLocaleString()}
              </div>
              <p className="text-xs text-oga-yellow">
                Ready for withdrawal
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">
                Average ROI
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">
                {mockInvestments.averageRoi}%
              </div>
              <p className="text-xs text-oga-green">
                Annual return rate
              </p>
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
                {mockInvestments.directInvestments.map((investment) => (
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
                          <p className="text-oga-green font-semibold">${investment.totalReturns.toLocaleString()}</p>
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
                                  onClick={handleWithdrawal}
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
                {mockInvestments.poolInvestments.map((investment) => (
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
                          <p className="text-oga-green font-semibold">${investment.totalReturns.toLocaleString()}</p>
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
              {mockInvestments.directInvestments.map((investment) => (
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
              {mockInvestments.poolInvestments.map((investment) => (
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