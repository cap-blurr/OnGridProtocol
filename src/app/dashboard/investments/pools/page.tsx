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
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function InvestmentPools() {
  const pools = [
    {
      id: 1,
      name: 'African Solar Fund I',
      description: 'Diversified solar energy projects across West Africa bringing clean power to communities',
      totalValue: 5200000,
      currentValue: 5830000,
      investors: 156,
      minInvestment: 10000,
      riskLevel: 'Medium',
      roi: 12.1,
      apy: 14.5,
      duration: '3 years',
      status: 'Active',
      energyGenerated: '345 MWh',
      homesPowered: 85000,
      projects: [
        'Lagos Solar Farm Alpha',
        'Abuja Community Solar Grid',
        'Kano Solar Microgrid'
      ]
    },
    {
      id: 2,
      name: 'Premium Solar Pool',
      description: 'High-quality solar installations with proven track records and steady returns',
      totalValue: 8500000,
      currentValue: 9350000,
      investors: 203,
      minInvestment: 5000,
      riskLevel: 'Low',
      roi: 10.0,
      apy: 11.8,
      duration: '5 years',
      status: 'Active',
      energyGenerated: '512 MWh',
      homesPowered: 125000,
      projects: [
        'Ghana Solar Complex',
        'Kenya Solar Farm',
        'Nigeria Commercial Solar'
      ]
    },
    {
      id: 3,
      name: 'High-Yield Solar Fund',
      description: 'Higher risk, higher reward solar investments in emerging markets',
      totalValue: 3200000,
      currentValue: 3840000,
      investors: 89,
      minInvestment: 25000,
      riskLevel: 'High',
      roi: 20.0,
      apy: 22.5,
      duration: '2 years',
      status: 'Open',
      energyGenerated: '198 MWh',
      homesPowered: 45000,
      projects: [
        'Industrial Solar Complex',
        'Large-Scale Solar Farm',
        'Solar Energy Storage Project'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <Link href="/dashboard/investments" className="inline-flex items-center text-oga-green hover:text-oga-green-light mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Solar Investment Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Solar Investment Pools</h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                Join diversified solar investment pools for reduced risk and steady returns
              </p>
            </div>
            <div className="flex items-center space-x-2 text-oga-green">
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Solar Energy Pools</span>
            </div>
          </div>
        </div>

        {/* Solar Pool Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 lg:mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 lg:p-6 text-center">
              <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-oga-green mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2 text-sm lg:text-base">Solar Risk Diversification</h3>
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

        {/* Solar Investment Pools */}
        <div className="space-y-4 lg:space-y-6">
          {pools.map((pool) => (
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
                    <Badge 
                      className={
                        pool.status === 'Active' ? 'bg-oga-green/20 text-oga-green border-oga-green/50' : 
                        'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50'
                      }
                    >
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

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                  <div className="bg-zinc-800/30 p-3 lg:p-4 rounded-lg border border-oga-green/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 text-oga-green" />
                      <span className="text-zinc-400 text-xs">Total Value</span>
                    </div>
                    <p className="text-white font-bold text-sm lg:text-base">${pool.totalValue.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-zinc-800/30 p-3 lg:p-4 rounded-lg border border-oga-green/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-oga-green" />
                      <span className="text-zinc-400 text-xs">Current Value</span>
                    </div>
                    <p className="text-oga-green font-bold text-sm lg:text-base">${pool.currentValue.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-zinc-800/30 p-3 lg:p-4 rounded-lg border border-oga-green/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-3 h-3 lg:w-4 lg:h-4 text-oga-yellow" />
                      <span className="text-zinc-400 text-xs">ROI</span>
                    </div>
                    <p className="text-oga-green font-bold text-sm lg:text-base">+{pool.roi}%</p>
                  </div>
                  
                  <div className="bg-zinc-800/30 p-3 lg:p-4 rounded-lg border border-oga-green/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-oga-yellow" />
                      <span className="text-zinc-400 text-xs">APY</span>
                    </div>
                    <p className="text-oga-yellow font-bold text-sm lg:text-base">{pool.apy}%</p>
                  </div>
                </div>

                {/* Solar Pool Projects */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-sm flex items-center">
                    <Sun className="w-4 h-4 mr-2 text-oga-yellow" />
                    Solar Pool Projects
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {pool.projects.map((project, index) => (
                      <div key={index} className="bg-zinc-800/30 border border-oga-green/20 p-3 rounded-lg">
                        <p className="text-white text-xs lg:text-sm font-medium flex items-center">
                          <Sun className="w-3 h-3 mr-2 text-oga-yellow" />
                          {project}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm">Solar Investment Details</h4>
                    <div className="space-y-2 text-xs lg:text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Minimum Investment:</span>
                        <span className="text-white">${pool.minInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Lock-up Period:</span>
                        <span className="text-white">{pool.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Management Fee:</span>
                        <span className="text-white">2% annually</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Performance Fee:</span>
                        <span className="text-white">20% of profits</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm">Solar Performance History</h4>
                    <div className="space-y-2 text-xs lg:text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">6 Month Return:</span>
                        <span className="text-oga-green">+{(pool.roi / 2).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">12 Month Return:</span>
                        <span className="text-oga-green">+{pool.roi}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Sharpe Ratio:</span>
                        <span className="text-white">1.85</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Max Drawdown:</span>
                        <span className="text-red-400">-3.2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href={`/dashboard/investments/pools/${pool.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Invest in Solar Pool
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-oga-green/30 text-oga-green hover:bg-oga-green/10"
                  >
                    View Pool Prospectus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 