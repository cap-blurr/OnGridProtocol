"use client";

import React, { useState } from 'react';
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
  Heart,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useInvestmentOpportunities } from '@/hooks/contracts/useDashboardData';
import { DirectProjectInvestment } from '@/components/investment/InvestmentActions';
import LoadingScreen from '@/components/ui/loading-screen';

export default function InvestmentOpportunities() {
  const { isConnected } = useAccount();
  const { opportunities, isLoading } = useInvestmentOpportunities();
  
  // Filter states
  const [riskFilter, setRiskFilter] = useState('All Levels');
  const [minRoiFilter, setMinRoiFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Countries');
  const [minInvestmentFilter, setMinInvestmentFilter] = useState('');

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Enhanced opportunities with mock metadata (would come from IPFS/backend in production)
  const enhancedOpportunities = opportunities.map((opportunity, index) => {
    const mockMetadata = {
      location: ['Lagos, Nigeria', 'Nairobi, Kenya', 'Accra, Ghana', 'Cape Town, South Africa'][index % 4],
      riskLevel: index % 3 === 0 ? 'Low' : index % 3 === 1 ? 'Medium' : 'High',
      status: opportunity.details.isFundingClosed ? 'Completed' : 'Active',
      description: `Large-scale solar energy project providing clean power to ${Math.floor(opportunity.details.fundingPercentage * 500)} households`,
      minInvestment: 1000 + (index * 500),
      investors: 25 + (index * 15),
      capacity: `${40 + (index * 15)} MW`,
      homesPowered: Math.floor(opportunity.details.fundingPercentage * 500),
      duration: `${18 + (index * 6)} months`,
    };

    return {
      id: index + 1,
      name: `Solar Energy Project ${index + 1}`,
      type: 'Solar',
      vaultAddress: opportunity.vaultAddress,
      targetAmount: Number(opportunity.details.formattedLoanAmount),
      currentAmount: Number(opportunity.details.formattedTotalAssetsInvested),
      roi: opportunity.details.aprPercentage,
      fundingPercentage: opportunity.details.fundingPercentage,
      isFundingClosed: opportunity.details.isFundingClosed,
      ...mockMetadata,
    };
  });

  // Apply filters
  const filteredOpportunities = enhancedOpportunities.filter(opp => {
    if (riskFilter !== 'All Levels' && opp.riskLevel !== riskFilter) return false;
    if (minRoiFilter && opp.roi < parseFloat(minRoiFilter)) return false;
    if (locationFilter !== 'All Countries' && !opp.location.includes(locationFilter.split(',')[0])) return false;
    if (minInvestmentFilter && opp.minInvestment < parseFloat(minInvestmentFilter)) return false;
    return true;
  });

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
                Discover high-value solar energy projects seeking direct investment funding
              </p>
            </div>
            <div className="flex items-center space-x-2 text-oga-green">
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Live Blockchain Data</span>
            </div>
          </div>
        </div>

        {/* Project Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 lg:mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 text-center">
              <Sun className="w-6 h-6 text-oga-yellow mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{enhancedOpportunities.length}</div>
              <p className="text-xs text-oga-green">Available Projects</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-oga-green mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {enhancedOpportunities.length > 0 ? 
                  (enhancedOpportunities.reduce((sum, opp) => sum + opp.roi, 0) / enhancedOpportunities.length).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-oga-green">Avg. Expected ROI</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-oga-green mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {enhancedOpportunities.reduce((sum, opp) => sum + opp.investors, 0)}
              </div>
              <p className="text-xs text-oga-green">Total Investors</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-oga-green mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {enhancedOpportunities.reduce((sum, opp) => sum + opp.homesPowered, 0).toLocaleString()}
              </div>
              <p className="text-xs text-oga-green">Homes to Power</p>
            </CardContent>
          </Card>
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
                <select 
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="w-full bg-zinc-900/70 border border-oga-green/30 rounded-md px-3 py-2 text-white focus:border-oga-green transition-colors"
                >
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
                  value={minRoiFilter}
                  onChange={(e) => setMinRoiFilter(e.target.value)}
                  className="bg-zinc-900/70 border-oga-green/30 text-white focus:border-oga-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full bg-zinc-900/70 border border-oga-green/30 rounded-md px-3 py-2 text-white focus:border-oga-green transition-colors"
                >
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
                  value={minInvestmentFilter}
                  onChange={(e) => setMinInvestmentFilter(e.target.value)}
                  className="bg-zinc-900/70 border-oga-green/30 text-white focus:border-oga-green"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {filteredOpportunities.map((opportunity) => (
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
                        {opportunity.roi}% ROI
                      </Badge>
                      <Badge 
                        className={
                          opportunity.status === 'Active' ? 'bg-oga-green/20 text-oga-green border-oga-green/50' : 
                          opportunity.status === 'Completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                          'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50'
                        }
                      >
                        {opportunity.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {opportunity.description}
                  </p>

                  {/* Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Funding Progress</span>
                      <span className="text-white">
                        ${opportunity.currentAmount.toLocaleString()} / ${opportunity.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-oga-green to-oga-green-light h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(opportunity.fundingPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-zinc-500 text-right">
                      {opportunity.fundingPercentage}% funded
                    </div>
                  </div>

                  {/* Project Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-400">Min Investment</span>
                      <div className="text-white font-semibold">${opportunity.minInvestment.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-zinc-400">Duration</span>
                      <div className="text-white font-semibold">{opportunity.duration}</div>
                    </div>
                    <div>
                      <span className="text-zinc-400">Risk Level</span>
                      <div className={`font-semibold ${
                        opportunity.riskLevel === 'Low' ? 'text-oga-green' : 
                        opportunity.riskLevel === 'Medium' ? 'text-oga-yellow' : 
                        'text-red-400'
                      }`}>
                        {opportunity.riskLevel}
                      </div>
                    </div>
                    <div>
                      <span className="text-zinc-400">Capacity</span>
                      <div className="text-oga-yellow font-semibold">{opportunity.capacity}</div>
                    </div>
                    <div>
                      <span className="text-zinc-400">Homes Powered</span>
                      <div className="text-oga-green font-semibold">{opportunity.homesPowered.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-zinc-400">Expected ROI</span>
                      <div className="text-oga-green font-semibold">{opportunity.roi}%</div>
                    </div>
                  </div>

                  {/* Solar Impact */}
                  <div className="bg-oga-green/10 border border-oga-green/20 p-3 rounded-lg">
                    <h4 className="text-oga-green font-semibold mb-2 text-sm flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Solar Impact
                    </h4>
                    <div className="text-xs text-zinc-300">
                      This project will generate clean solar energy for {opportunity.homesPowered.toLocaleString()} homes, 
                      reducing carbon emissions and providing sustainable power to communities.
                    </div>
                  </div>

                  {/* Investment Action */}
                  <div className="border-t border-zinc-800 pt-4">
                    {!opportunity.isFundingClosed ? (
                      <DirectProjectInvestment
                        vaultAddress={opportunity.vaultAddress as `0x${string}`}
                        projectName={opportunity.name}
                        minInvestment={opportunity.minInvestment}
                        maxInvestment={100000}
                        isFundingClosed={opportunity.isFundingClosed}
                        onSuccess={() => {
                          // Could trigger refetch of opportunities
                          window.location.reload();
                        }}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          Funding Completed
                        </Badge>
                        <p className="text-sm text-zinc-400 mt-2">This project has reached its funding goal</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/investments/details/${opportunity.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-oga-green/30 text-oga-green hover:bg-oga-green/10">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-oga-green mr-2" />
                <span className="text-white">Loading investment opportunities...</span>
              </div>
            ) : (
              <div className="text-zinc-400">
                <Sun className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Opportunities Found</h3>
                <p>Try adjusting your filters or check back later for new projects</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 