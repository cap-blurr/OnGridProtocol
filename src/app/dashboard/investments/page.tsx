'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ArrowUpRight,
  Target,
  Clock,
  Activity,
  Sun,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function InvestmentDashboard() {
  const investmentOpportunities = [
    {
      id: 1,
      name: 'Solar Energy Grid - Nigeria',
      type: 'Solar',
      targetAmount: 500000,
      currentAmount: 320000,
      roi: 12.5,
      duration: '24 months',
      riskLevel: 'Medium',
      status: 'Active',
      description: 'Large-scale solar farm powering rural communities in northern Nigeria'
    },
    {
      id: 2,
      name: 'Solar Microgrid - Kenya',
      type: 'Solar',
      targetAmount: 750000,
      currentAmount: 480000,
      roi: 14.2,
      duration: '30 months',
      riskLevel: 'Medium',
      status: 'Active',
      description: 'Distributed solar microgrids for off-grid communities in Kenya'
    },
    {
      id: 3,
      name: 'Rooftop Solar Program - Ghana',
      type: 'Solar',
      targetAmount: 300000,
      currentAmount: 280000,
      roi: 11.8,
      duration: '18 months',
      riskLevel: 'Low',
      status: 'Active',
      description: 'Commercial rooftop solar installations across major cities in Ghana'
    },
    {
      id: 4,
      name: 'Solar Energy Storage - South Africa',
      type: 'Solar',
      targetAmount: 900000,
      currentAmount: 540000,
      roi: 13.5,
      duration: '36 months',
      riskLevel: 'Medium',
      status: 'Active',
      description: 'Solar power generation with battery storage solutions'
    }
  ];

  const myInvestments = [
    {
      id: 1,
      projectName: 'Solar Energy Grid - Nigeria',
      amount: 25000,
      currentValue: 27500,
      roi: 10.0,
      status: 'Active',
      energyGenerated: '125 MWh'
    },
    {
      id: 2,
      projectName: 'Solar Microgrid - Kenya',
      amount: 35000,
      currentValue: 39200,
      roi: 12.0,
      status: 'Active',
      energyGenerated: '89 MWh'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Solar Investment Dashboard</h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                Discover and manage your solar energy investments across Africa
              </p>
            </div>
            <div className="flex items-center space-x-2 text-oga-green">
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Powered by Solar Energy</span>
            </div>
          </div>
        </div>

        {/* Investment Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">$60,000</div>
              <p className="text-xs text-oga-green">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Current Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">$66,700</div>
              <p className="text-xs text-oga-green">+11.2% ROI</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Solar Projects</CardTitle>
              <Sun className="h-4 w-4 text-oga-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">2</div>
              <p className="text-xs text-oga-green">Both generating power</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Energy Generated</CardTitle>
              <Zap className="h-4 w-4 text-oga-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">214 MWh</div>
              <p className="text-xs text-oga-green">Clean energy produced</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-oga-green text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-oga-green text-xs sm:text-sm">
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {investmentOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-colors duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <CardTitle className="text-white text-base lg:text-lg leading-tight">{opportunity.name}</CardTitle>
                      <Badge className="bg-oga-green/20 text-oga-green border-oga-green/50 w-fit">
                        <Sun className="w-3 h-3 mr-1" />
                        {opportunity.type}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-2 line-clamp-2">
                      {opportunity.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-zinc-400">Funding Progress</span>
                        <span className="text-white">
                          ${opportunity.currentAmount.toLocaleString()} / ${opportunity.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className="bg-oga-green h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(opportunity.currentAmount / opportunity.targetAmount) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-zinc-500 text-right">
                        {Math.round((opportunity.currentAmount / opportunity.targetAmount) * 100)}% funded
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div>
                        <p className="text-zinc-400">Expected ROI</p>
                        <p className="text-oga-green font-semibold">{opportunity.roi}%</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Duration</p>
                        <p className="text-white">{opportunity.duration}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Risk Level</p>
                        <Badge 
                          className={
                            opportunity.riskLevel === 'Low' ? 'bg-oga-green/20 text-oga-green border-oga-green/50' :
                            opportunity.riskLevel === 'Medium' ? 'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50' : 
                            'bg-red-600/20 text-red-400 border-red-600/50'
                          }
                        >
                          {opportunity.riskLevel}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-zinc-400">Status</p>
                        <Badge className="bg-oga-green/20 text-oga-green border-oga-green/50">{opportunity.status}</Badge>
                      </div>
                    </div>
                    
                    <Link href={`/dashboard/investments/opportunities/${opportunity.id}`}>
                      <Button className="w-full bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white">
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {myInvestments.map((investment) => (
                <Card key={investment.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardHeader>
                    <CardTitle className="text-white text-base lg:text-lg">{investment.projectName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-zinc-400">Initial Investment</p>
                        <p className="text-base lg:text-lg font-semibold text-white">${investment.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-zinc-400">Current Value</p>
                        <p className="text-base lg:text-lg font-semibold text-oga-green">${investment.currentValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-zinc-400">ROI</p>
                        <p className="text-base lg:text-lg font-semibold text-oga-green">+{investment.roi}%</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-zinc-400">Energy Generated</p>
                        <p className="text-base lg:text-lg font-semibold text-oga-yellow">{investment.energyGenerated}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Badge className="bg-oga-green/20 text-oga-green border-oga-green/50">
                        <Sun className="w-3 h-3 mr-1" />
                        {investment.status}
                      </Badge>
                      <Link href={`/dashboard/investments/current/${investment.id}`}>
                        <Button variant="outline" className="border-oga-green/30 text-oga-green hover:bg-oga-green/10 text-xs sm:text-sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
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