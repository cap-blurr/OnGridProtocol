'use client';

import React from 'react';
import { useAccount } from 'wagmi';
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
  Settings,
  Monitor,
  CheckCircle2,
  Activity,
  TrendingUp,
  Eye,
  PlayCircle,
  Zap
} from 'lucide-react';
import { useAllContractEvents, useUserEvents } from '@/hooks/contracts/useContractEvents';
import { useUSDCBalance } from '@/hooks/contracts/useUSDC';

export default function InstallationStatus() {
  const { address: userAddress } = useAccount();
  
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
      nextMilestone: 'Grid Connection Testing',
      alerts: ['Weather delay possible', 'Equipment calibration pending']
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
      nextMilestone: 'Handover Complete',
      alerts: []
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
      nextMilestone: 'Site Preparation',
      alerts: ['Permit approval delayed', 'Site access restricted', 'Material shortage']
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
      nextMilestone: 'Begin Installation',
      alerts: ['Logistics coordination needed']
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-500', icon: CheckCircle2, label: 'Completed' };
      case 'on-track':
        return { color: 'bg-blue-500', icon: Clock, label: 'On Track' };
      case 'delayed':
        return { color: 'bg-red-500', icon: AlertTriangle, label: 'Delayed' };
      case 'planning':
        return { color: 'bg-yellow-500', icon: Clock, label: 'Planning' };
      default:
        return { color: 'bg-gray-500', icon: Clock, label: 'Unknown' };
    }
  };

  const totalCapacity = installations.reduce((sum, project) => sum + parseFloat(project.components.delivered.toString()), 0);
  const totalAlerts = installations.reduce((sum, project) => sum + project.alerts.length, 0);

  // Phase 3: Enhanced event monitoring and analytics
  const { events: userEvents } = useUserEvents(userAddress);
  const { events: allEvents } = useAllContractEvents();
  const { formattedBalance: usdcBalance } = useUSDCBalance(userAddress);

  // Phase 3: Advanced analytics
  const recentEvents = userEvents.slice(0, 10);
  const projectCreatedEvents = userEvents.filter(e => e.type === 'ProjectCreated');
  const repaymentEvents = userEvents.filter(e => e.type === 'RepaymentRouted');
  const kycEvents = userEvents.filter(e => e.type === 'KYCStatusChanged');

  // Phase 3: Project performance metrics
  const totalProjectValue = installations.reduce((sum, installation) => {
    // Mock calculation - in reality would get from contract
    return sum + 100000; // $100k per project
  }, 0);

  // Enhanced status cards for Phase 3
  const statusCards = [
    {
      title: "USDC Balance",
      value: `${usdcBalance} USDC`,
      subtitle: "Available for transactions",
      icon: "💰",
      color: "green"
    },
    {
      title: "Total Project Value", 
      value: `$${totalProjectValue.toLocaleString()}`,
      subtitle: `Across ${installations.length} projects`,
      icon: "🏗️",
      color: "blue"
    },
    {
      title: "Active Events",
      value: userEvents.length.toString(),
      subtitle: "Blockchain interactions",
      icon: "⚡",
      color: "yellow"
    },
    {
      title: "Repayments Made",
      value: repaymentEvents.length.toString(),
      subtitle: "Successful payments",
      icon: "💳",
      color: "emerald"
    }
  ];

  return (
    <div className="relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[#4CAF50]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[#4CAF50]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 relative pl-6">
          {/* Thin accent line */}
          <div className="absolute -left-4 top-0 h-full w-px bg-[#4CAF50]/30" />
          
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-[#4CAF50] mb-2 relative">
            Developer Dashboard
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-[#4CAF50]" />
          </span>
          
          <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">
            Installation Status
          </h1>
          <p className="text-zinc-400">
            Track installation progress across all your solar projects
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Projects</CardTitle>
              <Monitor className="h-4 w-4 text-[#4CAF50]" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{totalProjects}</div>
              <p className="text-xs text-[#4CAF50]">Active installations</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-green-400">{completedProjects}</div>
              <p className="text-xs text-green-400">{((completedProjects / totalProjects) * 100).toFixed(0)}% completion rate</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">On Track</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-blue-400">{onTrackProjects}</div>
              <p className="text-xs text-[#4CAF50]">Projects on schedule</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Delayed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-red-400">{delayedProjects}</div>
              <p className="text-xs text-red-400">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Capacity</CardTitle>
              <Zap className="h-4 w-4 text-[#4CAF50]" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-[#4CAF50]">{totalCapacity.toFixed(1)} MW</div>
              <p className="text-xs text-[#4CAF50]">Installed capacity</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-yellow-400">{totalAlerts}</div>
              <p className="text-xs text-[#4CAF50]">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Installation Projects */}
        <div className="space-y-6">
          {installations.map((installation) => {
            const statusInfo = getStatusInfo(installation.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={installation.id} className="relative bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-transparent pointer-events-none" />
                <CardHeader className="relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {getStageIcon(installation.stage)}
                      <div>
                        <CardTitle className="text-white text-lg">{installation.projectName}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-4 h-4 text-[#4CAF50]" />
                          <p className="text-sm text-[#4CAF50]">{installation.location}</p>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${statusInfo.color} text-white`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-6">
                    {/* Progress Overview */}
                    <div>
                      <div className="flex justify-between text-sm text-[#4CAF50] mb-2">
                        <span>Overall Progress</span>
                        <span>{installation.progress}%</span>
                      </div>
                      <Progress value={installation.progress} className="h-3 mb-4" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                          <Truck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{installation.components.delivered}%</p>
                          <p className="text-xs text-[#4CAF50]">Delivered</p>
                        </div>
                        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                          <Wrench className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{installation.components.installed}%</p>
                          <p className="text-xs text-[#4CAF50]">Installed</p>
                        </div>
                        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-white">{installation.components.tested}%</p>
                          <p className="text-xs text-[#4CAF50]">Tested</p>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#4CAF50]">Installation Crew</p>
                        <p className="text-white font-semibold">{installation.crew}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#4CAF50]">Next Milestone</p>
                        <p className="text-white font-semibold">{installation.nextMilestone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#4CAF50]">Start Date</p>
                        <p className="text-white font-semibold">{installation.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#4CAF50]">Expected Completion</p>
                        <p className="text-white font-semibold">{installation.expectedCompletion}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        className="bg-gradient-to-r from-[#4CAF50] to-[#4CAF50] hover:from-[#4CAF50]/90 hover:to-[#4CAF50]/90 text-white font-medium transition-all duration-200"
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-[#4CAF50]/50 text-[#4CAF50] hover:bg-[#4CAF50]/20 hover:text-[#4CAF50] hover:border-[#4CAF50] font-medium transition-all duration-200"
                      >
                        Update Status
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 font-medium transition-all duration-200"
                      >
                        Contact Crew
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-gradient-to-r from-[#4CAF50] to-[#4CAF50] hover:from-[#4CAF50]/90 hover:to-[#4CAF50]/90 text-white font-medium transition-all duration-200 px-8 py-3">
            <PlayCircle className="w-5 h-5 mr-2" />
            Schedule New Installation
          </Button>
          <Button 
            variant="outline" 
            className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/20 hover:text-[#4CAF50] hover:border-[#4CAF50] font-medium transition-all duration-200 px-8 py-3"
          >
            Export Status Report
          </Button>
        </div>
      </div>
    </div>
  );
} 