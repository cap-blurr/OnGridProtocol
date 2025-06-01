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
  Clock
} from "lucide-react";
import Link from "next/link";

// Enhanced mock data for current investments
const mockInvestments = {
  totalInvested: 385000,
  totalProjects: 5,
  averageRoi: 12.7,
  totalReturns: 48750,
  availableWithdrawals: 12500,
  pendingReturns: 8750,
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
      capacity: "50 MW"
    },
    {
      id: "proj-2",
      name: "Kano Wind Farm Project",
      type: "Wind",
      investmentAmount: 78000,
      dateInvested: "2024-02-10",
      roi: 12.8,
      status: "Active",
      duration: "20 months",
      nextPayment: "2024-06-10",
      progress: 35,
      description: "Wind energy project harnessing northern winds for sustainable power",
      totalReturns: 12480,
      availableWithdrawal: 4160,
      pendingReturns: 2080,
      location: "Kano, Nigeria",
      capacity: "40 MW"
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
      capacity: "75 MW"
    }
  ],
  poolInvestments: [
    {
      id: "pool-1",
      name: "Premium Developer Pool",
      investmentAmount: 75000,
      dateInvested: "2024-04-01",
      roi: 8.5,
      status: "Active",
      risk: "Low",
      nextPayment: "2024-07-01",
      projectCount: 12,
      description: "Low-risk pool of premium developer projects with established track records",
      totalReturns: 5312,
      availableWithdrawal: 0,
      pendingReturns: 0
    },
    {
      id: "pool-2",
      name: "Growth Developer Pool",
      investmentAmount: 42000,
      dateInvested: "2024-01-20",
      roi: 12.7,
      status: "Active",
      risk: "Medium",
      nextPayment: "2024-06-20",
      projectCount: 8,
      description: "Medium-risk pool with growing developers showing promising growth potential",
      totalReturns: 4452,
      availableWithdrawal: 0,
      pendingReturns: 0
    }
  ],
  recentPayments: [
    {
      id: 1,
      project: "Lagos Solar Farm Alpha",
      amount: 1510.42,
      date: "2024-06-15",
      type: "Interest Payment",
      status: "Completed"
    },
    {
      id: 2,
      project: "Premium Developer Pool",
      amount: 531.25,
      date: "2024-06-01",
      type: "Dividend",
      status: "Completed"
    },
    {
      id: 3,
      project: "Kano Wind Farm Project",
      amount: 832.50,
      date: "2024-05-10",
      type: "Interest Payment",
      status: "Completed"
    },
    {
      id: 4,
      project: "Growth Developer Pool",
      amount: 688.54,
      date: "2024-05-20",
      type: "Dividend",
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
        return "bg-emerald-500/20 text-emerald-500 border-emerald-700";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-700";
      case "Completed":
        return "bg-blue-500/20 text-blue-500 border-blue-700";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-600";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/20 text-green-500 border-green-700";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-700";
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
        <p className="text-gray-400">Please connect your wallet to view your investments</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Current Investments</h1>
        <p className="text-zinc-400">
          Monitor your active investments and manage your returns
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Invested
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${mockInvestments.totalInvested.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-400">
              Across {mockInvestments.totalProjects} projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Returns
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${mockInvestments.totalReturns.toLocaleString()}
            </div>
            <p className="text-xs text-green-400">
              {((mockInvestments.totalReturns / mockInvestments.totalInvested) * 100).toFixed(1)}% total return
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Available to Withdraw
            </CardTitle>
            <Download className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${mockInvestments.availableWithdrawals.toLocaleString()}
            </div>
            <p className="text-xs text-blue-400">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Average ROI
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {mockInvestments.averageRoi}%
            </div>
            <p className="text-xs text-yellow-400">
              Annual return rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600">
            All Investments
          </TabsTrigger>
          <TabsTrigger value="direct" className="data-[state=active]:bg-emerald-600">
            Direct Projects
          </TabsTrigger>
          <TabsTrigger value="pools" className="data-[state=active]:bg-emerald-600">
            Pool Investments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Direct Investments */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Direct Project Investments</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockInvestments.directInvestments.map((investment) => (
                <Card key={investment.id} className="bg-gray-900/50 border-gray-700 hover:border-emerald-600/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(investment.status)}>
                        {investment.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {investment.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-white">{investment.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {investment.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Investment</p>
                        <p className="text-white font-semibold">${investment.investmentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">ROI</p>
                        <p className="text-emerald-400 font-semibold">{investment.roi}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Total Returns</p>
                        <p className="text-green-400 font-semibold">${investment.totalReturns.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Available</p>
                        <p className="text-blue-400 font-semibold">${investment.availableWithdrawal.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Project Progress</span>
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
                            className="flex-1 border-emerald-600 text-emerald-400 hover:bg-emerald-900/20"
                            onClick={() => setSelectedInvestment(investment)}
                            disabled={investment.availableWithdrawal === 0}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Withdraw Returns
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700 text-white">
                          <DialogHeader>
                            <DialogTitle>Withdraw Returns</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Withdraw your available returns from {selectedInvestment?.name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {withdrawalSuccess ? (
                            <div className="text-center py-8">
                              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-white mb-2">Withdrawal Successful!</h3>
                              <p className="text-gray-400">Your funds will be transferred to your wallet shortly.</p>
                            </div>
                          ) : selectedInvestment && (
                            <div className="space-y-4">
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-400">Available to Withdraw</p>
                                    <p className="text-blue-400 font-semibold">${selectedInvestment.availableWithdrawal.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">Pending Returns</p>
                                    <p className="text-yellow-400 font-semibold">${selectedInvestment.pendingReturns.toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                  Withdrawal Amount (USDC)
                                </label>
                                <Input
                                  type="number"
                                  placeholder={`Max: $${selectedInvestment.availableWithdrawal}`}
                                  value={withdrawalAmount}
                                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                                  className="bg-gray-800 border-gray-600 text-white"
                                  max={selectedInvestment.availableWithdrawal}
                                />
                              </div>
                              
                              <Button 
                                onClick={handleWithdrawal}
                                disabled={!withdrawalAmount || parseFloat(withdrawalAmount) > selectedInvestment.availableWithdrawal || isWithdrawing}
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
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
                      
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pool Investments */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Pool Investments</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockInvestments.poolInvestments.map((investment) => (
                <Card key={investment.id} className="bg-gray-900/50 border-gray-700 hover:border-emerald-600/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(investment.status)}>
                        {investment.status}
                      </Badge>
                      <Badge className={getRiskColor(investment.risk)}>
                        {investment.risk} Risk
                      </Badge>
                    </div>
                    <CardTitle className="text-white">{investment.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {investment.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Investment</p>
                        <p className="text-white font-semibold">${investment.investmentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">ROI</p>
                        <p className="text-emerald-400 font-semibold">{investment.roi}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Projects</p>
                        <p className="text-white font-semibold">{investment.projectCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Total Returns</p>
                        <p className="text-green-400 font-semibold">${investment.totalReturns.toLocaleString()}</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                      <Eye className="w-4 h-4 mr-2" />
                      View Pool Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="direct" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockInvestments.directInvestments.map((investment) => (
              <Card key={investment.id} className="bg-gray-900/50 border-gray-700">
                {/* Same content as above for direct investments */}
                <CardHeader>
                  <CardTitle className="text-white">{investment.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {investment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">Investment: ${investment.investmentAmount.toLocaleString()}</p>
                  <p className="text-sm text-emerald-400">ROI: {investment.roi}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pools" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockInvestments.poolInvestments.map((investment) => (
              <Card key={investment.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{investment.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {investment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">Investment: ${investment.investmentAmount.toLocaleString()}</p>
                  <p className="text-sm text-emerald-400">ROI: {investment.roi}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Payments */}
      <Card className="bg-gray-900/50 border-gray-700 mt-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <History className="w-5 h-5 mr-2" />
            Recent Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInvestments.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{payment.project}</p>
                  <p className="text-sm text-gray-400">{payment.type} • {payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">${payment.amount.toFixed(2)}</p>
                  <Badge className={getStatusColor(payment.status)} variant="outline">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 