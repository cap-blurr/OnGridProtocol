"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  BarChart3,
  BarChart4,
  PieChart,
  Calendar,
  TrendingUp,
  Percent,
  DollarSign,
  ChevronUp,
  ChevronDown,
  Clock
} from "lucide-react";

// Mock data for ROI analytics
const mockAnalytics = {
  overview: {
    totalInvested: 385000,
    totalReturns: 52500,
    overallRoi: 13.6,
    roiChange: 2.3,
    annualizedReturns: 11.8,
    volatility: 3.2,
    timeInvestmentWeighted: 9.7
  },
  monthlyReturns: [
    { month: "Jan", roi: 0.9 },
    { month: "Feb", roi: 1.2 },
    { month: "Mar", roi: 0.8 },
    { month: "Apr", roi: 1.4 },
    { month: "May", roi: 1.1 },
    { month: "Jun", roi: 0.7 },
    { month: "Jul", roi: 1.5 },
    { month: "Aug", roi: 1.3 },
    { month: "Sep", roi: 0.6 },
    { month: "Oct", roi: 1.2 },
    { month: "Nov", roi: 1.0 },
    { month: "Dec", roi: 1.9 }
  ],
  projectReturns: [
    { name: "California Solar Farm", roi: 14.5, invested: 125000, returns: 18125 },
    { name: "Texas Wind Farm", roi: 12.8, invested: 78000, returns: 9984 },
    { name: "Green Energy Pool A", roi: 8.5, invested: 75000, returns: 6375 },
    { name: "Growth Developer Pool", roi: 12.7, invested: 65000, returns: 8255 },
    { name: "Innovation Developer Pool", roi: 18.5, invested: 42000, returns: 7770 }
  ],
  assetTypeReturns: [
    { type: "Solar", roi: 13.8, allocation: 37 },
    { type: "Wind", roi: 12.3, allocation: 24 },
    { type: "Hydro", roi: 9.5, allocation: 12 },
    { type: "Biomass", roi: 10.2, allocation: 8 },
    { type: "Mixed", roi: 11.7, allocation: 19 }
  ],
  riskLevelReturns: [
    { risk: "Low", roi: 8.4, allocation: 40 },
    { risk: "Medium", roi: 12.5, allocation: 35 },
    { risk: "High", roi: 19.2, allocation: 25 }
  ],
  benchmarkComparison: [
    { year: "2020", portfolio: 9.5, sp500: 18.4, bonds: 7.5, greenIndex: 8.9 },
    { year: "2021", portfolio: 11.2, sp500: 28.7, bonds: 3.5, greenIndex: 12.3 },
    { year: "2022", portfolio: 10.8, sp500: -19.4, bonds: -13.1, greenIndex: 4.5 },
    { year: "2023", portfolio: 13.1, sp500: 24.2, bonds: 6.8, greenIndex: 17.2 },
    { year: "2024", portfolio: 13.6, sp500: 8.7, bonds: 3.2, greenIndex: 14.8 }
  ]
};

