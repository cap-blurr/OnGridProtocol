"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  LineChart,
  Wallet,
  CalendarDays,
  DollarSign,
  BarChart3,
  History,
} from "lucide-react";
import Link from "next/link";

// Mock data for current investments
const mockInvestments = {
  totalInvested: 385000,
  totalProjects: 5,
  averageRoi: 12.7,
  directInvestments: [
    {
      id: "proj-1",
      name: "California Solar Farm",
      type: "Solar",
      investmentAmount: 125000,
      dateInvested: "2024-03-15",
      roi: 14.5,
      status: "Active",
      duration: "5 years",
      nextPayment: "2024-07-15",
      progress: 22,
      description: "Large-scale solar farm in Southern California with 50MW capacity",
    },
    {
      id: "proj-2",
      name: "Texas Wind Farm",
      type: "Wind",
      investmentAmount: 78000,
      dateInvested: "2024-02-10",
      roi: 12.8,
      status: "Active",
      duration: "7 years",
      nextPayment: "2024-06-10",
      progress: 12,
      description: "Wind energy project with 25 turbines in West Texas",
    },
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
    },
    {
      id: "pool-2",
      name: "Growth Developer Pool",
      investmentAmount: 65000,
      dateInvested: "2024-01-20",
      roi: 12.7,
      status: "Active",
      risk: "Medium",
      nextPayment: "2024-06-20",
      projectCount: 8,
      description: "Medium-risk pool with growing developers showing promising growth potential",
    },
    {
      id: "pool-3",
      name: "Innovation Developer Pool",
      investmentAmount: 42000,
      dateInvested: "2024-05-05",
      roi: 18.5,
      status: "Active",
      risk: "High",
      nextPayment: "2024-08-05",
      projectCount: 6,
      description: "High-risk pool with emerging developers pioneering new technologies",
    },
  ],
  recentPayments: [
    {
      id: 1,
      project: "California Solar Farm",
      amount: 1510.42,
      date: "2024-06-15",
      type: "Interest Payment",
    },
    {
      id: 2,
      project: "Premium Developer Pool",
      amount: 531.25,
      date: "2024-06-01",
      type: "Dividend",
    },
    {
      id: 3,
      project: "Texas Wind Farm",
      amount: 832.50,
      date: "2024-05-10",
      type: "Interest Payment",
    },
    {
      id: 4,
      project: "Growth Developer Pool",
      amount: 688.54,
      date: "2024-05-20",
      type: "Dividend",
    },
  ],
};

