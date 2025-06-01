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
  Activity
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
      status: 'Active'
    },
    {
      id: 2,
      name: 'Wind Farm Development - Kenya',
      type: 'Wind',
      targetAmount: 1200000,
      currentAmount: 850000,
      roi: 15.2,
      duration: '36 months',
      riskLevel: 'High',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Hydroelectric Plant - Ghana',
      type: 'Hydro',
      targetAmount: 800000,
      currentAmount: 600000,
      roi: 10.8,
      duration: '30 months',
      riskLevel: 'Low',
      status: 'Active'
    }
  ];

  const myInvestments = [
    {
      id: 1,
      projectName: 'Solar Energy Grid - Nigeria',
      amount: 25000,
      currentValue: 27500,
      roi: 10.0,
      status: 'Active'
    },
    {
      id: 2,
      projectName: 'Wind Farm Development - Kenya',
      amount: 50000,
      currentValue: 56000,
      roi: 12.0,
      status: 'Active'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Investment Dashboard</h1>
        <p className="text-zinc-400">
          Discover and manage your clean energy investments
        </p>
      </div>

      {/* Investment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$75,000</div>
            <p className="text-xs text-green-400">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Current Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$83,500</div>
            <p className="text-xs text-blue-400">+11.3% ROI</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2</div>
            <p className="text-xs text-emerald-400">Both performing well</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg. ROI</CardTitle>
            <Target className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">11.0%</div>
            <p className="text-xs text-yellow-400">Above market average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-700">
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-emerald-600">
            Investment Opportunities
          </TabsTrigger>
          <TabsTrigger value="current" className="data-[state=active]:bg-emerald-600">
            My Investments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {investmentOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{opportunity.name}</CardTitle>
                    <Badge className="bg-emerald-600">{opportunity.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        ${opportunity.currentAmount.toLocaleString()} / ${opportunity.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ width: `${(opportunity.currentAmount / opportunity.targetAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Expected ROI</p>
                      <p className="text-green-400 font-semibold">{opportunity.roi}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Duration</p>
                      <p className="text-white">{opportunity.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Risk Level</p>
                      <Badge 
                        className={
                          opportunity.riskLevel === 'Low' ? 'bg-green-600' :
                          opportunity.riskLevel === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                        }
                      >
                        {opportunity.riskLevel}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <Badge className="bg-blue-600">{opportunity.status}</Badge>
                    </div>
                  </div>
                  
                  <Link href={`/dashboard/investments/opportunities/${opportunity.id}`}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myInvestments.map((investment) => (
              <Card key={investment.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{investment.projectName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Initial Investment</p>
                      <p className="text-lg font-semibold text-white">${investment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Current Value</p>
                      <p className="text-lg font-semibold text-green-400">${investment.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">ROI</p>
                      <p className="text-lg font-semibold text-emerald-400">+{investment.roi}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <Badge className="bg-green-600">{investment.status}</Badge>
                    </div>
                  </div>
                  
                  <Link href={`/dashboard/investments/current/${investment.id}`}>
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                      View Investment Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <PieChart className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-white">+11.3%</p>
                  <p className="text-gray-400">Total Portfolio ROI</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Solar Projects</span>
                    <span className="text-green-400">+10.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wind Projects</span>
                    <span className="text-blue-400">+12.0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Investment Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Solar Grid Investment</p>
                      <p className="text-gray-400 text-sm">6 months ago • $25,000</p>
                    </div>
                    <div className="text-green-400 font-semibold">+10.0%</div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Wind Farm Investment</p>
                      <p className="text-gray-400 text-sm">3 months ago • $50,000</p>
                    </div>
                    <div className="text-blue-400 font-semibold">+12.0%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 