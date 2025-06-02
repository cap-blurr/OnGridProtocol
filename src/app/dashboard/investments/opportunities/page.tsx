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
  Zap,
  Sun,
  Heart
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
      investors: 45,
      capacity: '50 MW',
      homesPowered: 25000
    },
    {
      id: 2,
      name: 'Solar Microgrid - Kenya',
      type: 'Solar',
      location: 'Nairobi, Kenya',
      targetAmount: 750000,
      currentAmount: 480000,
      roi: 14.2,
      duration: '30 months',
      riskLevel: 'Medium',
      status: 'Active',
      description: 'Distributed solar microgrid system providing clean energy to off-grid communities.',
      minInvestment: 2500,
      investors: 32,
      capacity: '35 MW',
      homesPowered: 18000
    },
    {
      id: 3,
      name: 'Rooftop Solar Program - Ghana',
      type: 'Solar',
      location: 'Accra, Ghana',
      targetAmount: 300000,
      currentAmount: 280000,
      roi: 11.8,
      duration: '18 months',
      riskLevel: 'Low',
      status: 'Active',
      description: 'Commercial rooftop solar installations across major cities in Ghana.',
      minInvestment: 500,
      investors: 58,
      capacity: '20 MW',
      homesPowered: 12000
    },
    {
      id: 4,
      name: 'Solar Energy Storage - South Africa',
      type: 'Solar',
      location: 'Cape Town, South Africa',
      targetAmount: 900000,
      currentAmount: 540000,
      roi: 13.5,
      duration: '36 months',
      riskLevel: 'Medium',
      status: 'Funding',
      description: 'Solar power generation with advanced battery storage solutions for grid stability.',
      minInvestment: 5000,
      investors: 28,
      capacity: '75 MW',
      homesPowered: 40000
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Solar Investment Opportunities</h1>
              <p className="text-zinc-400 text-sm sm:text-base">
                Discover solar energy projects seeking investment funding across Africa
              </p>
            </div>
            <div className="flex items-center space-x-2 text-oga-green">
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Solar Energy Only</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30 mb-6 lg:mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-oga-green" />
              Filter Solar Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Risk Level</label>
                <select className="w-full bg-zinc-900/70 border border-oga-green/30 rounded-md px-3 py-2 text-white focus:border-oga-green transition-colors">
                  <option>All Levels</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Min ROI (%)</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="bg-zinc-900/70 border-oga-green/30 text-white focus:border-oga-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
                <select className="w-full bg-zinc-900/70 border border-oga-green/30 rounded-md px-3 py-2 text-white focus:border-oga-green transition-colors">
                  <option>All Countries</option>
                  <option>Nigeria</option>
                  <option>Kenya</option>
                  <option>Ghana</option>
                  <option>South Africa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Min Investment</label>
                <Input 
                  type="number" 
                  placeholder="Any amount" 
                  className="bg-zinc-900/70 border-oga-green/30 text-white focus:border-oga-green"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-colors duration-300">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-white text-base lg:text-xl mb-2 flex items-center">
                      <Sun className="w-5 h-5 mr-2 text-oga-yellow" />
                      {opportunity.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-400">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {opportunity.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {opportunity.investors} investors
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-3 h-3 mr-1 text-oga-yellow" />
                        {opportunity.capacity}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge className="bg-oga-green/20 text-oga-green border-oga-green/50 w-fit">
                      <Sun className="w-3 h-3 mr-1" />
                      {opportunity.type}
                    </Badge>
                    <Badge 
                      className={
                        opportunity.status === 'Active' ? 'bg-oga-green/20 text-oga-green border-oga-green/50' : 
                        'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50'
                      }
                    >
                      {opportunity.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">{opportunity.description}</p>
                
                {/* Solar Impact */}
                <div className="bg-oga-green/10 border border-oga-green/20 p-3 rounded-lg">
                  <div className="flex items-center justify-center text-center">
                    <Heart className="w-4 h-4 mr-2 text-oga-green" />
                    <span className="text-sm text-oga-green">
                      Powers <span className="font-semibold">{opportunity.homesPowered.toLocaleString()}</span> homes with clean solar energy
                    </span>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-zinc-400">Solar Project Funding</span>
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
                  <div className="text-right text-xs text-zinc-500">
                    {Math.round((opportunity.currentAmount / opportunity.targetAmount) * 100)}% funded
                  </div>
                </div>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800/30 p-3 rounded-lg border border-oga-green/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-oga-green" />
                      <span className="text-zinc-400 text-xs">Expected ROI</span>
                    </div>
                    <p className="text-oga-green font-bold text-base">{opportunity.roi}%</p>
                  </div>
                  
                  <div className="bg-zinc-800/30 p-3 rounded-lg border border-oga-green/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-3 h-3 text-oga-green" />
                      <span className="text-zinc-400 text-xs">Duration</span>
                    </div>
                    <p className="text-white font-bold text-base">{opportunity.duration}</p>
                  </div>
                  
                  <div className="bg-zinc-800/30 p-3 rounded-lg border border-oga-green/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <Shield className="w-3 h-3 text-oga-yellow" />
                      <span className="text-zinc-400 text-xs">Risk Level</span>
                    </div>
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
                  
                  <div className="bg-zinc-800/30 p-3 rounded-lg border border-oga-green/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="w-3 h-3 text-oga-yellow" />
                      <span className="text-zinc-400 text-xs">Min Investment</span>
                    </div>
                    <p className="text-white font-bold text-base">${opportunity.minInvestment.toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Link href={`/dashboard/investments/opportunities/${opportunity.id}`}>
                    <Button className="w-full bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      View Solar Project Details
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full border-oga-green/30 text-oga-green hover:bg-oga-green/10"
                  >
                    Add to Solar Watchlist
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