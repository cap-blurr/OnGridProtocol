"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function InvestmentOpportunities() {
  const opportunities = [
    {
      id: 1,
      name: 'Solar Energy Grid - Nigeria',
      type: 'Solar',
      location: 'Lagos, Nigeria',
      targetAmount: 500000,
      currentAmount: 320000,
      roi: 12.5,
      duration: '24 months',
      riskLevel: 'Medium',
      status: 'Active',
      description: 'Large-scale solar energy grid to power residential and commercial areas in Lagos.',
      minInvestment: 1000,
      investors: 45
    },
    {
      id: 2,
      name: 'Wind Farm Development - Kenya',
      type: 'Wind',
      location: 'Turkana, Kenya',
      targetAmount: 1200000,
      currentAmount: 850000,
      roi: 15.2,
      duration: '36 months',
      riskLevel: 'High',
      status: 'Active',
      description: 'Wind farm installation in high-wind area with excellent energy generation potential.',
      minInvestment: 5000,
      investors: 32
    },
    {
      id: 3,
      name: 'Hydroelectric Plant - Ghana',
      type: 'Hydro',
      location: 'Volta Region, Ghana',
      targetAmount: 800000,
      currentAmount: 600000,
      roi: 10.8,
      duration: '30 months',
      riskLevel: 'Low',
      status: 'Active',
      description: 'Small-scale hydroelectric plant utilizing natural water flow for sustainable energy.',
      minInvestment: 2500,
      investors: 28
    },
    {
      id: 4,
      name: 'Solar Microgrid - Tanzania',
      type: 'Solar',
      location: 'Arusha, Tanzania',
      targetAmount: 350000,
      currentAmount: 120000,
      roi: 11.5,
      duration: '18 months',
      riskLevel: 'Medium',
      status: 'Funding',
      description: 'Microgrid solution for rural communities with limited grid access.',
      minInvestment: 500,
      investors: 15
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard/investments" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Investment Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Investment Opportunities</h1>
        <p className="text-zinc-400">
          Discover clean energy projects seeking investment funding
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Filter Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Project Type</label>
              <select className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                <option>All Types</option>
                <option>Solar</option>
                <option>Wind</option>
                <option>Hydro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Risk Level</label>
              <select className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                <option>All Levels</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Min ROI (%)</label>
              <Input 
                type="number" 
                placeholder="0" 
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <select className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                <option>All Countries</option>
                <option>Nigeria</option>
                <option>Kenya</option>
                <option>Ghana</option>
                <option>Tanzania</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-xl mb-2">{opportunity.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {opportunity.investors} investors
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className="bg-emerald-600">{opportunity.type}</Badge>
                  <Badge 
                    className={
                      opportunity.status === 'Active' ? 'bg-green-600' : 'bg-yellow-600'
                    }
                  >
                    {opportunity.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-300 text-sm">{opportunity.description}</p>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Funding Progress</span>
                  <span className="text-white">
                    ${opportunity.currentAmount.toLocaleString()} / ${opportunity.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-emerald-600 h-3 rounded-full" 
                    style={{ width: `${(opportunity.currentAmount / opportunity.targetAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {Math.round((opportunity.currentAmount / opportunity.targetAmount) * 100)}% funded
                </div>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-gray-400 text-sm">Expected ROI</span>
                  </div>
                  <p className="text-green-400 font-bold text-lg">{opportunity.roi}%</p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-400 text-sm">Duration</span>
                  </div>
                  <p className="text-white font-bold text-lg">{opportunity.duration}</p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-400 text-sm">Risk Level</span>
                  </div>
                  <Badge 
                    className={
                      opportunity.riskLevel === 'Low' ? 'bg-green-600' :
                      opportunity.riskLevel === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                    }
                  >
                    {opportunity.riskLevel}
                  </Badge>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span className="text-gray-400 text-sm">Min Investment</span>
                  </div>
                  <p className="text-white font-bold text-lg">${opportunity.minInvestment.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <Link href={`/dashboard/investments/opportunities/${opportunity.id}`}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    View Full Details
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Add to Watchlist
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 