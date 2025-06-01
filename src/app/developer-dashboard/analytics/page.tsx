'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  TrendingUp, 
  Activity,
  Sun,
  Wind,
  Leaf,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function EnergyProductionAnalytics() {
  const energyData = [
    {
      id: 1,
      name: 'Lagos Solar Farm Alpha',
      type: 'Solar',
      capacity: '2.5 MW',
      currentOutput: '2.1 MW',
      efficiency: 84,
      status: 'online',
      monthlyProduction: 312,
      co2Saved: 156,
      trend: 'up',
      trendValue: 8.5
    },
    {
      id: 2,
      name: 'Abuja Wind Park Beta',
      type: 'Wind',
      capacity: '5.0 MW',
      currentOutput: '3.8 MW',
      efficiency: 76,
      status: 'online',
      monthlyProduction: 520,
      co2Saved: 260,
      trend: 'up',
      trendValue: 12.3
    },
    {
      id: 3,
      name: 'Kano Solar Grid',
      type: 'Solar',
      capacity: '1.8 MW',
      currentOutput: '0.0 MW',
      efficiency: 0,
      status: 'maintenance',
      monthlyProduction: 85,
      co2Saved: 42,
      trend: 'down',
      trendValue: -15.2
    }
  ];

  const totalCapacity = energyData.reduce((sum, project) => sum + parseFloat(project.capacity), 0);
  const totalCurrentOutput = energyData.reduce((sum, project) => sum + parseFloat(project.currentOutput), 0);
  const totalMonthlyProduction = energyData.reduce((sum, project) => sum + project.monthlyProduction, 0);
  const totalCO2Saved = energyData.reduce((sum, project) => sum + project.co2Saved, 0);
  const avgEfficiency = energyData.reduce((sum, project) => sum + project.efficiency, 0) / energyData.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Solar': return <Sun className="w-5 h-5 text-oga-yellow" />;
      case 'Wind': return <Wind className="w-5 h-5 text-blue-400" />;
      default: return <Zap className="w-5 h-5 text-oga-green" />;
    }
  };

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
            Energy Production Analytics
          </h1>
          <p className="text-zinc-400">
            Monitor real-time energy production and performance metrics
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Capacity</CardTitle>
              <Zap className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">{totalCapacity.toFixed(1)} MW</div>
              <p className="text-xs text-oga-green">Installed capacity</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Current Output</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-green-400">{totalCurrentOutput.toFixed(1)} MW</div>
              <p className="text-xs text-green-400">{((totalCurrentOutput / totalCapacity) * 100).toFixed(1)}% of capacity</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Monthly Production</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-blue-400">{totalMonthlyProduction.toLocaleString()}</div>
              <p className="text-xs text-oga-green">MWh this month</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-oga-yellow" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-oga-yellow">{avgEfficiency.toFixed(1)}%</div>
              <p className="text-xs text-oga-green">Performance ratio</p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">CO₂ Saved</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-green-600">{totalCO2Saved.toLocaleString()}</div>
              <p className="text-xs text-oga-green">tons this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Project Analytics */}
        <div className="space-y-6">
          {energyData.map((project) => (
            <Card key={project.id} className="relative bg-black/40 backdrop-blur-sm border border-oga-green/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-oga-green/20 to-transparent pointer-events-none" />
              <CardHeader className="relative">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                    {getTypeIcon(project.type)}
                    <div>
                      <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-oga-green">{project.type} Energy • {project.capacity} Capacity</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(project.status)} text-white`}>
                    {project.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Current Output */}
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{project.currentOutput}</p>
                    <p className="text-sm text-oga-green">Current Output</p>
                    <div className="flex items-center justify-center mt-1">
                      {project.trend === 'up' ? (
                        <ArrowUp className="w-3 h-3 text-green-400 mr-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-400 mr-1" />
                      )}
                      <span className={`text-xs ${project.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {project.trendValue}%
                      </span>
                    </div>
                  </div>

                  {/* Efficiency */}
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-oga-yellow mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{project.efficiency}%</p>
                    <p className="text-sm text-oga-green">Efficiency</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-oga-green to-oga-green-light h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.efficiency}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Monthly Production */}
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{project.monthlyProduction.toLocaleString()}</p>
                    <p className="text-sm text-oga-green">MWh/Month</p>
                    <p className="text-xs text-blue-400 mt-1">+15% vs last month</p>
                  </div>

                  {/* CO2 Saved */}
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{project.co2Saved}</p>
                    <p className="text-sm text-oga-green">CO₂ Tons Saved</p>
                    <p className="text-xs text-green-400 mt-1">Environmental Impact</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700/50">
                  <Button className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white hover:text-white font-medium transition-all duration-200">
                    View Detailed Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-oga-green/50 text-oga-green hover:bg-oga-green/20 hover:text-oga-green hover:border-oga-green font-medium transition-all duration-200"
                  >
                    Performance Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 font-medium transition-all duration-200"
                  >
                    Maintenance Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white hover:text-white font-medium transition-all duration-200 px-8 py-3">
            Generate Monthly Report
          </Button>
          <Button 
            variant="outline" 
            className="border-oga-yellow text-oga-yellow hover:bg-oga-yellow/20 hover:text-oga-yellow hover:border-oga-yellow font-medium transition-all duration-200 px-8 py-3"
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
} 