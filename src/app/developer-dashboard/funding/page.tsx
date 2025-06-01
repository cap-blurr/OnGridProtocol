'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function SolarFundingLevels() {
  const fundingProjects = [
    {
      id: 1,
      name: 'Lagos Solar Community Grid',
      target: 500000,
      raised: 375000,
      investors: 245,
      daysLeft: 12,
      status: 'active',
      category: 'Commercial',
      location: 'Lagos, Nigeria'
    },
    {
      id: 2,
      name: 'Abuja Residential Solar',
      target: 250000,
      raised: 250000,
      investors: 156,
      daysLeft: 0,
      status: 'funded',
      category: 'Residential',
      location: 'Abuja, Nigeria'
    },
    {
      id: 3,
      name: 'Kano Agricultural Solar',
      target: 750000,
      raised: 225000,
      investors: 89,
      daysLeft: 28,
      status: 'active',
      category: 'Agricultural',
      location: 'Kano, Nigeria'
    },
    {
      id: 4,
      name: 'Port Harcourt Solar Hub',
      target: 1000000,
      raised: 150000,
      investors: 67,
      daysLeft: 45,
      status: 'active',
      category: 'Industrial',
      location: 'Port Harcourt, Nigeria'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funded': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'funded': return <CheckCircle2 className="w-4 h-4" />;
      case 'active': return <Clock className="w-4 h-4" />;
      case 'paused': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalTarget = fundingProjects.reduce((sum, project) => sum + project.target, 0);
  const totalRaised = fundingProjects.reduce((sum, project) => sum + project.raised, 0);
  const totalInvestors = fundingProjects.reduce((sum, project) => sum + project.investors, 0);
  const activeProjects = fundingProjects.filter(p => p.status === 'active').length;

  return (
    <div className="relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-oga-green/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-oga-green/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 relative pl-6">
          {/* Thin accent line */}
          <div className="absolute -left-4 top-0 h-full w-px bg-oga-green/30" />
          
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-oga-green mb-2 relative">
            Developer Dashboard
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-oga-green" />
          </span>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-oga-green to-oga-yellow bg-clip-text text-transparent mb-2">
            Solar Funding Levels
          </h1>
          <p className="text-zinc-400">
            Track funding progress for your solar energy projects
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Target</CardTitle>
              <Target className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">${totalTarget.toLocaleString()}</div>
              <p className="text-xs text-oga-green">Funding goal</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-green-400">${totalRaised.toLocaleString()}</div>
              <p className="text-xs text-green-400">{((totalRaised / totalTarget) * 100).toFixed(1)}% of target</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Investors</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-blue-400">{totalInvestors.toLocaleString()}</div>
              <p className="text-xs text-oga-green">Across all projects</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-oga-yellow" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-oga-yellow">{activeProjects}</div>
              <p className="text-xs text-oga-green">Currently funding</p>
            </CardContent>
          </Card>
        </div>

        {/* Funding Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fundingProjects.map((project) => (
            <Card key={project.id} className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
              <CardHeader className="relative">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-lg mb-1">{project.name}</CardTitle>
                    <p className="text-sm text-oga-green">{project.location}</p>
                    <Badge className="mt-2 bg-gray-700 text-gray-200 text-xs">
                      {project.category}
                    </Badge>
                  </div>
                  <Badge className={`${getStatusColor(project.status)} text-white flex items-center gap-1`}>
                    {getStatusIcon(project.status)}
                    {project.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {/* Funding Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-oga-green">Funding Progress</span>
                      <span className="text-white font-semibold">
                        {((project.raised / project.target) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(project.raised / project.target) * 100} 
                      className="h-3 mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400 font-semibold">
                        ${project.raised.toLocaleString()}
                      </span>
                      <span className="text-oga-green">
                        of ${project.target.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-xl font-bold text-white">{project.investors}</p>
                      <p className="text-xs text-oga-green">Investors</p>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-oga-yellow mx-auto mb-1" />
                      <p className="text-xl font-bold text-white">{project.daysLeft}</p>
                      <p className="text-xs text-oga-green">Days Left</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white hover:text-white font-medium transition-all duration-200"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-oga-green/50 text-oga-green hover:bg-oga-green/20 hover:text-oga-green hover:border-oga-green font-medium transition-all duration-200"
                    >
                      Manage Campaign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 