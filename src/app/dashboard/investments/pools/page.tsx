"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Users,
  ChevronUp,
  Percent,
  CreditCard,
  DollarSign,
  BarChart,
  ArrowUpRight,
  Info
} from "lucide-react";

// Mock data for investment pools
const mockPools = {
  yourInvestments: [
    {
      id: "pool-1",
      name: "Green Energy Growth Fund",
      risk: "Low",
      investmentAmount: 75000,
      dateInvested: "2024-04-01",
      roi: 8.5,
      status: "Active",
      nextPayment: "2024-07-01",
      projectCount: 12,
      description: "Low-risk pool of premium developer projects with established track records",
    },
    {
      id: "pool-2",
      name: "Renewable Innovation Fund",
      risk: "Medium",
      investmentAmount: 65000,
      dateInvested: "2024-01-20",
      roi: 12.7,
      status: "Active",
      nextPayment: "2024-06-20",
      projectCount: 8,
      description: "Medium-risk pool with growing developers showing promising growth potential",
    },
    {
      id: "pool-3",
      name: "Emerging Tech Fund",
      risk: "High",
      investmentAmount: 42000,
      dateInvested: "2024-05-05",
      roi: 18.5,
      status: "Active",
      nextPayment: "2024-08-05",
      projectCount: 6,
      description: "High-risk pool with emerging developers pioneering new technologies",
    },
  ],
  availablePools: [
    {
      id: "pool-4",
      name: "Solar Collective Fund",
      risk: "Low",
      target: 2000000,
      raised: 1450000,
      roi: { min: 6.5, max: 8.2 },
      duration: "5 years",
      description: "Diversified portfolio of established solar energy projects with stable returns.",
      projectCount: 15,
      minInvestment: 10000,
      focusArea: "Solar",
    },
    {
      id: "pool-5",
      name: "Wind Energy Accelerator",
      risk: "Medium",
      target: 1500000,
      raised: 980000,
      roi: { min: 9.5, max: 14.8 },
      duration: "7 years",
      description: "Investment in wind farm projects across multiple geographies for balanced exposure.",
      projectCount: 9,
      minInvestment: 15000,
      focusArea: "Wind",
    },
    {
      id: "pool-6",
      name: "Next-Gen Storage Solutions",
      risk: "High",
      target: 1000000,
      raised: 420000,
      roi: { min: 12.5, max: 22.0 },
      duration: "10 years",
      description: "High risk, high reward investments in breakthrough energy storage technologies.",
      projectCount: 6,
      minInvestment: 25000,
      focusArea: "Energy Storage",
    },
    {
      id: "pool-7",
      name: "Mixed Renewables Fund",
      risk: "Medium",
      target: 3000000,
      raised: 1250000,
      roi: { min: 8.5, max: 13.5 },
      duration: "8 years",
      description: "Balanced portfolio across various renewable energy sources for stability and growth.",
      projectCount: 18,
      minInvestment: 10000,
      focusArea: "Mixed",
    }
  ],
  poolPerformance: {
    totalInvested: 182000,
    totalPools: 3,
    averageRoi: 13.2,
    riskDistribution: {
      low: 41.2,
      medium: 35.7,
      high: 23.1
    },
    yearlyReturns: [
      { year: '2020', return: 10.2 },
      { year: '2021', return: 12.5 },
      { year: '2022', return: 11.8 },
      { year: '2023', return: 13.6 },
      { year: '2024', return: 13.2 },
    ]
  }
};

// Get risk badge color
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

// Get risk icon
const getRiskIcon = (risk: string) => {
  switch (risk) {
    case "Low":
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case "Medium":
      return <ShieldAlert className="h-5 w-5 text-yellow-500" />;
    case "High":
      return <ShieldAlert className="h-5 w-5 text-red-500" />;
    default:
      return <Info className="h-5 w-5 text-zinc-400" />;
  }
};