export default function CurrentInvestmentsPage() {
  const [activeTab, setActiveTab] = useState("all");

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

  return (
    <div className="relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative">
        <div className="mb-8 relative pl-6">
          {/* Thin accent line */}
          <div className="absolute -left-4 top-0 h-full w-px bg-emerald-700/30" />
          
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-emerald-500 mb-2 relative">
            Investments
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
          </span>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Current Investments
          </h1>
          <p className="text-zinc-400">
            Monitor your active investments and portfolio performance
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Invested
              </CardTitle>
              <Wallet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                ${mockInvestments.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400">
                Across {mockInvestments.totalProjects} projects
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Average ROI/APR
              </CardTitle>
              <LineChart className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockInvestments.averageRoi}%
              </div>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-400">2.3% higher than market average</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Next Payment
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                $1,510.42
              </div>
              <p className="text-xs text-emerald-400">
                Due on July 15, 2024
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investments Table */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/50 border border-zinc-800 p-1 w-full flex">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5 hover:text-emerald-300 transition-colors"
            >
              All Investments
            </TabsTrigger>
            <TabsTrigger 
              value="direct" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5 hover:text-emerald-300 transition-colors"
            >
              Direct Projects
            </TabsTrigger>
            <TabsTrigger 
              value="pools" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5 hover:text-emerald-300 transition-colors"
            >
              Investment Pools
            </TabsTrigger>
          </TabsList>

          {/* All Investments Tab */}
          <TabsContent value="all">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  Investment Portfolio
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  All your active investments in both direct projects and pools
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-white">Direct Project Investments</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockInvestments.directInvestments.map((investment) => (
                      <div 
                        key={investment.id} 
                        className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors rounded-lg p-4 overflow-hidden"
                      >
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                        
                        <div className="flex justify-between items-start relative">
                          <div>
                            <Link href={`/dashboard/investments/details/${investment.id}`} className="text-lg font-medium text-white hover:text-emerald-300 transition-colors">
                              {investment.name}
                            </Link>
                            <p className="text-sm text-zinc-400 mt-1">{investment.description}</p>
                          </div>
                          <Badge variant="outline" className={`${getStatusColor(investment.status)} font-medium`}>
                            {investment.status}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4 relative">
                          <div>
                            <p className="text-xs text-zinc-400">Investment Amount</p>
                            <p className="text-base font-medium text-white">${investment.investmentAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-400">ROI/APR</p>
                            <p className="text-base font-medium text-emerald-400">{investment.roi}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-400">Next Payment</p>
                            <p className="text-base font-medium text-white">{investment.nextPayment}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-400">Duration</p>
                            <p className="text-base font-medium text-white">{investment.duration}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 relative">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-zinc-400">Project Progress</span>
                            <span className="text-zinc-300">{investment.progress}%</span>
                          </div>
                          <Progress value={investment.progress} className="h-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
                        </div>
                        
                        <div className="mt-4 flex justify-end relative">
                          <Button variant="outline" size="sm" className="border-emerald-800 hover:border-emerald-500 hover:bg-emerald-900/20 hover:text-emerald-300 text-emerald-400 transition-colors">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mt-8">Pool Investments</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {mockInvestments.poolInvestments.map((pool) => (
                      <div 
                        key={pool.id} 
                        className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors rounded-lg p-4 overflow-hidden"
                      >
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                        
                        <div className="flex justify-between items-start relative">
                          <div>
                            <h4 className="text-base font-medium text-white">{pool.name}</h4>
                            <Badge variant="outline" className={`${getRiskColor(pool.risk)} font-medium`}>
                              {pool.risk} Risk
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-medium">{pool.roi}%</p>
                            <p className="text-xs text-zinc-400">APR</p>
                          </div>
                        </div>
                        
                        <p className="text-xs text-zinc-400 mt-2 h-10 line-clamp-2 relative">{pool.description}</p>
                        
                        <div className="mt-4 space-y-2 relative">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Investment</span>
                            <span className="text-white font-medium">${pool.investmentAmount.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Projects</span>
                            <span className="text-white font-medium">{pool.projectCount}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Next Payment</span>
                            <span className="text-white font-medium">{pool.nextPayment}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end relative">
                          <Button variant="outline" size="sm" className="border-emerald-800 hover:border-emerald-500 hover:bg-emerald-900/20 hover:text-emerald-300 text-emerald-400 transition-colors">
                            View Pool
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Direct Investments Tab */}
          <TabsContent value="direct">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wallet className="h-5 w-5 text-emerald-500" />
                  Direct Project Investments
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your investments in specific renewable energy projects
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockInvestments.directInvestments.map((investment) => (
                    <div 
                      key={investment.id} 
                      className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors rounded-lg p-4 overflow-hidden"
                    >
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                      
                      <div className="flex justify-between items-start relative">
                        <div>
                          <Link href={`/dashboard/investments/details/${investment.id}`} className="text-lg font-medium text-white hover:text-emerald-300 transition-colors">
                            {investment.name}
                          </Link>
                          <p className="text-sm text-zinc-400 mt-1">{investment.description}</p>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(investment.status)} font-medium`}>
                          {investment.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 relative">
                        <div>
                          <p className="text-xs text-zinc-400">Investment Amount</p>
                          <p className="text-base font-medium text-white">${investment.investmentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">ROI/APR</p>
                          <p className="text-base font-medium text-emerald-400">{investment.roi}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Next Payment</p>
                          <p className="text-base font-medium text-white">{investment.nextPayment}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Duration</p>
                          <p className="text-base font-medium text-white">{investment.duration}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 relative">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-400">Project Progress</span>
                          <span className="text-zinc-300">{investment.progress}%</span>
                        </div>
                        <Progress value={investment.progress} className="h-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
                      </div>
                      
                      <div className="mt-4 flex justify-end relative">
                        <Button variant="outline" size="sm" className="border-emerald-800 hover:border-emerald-500 hover:bg-emerald-900/20 hover:text-emerald-300 text-emerald-400 transition-colors">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pool Investments Tab */}
          <TabsContent value="pools">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <LineChart className="h-5 w-5 text-emerald-500" />
                  Investment Pool Allocations
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your investments in diversified renewable energy pools
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {mockInvestments.poolInvestments.map((pool) => (
                    <div 
                      key={pool.id} 
                      className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors rounded-lg p-4 overflow-hidden"
                    >
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                      
                      <div className="flex justify-between items-start relative">
                        <div>
                          <h4 className="text-base font-medium text-white">{pool.name}</h4>
                          <Badge variant="outline" className={`${getRiskColor(pool.risk)} font-medium`}>
                            {pool.risk} Risk
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-medium">{pool.roi}%</p>
                          <p className="text-xs text-zinc-400">APR</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-zinc-400 mt-2 relative">{pool.description}</p>
                      
                      <div className="mt-4 space-y-2 relative">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Investment</span>
                          <span className="text-white font-medium">${pool.investmentAmount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Projects</span>
                          <span className="text-white font-medium">{pool.projectCount}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Next Payment</span>
                          <span className="text-white font-medium">{pool.nextPayment}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end relative">
                        <Button variant="outline" size="sm" className="border-emerald-800 hover:border-emerald-500 hover:bg-emerald-900/20 hover:text-emerald-300 text-emerald-400 transition-colors">
                          View Pool
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recent Payments */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden mt-8">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-white">
              <History className="h-5 w-5 text-emerald-500" />
              Recent Payments
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Your latest payment receipts from investments
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              {mockInvestments.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-emerald-900/30 bg-black/50 rounded-lg hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{payment.project}</h4>
                      <p className="text-xs text-zinc-400">{payment.type} • {payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-medium">${payment.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 