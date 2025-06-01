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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3D9970] to-[#FFDC00] bg-clip-text text-transparent mb-2">
          Solar Funding Levels
        </h1>
        <p className="text-zinc-400">
          Track funding progress for your solar energy projects
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Target</CardTitle>
            <Target className="h-4 w-4 text-[#3D9970]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalTarget.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Funding goal</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${totalRaised.toLocaleString()}</div>
            <p className="text-xs text-green-400">{((totalRaised / totalTarget) * 100).toFixed(1)}% of target</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Investors</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{totalInvestors.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Across all projects</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FFDC00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFDC00]">{activeProjects}</div>
            <p className="text-xs text-gray-400">Currently funding</p>
          </CardContent>
        </Card>
      </div>

      {/* Funding Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fundingProjects.map((project) => (
          <Card key={project.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg mb-1">{project.name}</CardTitle>
                  <p className="text-sm text-gray-400">{project.location}</p>
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
            <CardContent>
              <div className="space-y-4">
                {/* Funding Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Funding Progress</span>
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
                    <span className="text-gray-400">
                      of ${project.target.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-white">{project.investors}</p>
                    <p className="text-xs text-gray-400">Investors</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#FFDC00] mx-auto mb-1" />
                    <p className="text-xl font-bold text-white">{project.daysLeft}</p>
                    <p className="text-xs text-gray-400">Days Left</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  {project.status === 'active' && (
                    <Button className="w-full bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white">
                      Boost Campaign
                    </Button>
                  )}
                  {project.status === 'funded' && (
                    <Button className="w-full bg-gradient-to-r from-[#FFDC00] to-[#FFEB3B] hover:from-[#e6c500] hover:to-[#f9d71c] text-black">
                      View Project Details
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full border-[#3D9970]/50 text-[#3D9970] hover:bg-[#3D9970]/10"
                  >
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white px-8 py-3">
          Create New Project
        </Button>
        <Button 
          variant="outline" 
          className="border-[#FFDC00] text-[#FFDC00] hover:bg-[#FFDC00]/10 px-8 py-3"
        >
          View All Projects
        </Button>
      </div>
    </div>
  );
} 