'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  Package,
  Truck,
  Settings
} from 'lucide-react';

export default function InstallationStatus() {
  const installations = [
    {
      id: 1,
      projectName: 'Lagos Solar Community Grid',
      location: 'Victoria Island, Lagos',
      stage: 'installation',
      progress: 75,
      startDate: '2024-01-15',
      expectedCompletion: '2024-02-28',
      crew: 'Team Alpha',
      components: {
        delivered: 95,
        installed: 75,
        tested: 60
      },
      status: 'on-track',
      nextMilestone: 'Grid Connection Testing'
    },
    {
      id: 2,
      projectName: 'Abuja Residential Solar',
      location: 'Maitama, Abuja',
      stage: 'completed',
      progress: 100,
      startDate: '2023-12-01',
      expectedCompletion: '2024-01-20',
      crew: 'Team Beta',
      components: {
        delivered: 100,
        installed: 100,
        tested: 100
      },
      status: 'completed',
      nextMilestone: 'Handover Complete'
    },
    {
      id: 3,
      projectName: 'Kano Agricultural Solar',
      location: 'Kano State',
      stage: 'planning',
      progress: 25,
      startDate: '2024-02-01',
      expectedCompletion: '2024-04-15',
      crew: 'Team Gamma',
      components: {
        delivered: 40,
        installed: 0,
        tested: 0
      },
      status: 'delayed',
      nextMilestone: 'Site Preparation'
    },
    {
      id: 4,
      projectName: 'Port Harcourt Solar Hub',
      location: 'Port Harcourt, Rivers',
      stage: 'delivery',
      progress: 45,
      startDate: '2024-01-20',
      expectedCompletion: '2024-03-30',
      crew: 'Team Delta',
      components: {
        delivered: 70,
        installed: 20,
        tested: 0
      },
      status: 'on-track',
      nextMilestone: 'Begin Installation'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'planning': return <Settings className="w-5 h-5 text-yellow-400" />;
      case 'delivery': return <Truck className="w-5 h-5 text-blue-400" />;
      case 'installation': return <Wrench className="w-5 h-5 text-orange-400" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const totalProjects = installations.length;
  const completedProjects = installations.filter(p => p.status === 'completed').length;
  const onTrackProjects = installations.filter(p => p.status === 'on-track').length;
  const delayedProjects = installations.filter(p => p.status === 'delayed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3D9970] to-[#FFDC00] bg-clip-text text-transparent mb-2">
          Installation Status
        </h1>
        <p className="text-zinc-400">
          Track installation progress across all your solar projects
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Projects</CardTitle>
            <Package className="h-4 w-4 text-[#3D9970]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <p className="text-xs text-gray-400">Active installations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{completedProjects}</div>
            <p className="text-xs text-green-400">{((completedProjects / totalProjects) * 100).toFixed(0)}% completion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">On Track</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{onTrackProjects}</div>
            <p className="text-xs text-gray-400">Projects on schedule</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Delayed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{delayedProjects}</div>
            <p className="text-xs text-red-400">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Installation Projects */}
      <div className="space-y-6">
        {installations.map((installation) => (
          <Card key={installation.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {getStageIcon(installation.stage)}
                  <div>
                    <CardTitle className="text-white text-lg">{installation.projectName}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-400">{installation.location}</p>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(installation.status)} text-white`}>
                  {installation.status.toUpperCase().replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress Overview */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">Overall Progress</span>
                    <span className="text-sm font-semibold text-white">{installation.progress}%</span>
                  </div>
                  <Progress value={installation.progress} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Started: {installation.startDate}</span>
                    <span>Expected: {installation.expectedCompletion}</span>
                  </div>
                </div>

                {/* Component Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Components Delivered</span>
                      <span className="text-lg font-bold text-white">{installation.components.delivered}%</span>
                    </div>
                    <Progress value={installation.components.delivered} className="h-2" />
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Installation Complete</span>
                      <span className="text-lg font-bold text-white">{installation.components.installed}%</span>
                    </div>
                    <Progress value={installation.components.installed} className="h-2" />
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Testing Complete</span>
                      <span className="text-lg font-bold text-white">{installation.components.tested}%</span>
                    </div>
                    <Progress value={installation.components.tested} className="h-2" />
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Installation Crew:</span>
                        <span className="text-white">{installation.crew}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Stage:</span>
                        <span className="text-white capitalize">{installation.stage.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Next Milestone</h4>
                    <div className="bg-[#3D9970]/10 border border-[#3D9970]/30 rounded-lg p-3">
                      <p className="text-[#3D9970] font-medium text-sm">{installation.nextMilestone}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700/50">
                  <Button className="bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white">
                    View Project Details
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#3D9970]/50 text-[#3D9970] hover:bg-[#3D9970]/10"
                  >
                    Contact Crew
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Download Report
                  </Button>
                  {installation.status === 'delayed' && (
                    <Button 
                      variant="outline" 
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      Address Issues
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white px-8 py-3">
          Schedule New Installation
        </Button>
        <Button 
          variant="outline" 
          className="border-[#FFDC00] text-[#FFDC00] hover:bg-[#FFDC00]/10 px-8 py-3"
        >
          Generate Status Report
        </Button>
      </div>
    </div>
  );
} 