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
            Installation Status
          </h1>
          <p className="text-zinc-400">
            Track installation progress across all your solar projects
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Projects</CardTitle>
              <Package className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{totalProjects}</div>
              <p className="text-xs text-oga-green">Active installations</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-green-400">{completedProjects}</div>
              <p className="text-xs text-green-400">{((completedProjects / totalProjects) * 100).toFixed(0)}% completion rate</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">On Track</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-blue-400">{onTrackProjects}</div>
              <p className="text-xs text-oga-green">Projects on schedule</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Delayed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-red-400">{delayedProjects}</div>
              <p className="text-xs text-red-400">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Installation Projects */}
        <div className="space-y-6">
          {installations.map((installation) => (
            <Card key={installation.id} className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
              <CardHeader className="relative">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {getStageIcon(installation.stage)}
                    <div>
                      <CardTitle className="text-white text-lg">{installation.projectName}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4 text-oga-green" />
                        <p className="text-sm text-oga-green">{installation.location}</p>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(installation.status)} text-white`}>
                    {installation.status.toUpperCase().replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-6">
                  {/* Progress Overview */}
                  <div>
                    <div className="flex justify-between text-sm text-oga-green mb-2">
                      <span>Overall Progress</span>
                      <span>{installation.progress}%</span>
                    </div>
                    <Progress value={installation.progress} className="h-3 mb-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{installation.components.delivered}%</p>
                        <p className="text-xs text-oga-green">Delivered</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <Wrench className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{installation.components.installed}%</p>
                        <p className="text-xs text-oga-green">Installed</p>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{installation.components.tested}%</p>
                        <p className="text-xs text-oga-green">Tested</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-oga-green">Installation Crew</p>
                      <p className="text-white font-semibold">{installation.crew}</p>
                    </div>
                    <div>
                      <p className="text-sm text-oga-green">Next Milestone</p>
                      <p className="text-white font-semibold">{installation.nextMilestone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-oga-green">Start Date</p>
                      <p className="text-white font-semibold">{installation.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-oga-green">Expected Completion</p>
                      <p className="text-white font-semibold">{installation.expectedCompletion}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-oga-green/50 text-oga-green hover:bg-oga-green/10"
                    >
                      Update Status
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Contact Crew
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