'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  Activity,
  Sun,
  Battery,
  BarChart3,
  Clock
} from 'lucide-react';

export default function EnergyProduction() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const productionData = [
    {
      id: 1,
      projectName: 'Lagos Solar Farm Alpha',
      location: 'Victoria Island, Lagos',
      capacity: 500, // kW
      todayProduction: 1250, // kWh
      monthlyProduction: 45000, // kWh
      yearlyProduction: 520000, // kWh
      efficiency: 87,
      status: 'optimal',
      lastMaintenance: '2024-01-15'
    },
    {
      id: 2,
      projectName: 'Abuja Community Solar',
      location: 'Maitama, Abuja',
      capacity: 300,
      todayProduction: 720,
      monthlyProduction: 26000,
      yearlyProduction: 310000,
      efficiency: 92,
      status: 'optimal',
      lastMaintenance: '2024-01-20'
    },
    {
      id: 3,
      projectName: 'Kano Wind Project',
      location: 'Kano State',
      capacity: 750,
      todayProduction: 1680,
      monthlyProduction: 58000,
      yearlyProduction: 680000,
      efficiency: 79,
      status: 'maintenance',
      lastMaintenance: '2024-01-30'
    },
    {
      id: 4,
      projectName: 'Port Harcourt Solar Hub',
      location: 'Port Harcourt, Rivers',
      capacity: 400,
      todayProduction: 980,
      monthlyProduction: 35000,
      yearlyProduction: 420000,
      efficiency: 85,
      status: 'optimal',
      lastMaintenance: '2024-01-10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <Activity className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      case 'offline': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const totalCapacity = productionData.reduce((sum, project) => sum + project.capacity, 0);
  const totalTodayProduction = productionData.reduce((sum, project) => sum + project.todayProduction, 0);
  const totalMonthlyProduction = productionData.reduce((sum, project) => sum + project.monthlyProduction, 0);
  const averageEfficiency = productionData.reduce((sum, project) => sum + project.efficiency, 0) / productionData.length;

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
            Energy Production
          </h1>
          <p className="text-zinc-400">
            Monitor real-time energy production across all projects
          </p>
        </div>

        {/* Period Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['day', 'week', 'month', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period 
                ? "bg-gradient-to-r from-oga-green to-oga-green-light text-white" 
                : "border-oga-green/50 text-oga-green hover:bg-oga-green/10"
              }
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Capacity</CardTitle>
              <Sun className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{totalCapacity.toLocaleString()} kW</div>
              <p className="text-xs text-oga-green">Installed capacity</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Today's Production</CardTitle>
              <Zap className="h-4 w-4 text-oga-yellow" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-oga-yellow">{totalTodayProduction.toLocaleString()} kWh</div>
              <p className="text-xs text-oga-green">Energy generated today</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Monthly Production</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-blue-400">{totalMonthlyProduction.toLocaleString()} kWh</div>
              <p className="text-xs text-oga-green">This month's output</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-green-400">{averageEfficiency.toFixed(1)}%</div>
              <p className="text-xs text-oga-green">System efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Production Projects */}
        <div className="space-y-6">
          {productionData.map((project) => (
            <Card key={project.id} className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
              <CardHeader className="relative">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-oga-green to-oga-green-light flex items-center justify-center">
                      <Sun className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{project.projectName}</CardTitle>
                      <p className="text-sm text-oga-green">{project.location}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(project.status)} text-white flex items-center gap-1`}>
                    {getStatusIcon(project.status)}
                    {project.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-6">
                  {/* Production Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <Battery className="w-5 h-5 text-oga-green mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{project.capacity} kW</p>
                      <p className="text-xs text-oga-green">Capacity</p>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <Zap className="w-5 h-5 text-oga-yellow mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{project.todayProduction.toLocaleString()}</p>
                      <p className="text-xs text-oga-green">Today (kWh)</p>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{project.monthlyProduction.toLocaleString()}</p>
                      <p className="text-xs text-oga-green">Month (kWh)</p>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{project.efficiency}%</p>
                      <p className="text-xs text-oga-green">Efficiency</p>
                    </div>
                  </div>

                  {/* Efficiency Progress */}
                  <div>
                    <div className="flex justify-between text-sm text-oga-green mb-2">
                      <span>System Efficiency</span>
                      <span>{project.efficiency}%</span>
                    </div>
                    <Progress value={project.efficiency} className="h-3 mb-2" />
                    <p className="text-xs text-gray-400">Last maintenance: {project.lastMaintenance}</p>
                  </div>

                  {/* Energy Production Chart Placeholder */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-white font-semibold mb-2">Production Trend</h4>
                    <div className="h-32 bg-gradient-to-r from-oga-green/20 to-oga-yellow/20 rounded flex items-center justify-center">
                      <p className="text-oga-green text-sm">Production chart visualization</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
                    >
                      View Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-oga-green/50 text-oga-green hover:bg-oga-green/10"
                    >
                      Performance Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Schedule Maintenance
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