export default function InvestmentPoolsPage() {
  const [activeTab, setActiveTab] = useState("your-pools");

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
            Investment Pools
          </h1>
          <p className="text-zinc-400">
            Managed investment pools that diversify your clean energy portfolio
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Pool Investments
              </CardTitle>
              <CreditCard className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                ${mockPools.poolPerformance.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400">
                Across {mockPools.poolPerformance.totalPools} pools
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Average Pool ROI
              </CardTitle>
              <LineChart className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockPools.poolPerformance.averageRoi}%
              </div>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-400">Performing above market average</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Risk Distribution
              </CardTitle>
              <BarChart className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="flex space-x-1 h-6 mb-2">
                <div 
                  className="bg-green-500/50 rounded-l-sm" 
                  style={{ width: `${mockPools.poolPerformance.riskDistribution.low}%` }}
                  title="Low Risk"
                ></div>
                <div 
                  className="bg-yellow-500/50" 
                  style={{ width: `${mockPools.poolPerformance.riskDistribution.medium}%` }}
                  title="Medium Risk"
                ></div>
                <div 
                  className="bg-red-500/50 rounded-r-sm" 
                  style={{ width: `${mockPools.poolPerformance.riskDistribution.high}%` }}
                  title="High Risk"
                ></div>
              </div>
              <div className="flex text-xs justify-between">
                <span className="text-green-400">{mockPools.poolPerformance.riskDistribution.low}% Low</span>
                <span className="text-yellow-400">{mockPools.poolPerformance.riskDistribution.medium}% Med</span>
                <span className="text-red-400">{mockPools.poolPerformance.riskDistribution.high}% High</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Pool Tabs */}
        <Tabs defaultValue="your-pools" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/50 border border-zinc-800 p-1 w-full flex">
            <TabsTrigger 
              value="your-pools" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5 hover:text-emerald-300 transition-colors"
            >
              Your Pool Investments
            </TabsTrigger>
            <TabsTrigger 
              value="available-pools" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5 hover:text-emerald-300 transition-colors"
            >
              Available Pools
            </TabsTrigger>
          </TabsList>
          
          {/* Your Pool Investments Tab */}
          <TabsContent value="your-pools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPools.yourInvestments.map(pool => (
                <Card key={pool.id} className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                  
                  <CardHeader className="relative p-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={getRiskColor(pool.risk)}>
                        {pool.risk} Risk
                      </Badge>
                      <Badge variant="outline" className="bg-emerald-900/30 text-emerald-300 border-emerald-700">
                        {pool.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg mt-2">{pool.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {pool.projectCount} Projects
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative p-4 pt-0">
                    <p className="text-zinc-300 text-sm mb-4">{pool.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-zinc-400">Investment Amount</p>
                        <p className="text-base font-medium text-white">${pool.investmentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">ROI/APR</p>
                        <p className="text-base font-medium text-emerald-400">{pool.roi}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Date Invested</p>
                        <p className="text-sm text-white">{pool.dateInvested}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Next Payment</p>
                        <p className="text-sm text-white">{pool.nextPayment}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="relative border-t border-zinc-800/50 px-4 py-3 flex justify-between">
                    <Button size="sm" variant="outline" className="text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-900/20 hover:text-emerald-300 hover:border-emerald-500 transition-colors">
                      Pool Details
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-900/20 hover:text-emerald-300 hover:border-emerald-500 transition-colors">
                      Add Investment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
              
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden mt-8">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Percent className="h-5 w-5 text-emerald-500" />
                  Pool Performance History
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Year-over-year returns on your pool investments
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="h-60 flex items-end justify-between gap-2">
                  {mockPools.poolPerformance.yearlyReturns.map((data, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-16 bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors rounded-t-md border border-emerald-600/50 relative group" 
                        style={{ height: `${(data.return / 20) * 100}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 border border-emerald-600/50 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                          {data.return}% ROI
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                          {data.return}%
                        </div>
                      </div>
                      <span className="text-xs text-zinc-300 font-medium">{data.year}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Available Pools Tab */}
          <TabsContent value="available-pools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPools.availablePools.map(pool => (
                <Card key={pool.id} className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                  
                  <CardHeader className="relative p-4">
                    <div className="flex justify-between items-center">
                      {getRiskIcon(pool.risk)}
                      <Badge variant="outline" className={getRiskColor(pool.risk)}>
                        {pool.risk} Risk
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg mt-2">{pool.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {pool.focusArea} • {pool.projectCount} Projects • {pool.duration}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-3 p-4 pt-0">
                    <p className="text-zinc-300 text-sm line-clamp-2">{pool.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-emerald-400">{Math.round((pool.raised / pool.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(pool.raised / pool.target) * 100} 
                        className="h-1.5 bg-zinc-800" 
                        indicatorClassName="bg-emerald-500" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <p className="text-xs text-zinc-400">ROI Range</p>
                        <p className="text-sm font-medium text-emerald-400">{pool.roi.min}% - {pool.roi.max}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Target</p>
                        <p className="text-sm font-medium text-white">${pool.target.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Minimum</p>
                        <p className="text-sm font-medium text-white">${pool.minInvestment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Raised</p>
                        <p className="text-sm font-medium text-emerald-400">${pool.raised.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="relative border-t border-zinc-800/50 px-4 py-3">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white hover:text-white w-full group transition-colors">
                      Invest Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Information Card */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden mt-8">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-white">
              <Info className="h-5 w-5 text-emerald-500" />
              About Investment Pools
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-emerald-400 font-medium">Diversification</h3>
                <p className="text-zinc-300 text-sm">Investment pools distribute your investment across multiple projects, reducing risk while maintaining competitive returns.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-emerald-400 font-medium">Risk Management</h3>
                <p className="text-zinc-300 text-sm">Choose from low, medium, or high-risk pools based on your investment strategy and risk tolerance.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-emerald-400 font-medium">Professional Management</h3>
                <p className="text-zinc-300 text-sm">Each pool is managed by investment professionals who select projects based on rigorous criteria.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 