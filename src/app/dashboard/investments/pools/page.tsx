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
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function InvestmentPools() {
  const pools = [
    {
      id: 1,
      name: 'African Solar Fund I',
      description: 'Diversified solar energy projects across West Africa',
      totalValue: 5200000,
      currentValue: 5830000,
      investors: 156,
      minInvestment: 10000,
      riskLevel: 'Medium',
      roi: 12.1,
      apy: 14.5,
      duration: '3 years',
      status: 'Active',
      projects: [
        'Lagos Solar Farm Alpha',
        'Abuja Community Solar',
        'Kano Solar Grid'
      ]
    },
    {
      id: 2,
      name: 'Renewable Energy Diversified',
      description: 'Mixed portfolio of solar, wind, and hydro projects',
      totalValue: 8500000,
      currentValue: 9350000,
      investors: 203,
      minInvestment: 5000,
      riskLevel: 'Low',
      roi: 10.0,
      apy: 11.8,
      duration: '5 years',
      status: 'Active',
      projects: [
        'Ghana Hydro Plant',
        'Kenya Wind Farm',
        'Nigeria Solar Complex'
      ]
    },
    {
      id: 3,
      name: 'High-Yield Energy Fund',
      description: 'Higher risk, higher reward energy investments',
      totalValue: 3200000,
      currentValue: 3840000,
      investors: 89,
      minInvestment: 25000,
      riskLevel: 'High',
      roi: 20.0,
      apy: 22.5,
      duration: '2 years',
      status: 'Open',
      projects: [
        'Industrial Solar Complex',
        'Offshore Wind Project',
        'Geothermal Development'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard/investments" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Investment Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Investment Pools</h1>
        <p className="text-zinc-400">
          Join diversified investment pools for reduced risk and steady returns
        </p>
      </div>

      {/* Pool Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Risk Diversification</h3>
            <p className="text-gray-400 text-sm">Spread risk across multiple projects and energy types</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Professional Management</h3>
            <p className="text-gray-400 text-sm">Expert portfolio management and project selection</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Lower Entry Barrier</h3>
            <p className="text-gray-400 text-sm">Access high-value projects with smaller investments</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Pools */}
      <div className="space-y-6">
        {pools.map((pool) => (
          <Card key={pool.id} className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-xl mb-2">{pool.name}</CardTitle>
                  <p className="text-gray-300 text-sm mb-3">{pool.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {pool.investors} investors
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {pool.duration}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge 
                    className={
                      pool.status === 'Active' ? 'bg-green-600' : 'bg-yellow-600'
                    }
                  >
                    {pool.status}
                  </Badge>
                  <Badge 
                    className={
                      pool.riskLevel === 'Low' ? 'bg-green-600' :
                      pool.riskLevel === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                    }
                  >
                    {pool.riskLevel} Risk
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-gray-400 text-sm">Total Value</span>
                  </div>
                  <p className="text-white font-bold text-lg">${pool.totalValue.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-400 text-sm">Current Value</span>
                  </div>
                  <p className="text-green-400 font-bold text-lg">${pool.currentValue.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="text-gray-400 text-sm">ROI</span>
                  </div>
                  <p className="text-emerald-400 font-bold text-lg">+{pool.roi}%</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-400 text-sm">APY</span>
                  </div>
                  <p className="text-yellow-400 font-bold text-lg">{pool.apy}%</p>
                </div>
              </div>

              {/* Pool Projects */}
              <div>
                <h4 className="text-white font-semibold mb-3">Pool Projects</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {pool.projects.map((project, index) => (
                    <div key={index} className="bg-gray-800/30 p-3 rounded-lg">
                      <p className="text-white text-sm font-medium">{project}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Investment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minimum Investment:</span>
                      <span className="text-white">${pool.minInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lock-up Period:</span>
                      <span className="text-white">{pool.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Management Fee:</span>
                      <span className="text-white">2% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Performance Fee:</span>
                      <span className="text-white">20% of profits</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Performance History</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">6 Month Return:</span>
                      <span className="text-green-400">+{(pool.roi / 2).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">12 Month Return:</span>
                      <span className="text-green-400">+{pool.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sharpe Ratio:</span>
                      <span className="text-white">1.85</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Drawdown:</span>
                      <span className="text-red-400">-3.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Link href={`/dashboard/investments/pools/${pool.id}`} className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Invest in Pool
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  View Prospectus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 