export default function RoiAnalyticsPage() {
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
            ROI Analytics
          </h1>
          <p className="text-zinc-400">
            Detailed analysis of your investment performance and returns
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Overall ROI
              </CardTitle>
              <LineChart className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockAnalytics.overview.overallRoi}%
              </div>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-400">+{mockAnalytics.overview.roiChange}% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Returns
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                ${mockAnalytics.overview.totalReturns.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-400">
                On ${mockAnalytics.overview.totalInvested.toLocaleString()} invested
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Annualized Return
              </CardTitle>
              <Calendar className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockAnalytics.overview.annualizedReturns}%
              </div>
              <p className="text-xs text-emerald-400">
                Time-weighted return
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Volatility
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockAnalytics.overview.volatility}%
              </div>
              <p className="text-xs text-zinc-400">
                Standard deviation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Content */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-black/50 border border-zinc-800 p-1 w-full flex">
            <TabsTrigger 
              value="performance" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="by-project" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5"
            >
              By Project
            </TabsTrigger>
            <TabsTrigger 
              value="by-asset" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5"
            >
              By Asset Type
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5"
            >
              Benchmark
            </TabsTrigger>
          </TabsList>
          
          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <LineChart className="h-5 w-5 text-emerald-500" />
                    Monthly ROI Performance
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Return on investment month by month
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="h-64 flex items-end justify-between gap-1">
                    {mockAnalytics.monthlyReturns.map((month, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div 
                          className="w-7 bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors rounded-t-sm border border-emerald-600/50 relative group" 
                          style={{ height: `${(month.roi / 2) * 100}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 border border-emerald-600/50 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                            {month.roi}% ROI
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400">{month.month}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 border-t border-zinc-800/50 pt-4">
                    <div>
                      <p className="text-sm text-zinc-400">Average Monthly ROI</p>
                      <p className="text-lg font-medium text-white">1.13%</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-700">
                      All Positive Months
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <PieChart className="h-5 w-5 text-emerald-500" />
                    Risk-Based Performance
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Return by risk category
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid grid-cols-1 gap-4">
                    {mockAnalytics.riskLevelReturns.map((risk, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Badge variant="outline" 
                              className={`mr-2 ${
                                risk.risk === "Low" 
                                  ? "bg-green-500/10 text-green-500 border-green-700" 
                                  : risk.risk === "Medium"
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-700"
                                    : "bg-red-500/10 text-red-500 border-red-700"
                              }`}>
                              {risk.risk} Risk
                            </Badge>
                            <span className="text-zinc-300">{risk.allocation}% of portfolio</span>
                          </div>
                          <span className="text-lg font-medium text-emerald-400">{risk.roi}% ROI</span>
                        </div>
                        
                        <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              risk.risk === "Low" 
                                ? "bg-green-500/60" 
                                : risk.risk === "Medium"
                                  ? "bg-yellow-500/60"
                                  : "bg-red-500/60"
                            }`}
                            style={{ width: `${(risk.roi / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 border-t border-zinc-800/50 pt-4">
                    <p className="text-zinc-400 text-sm mb-2">Risk/Return Analysis</p>
                    <p className="text-white text-sm">
                      Higher-risk investments are yielding significantly better returns, with the high-risk category outperforming low-risk investments by 10.8 percentage points.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden mt-6">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  ROI Metrics Explained
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-emerald-400 font-medium">Overall ROI</h3>
                    <p className="text-zinc-300 text-sm">
                      Measures the total percentage return on your investments, calculated as (Current Value - Initial Investment) / Initial Investment × 100%.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-emerald-400 font-medium">Annualized Return</h3>
                    <p className="text-zinc-300 text-sm">
                      Standardizes returns over a yearly period, allowing for comparison between investments held for different time periods.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-emerald-400 font-medium">Volatility</h3>
                    <p className="text-zinc-300 text-sm">
                      Measures the degree of variation in returns, with lower volatility indicating more stable and predictable returns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* By Project Tab */}
          <TabsContent value="by-project">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Percent className="h-5 w-5 text-emerald-500" />
                  Project-Specific Returns
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  ROI breakdown by individual investment
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-6">
                  {mockAnalytics.projectReturns.map((project, index) => (
                    <div key={index} className="p-4 border border-zinc-800/50 rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white text-lg">{project.name}</h3>
                        <Badge variant="outline" className="bg-emerald-900/20 text-emerald-400 border-emerald-700">
                          {project.roi}% ROI
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        <div>
                          <p className="text-xs text-zinc-400">Investment Amount</p>
                          <p className="text-base font-medium text-white">${project.invested.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Returns</p>
                          <p className="text-base font-medium text-emerald-400">+${project.returns.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Portfolio %</p>
                          <p className="text-base font-medium text-white">{Math.round((project.invested / mockAnalytics.overview.totalInvested) * 100)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Contribution to Overall ROI</p>
                          <p className="text-base font-medium text-white">{((project.roi * project.invested) / mockAnalytics.overview.totalInvested).toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500"
                          style={{ width: `${(project.roi / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* By Asset Type Tab */}
          <TabsContent value="by-asset">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart4 className="h-5 w-5 text-emerald-500" />
                  Asset Type Performance
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  ROI breakdown by energy technology
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart visualization */}
                  <div className="flex flex-col justify-center p-4 bg-black/30 rounded-lg border border-zinc-800/50">
                    <div className="h-60 flex items-end justify-between gap-3">
                      {mockAnalytics.assetTypeReturns.map((asset, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-emerald-500/40 hover:bg-emerald-500/60 rounded-t-sm border border-emerald-600/50 relative group" 
                            style={{ height: `${(asset.roi / 15) * 100}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 border border-emerald-600/50 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                              {asset.roi}% ROI | {asset.allocation}% of portfolio
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                              {asset.roi}%
                            </div>
                          </div>
                          <span className="text-xs text-zinc-400 mt-2">{asset.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Data table */}
                  <div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800/70">
                          <th className="py-2 text-left text-zinc-400 text-sm">Asset Type</th>
                          <th className="py-2 text-left text-zinc-400 text-sm">Allocation</th>
                          <th className="py-2 text-left text-zinc-400 text-sm">ROI</th>
                          <th className="py-2 text-left text-zinc-400 text-sm">vs. Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAnalytics.assetTypeReturns.map((asset, index) => (
                          <tr key={index} className="border-b border-zinc-800/30">
                            <td className="py-3 text-white">{asset.type}</td>
                            <td className="py-3 text-white">{asset.allocation}%</td>
                            <td className="py-3 text-emerald-400">{asset.roi}%</td>
                            <td className="py-3">
                              {asset.roi > mockAnalytics.overview.overallRoi ? (
                                <span className="flex items-center text-green-500">
                                  <ChevronUp className="h-3 w-3 mr-1" />
                                  {(asset.roi - mockAnalytics.overview.overallRoi).toFixed(1)}%
                                </span>
                              ) : (
                                <span className="flex items-center text-red-500">
                                  <ChevronDown className="h-3 w-3 mr-1" />
                                  {(mockAnalytics.overview.overallRoi - asset.roi).toFixed(1)}%
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="mt-6 p-3 bg-black/30 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Key Insights</h4>
                      <ul className="text-sm text-zinc-300 space-y-1 list-disc list-inside">
                        <li>Solar technologies provide the highest returns at 13.8%</li>
                        <li>Hydro shows lowest performance but still yields positive returns</li>
                        <li>Consider increasing allocation to higher-performing asset types</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Benchmark Comparison Tab */}
          <TabsContent value="comparison">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <LineChart className="h-5 w-5 text-emerald-500" />
                  Benchmark Comparison
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Performance compared to traditional and green investment indices
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-zinc-800/70">
                        <th className="py-3 text-left text-zinc-400 text-sm">Year</th>
                        <th className="py-3 text-left text-zinc-400 text-sm">Your Portfolio</th>
                        <th className="py-3 text-left text-zinc-400 text-sm">S&P 500</th>
                        <th className="py-3 text-left text-zinc-400 text-sm">Bond Index</th>
                        <th className="py-3 text-left text-zinc-400 text-sm">Green Energy Index</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAnalytics.benchmarkComparison.map((year, index) => (
                        <tr key={index} className="border-b border-zinc-800/30">
                          <td className="py-3 font-medium text-white">{year.year}</td>
                          <td className="py-3 text-emerald-400">{year.portfolio}%</td>
                          <td className={`py-3 ${year.sp500 >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {year.sp500 >= 0 ? '+' : ''}{year.sp500}%
                          </td>
                          <td className={`py-3 ${year.bonds >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {year.bonds >= 0 ? '+' : ''}{year.bonds}%
                          </td>
                          <td className={`py-3 ${year.greenIndex >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {year.greenIndex >= 0 ? '+' : ''}{year.greenIndex}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-zinc-900/30">
                        <td className="py-3 font-medium text-white">5-Year Avg</td>
                        <td className="py-3 font-medium text-emerald-400">
                          {(mockAnalytics.benchmarkComparison.reduce((sum, year) => sum + year.portfolio, 0) / mockAnalytics.benchmarkComparison.length).toFixed(1)}%
                        </td>
                        <td className="py-3 font-medium text-white">
                          {(mockAnalytics.benchmarkComparison.reduce((sum, year) => sum + year.sp500, 0) / mockAnalytics.benchmarkComparison.length).toFixed(1)}%
                        </td>
                        <td className="py-3 font-medium text-white">
                          {(mockAnalytics.benchmarkComparison.reduce((sum, year) => sum + year.bonds, 0) / mockAnalytics.benchmarkComparison.length).toFixed(1)}%
                        </td>
                        <td className="py-3 font-medium text-white">
                          {(mockAnalytics.benchmarkComparison.reduce((sum, year) => sum + year.greenIndex, 0) / mockAnalytics.benchmarkComparison.length).toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-4 bg-black/30 rounded-lg border border-zinc-800/50">
                    <h4 className="font-medium text-white mb-2">Performance Highlights</h4>
                    <ul className="text-sm text-zinc-300 space-y-2 list-disc list-inside">
                      <li>Your portfolio showed consistent positive returns every year</li>
                      <li>Outperformed bonds by an average of 7.6 percentage points</li>
                      <li>Less volatile than both S&P 500 and Green Energy indices</li>
                      <li>Exceptional performance during market downturns (2022)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-black/30 rounded-lg border border-zinc-800/50">
                    <h4 className="font-medium text-white mb-2">Investment Strategy</h4>
                    <p className="text-sm text-zinc-300 mb-3">
                      Your renewable energy investments have provided excellent stability while delivering competitive returns. They've shown particular strength during market downturns, making them an effective portfolio diversifier.
                    </p>
                    <Button variant="outline" className="border-emerald-800 hover:bg-emerald-900/20 hover:text-emerald-300 text-sm mt-2">
                      View Strategy Recommendations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 