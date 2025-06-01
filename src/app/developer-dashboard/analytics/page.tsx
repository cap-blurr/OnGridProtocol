'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Activity,
  Sun,
  Wind,
  Leaf,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function EnergyProductionAnalytics() {
  const energyData = [
    {
      id: 1,
      name: 'Lagos Solar Farm Alpha',
      type: 'Solar',
      capacity: '5.2 MW',
      currentOutput: '4.8 MW',
      efficiency: 92.3,
      monthlyProduction: 1850,
      co2Saved: 925,
      status: 'online',
      trend: 'up',
      trendValue: 12.5
    },
    {
      id: 2,
      name: 'Abuja Community Solar',
      type: 'Solar',
      capacity: '3.0 MW',
      currentOutput: '2.1 MW',
      efficiency: 70.0,
      monthlyProduction: 1200,
      co2Saved: 600,
      status: 'online',
      trend: 'down',
      trendValue: -5.3
    },
    {
      id: 3,
      name: 'Kano Wind Project',
      type: 'Wind',
      capacity: '8.0 MW',
      currentOutput: '6.4 MW',
      efficiency: 80.0,
      monthlyProduction: 2800,
      co2Saved: 1400,
      status: 'maintenance',
      trend: 'up',
      trendValue: 8.1
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
      case 'Solar': return <Sun className="w-5 h-5 text-[#FFDC00]" />;
      case 'Wind': return <Wind className="w-5 h-5 text-blue-400" />;
      default: return <Zap className="w-5 h-5 text-[#3D9970]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3D9970] to-[#FFDC00] bg-clip-text text-transparent mb-2">
          Energy Production Analytics
        </h1>
        <p className="text-zinc-400">
          Monitor real-time energy production and performance metrics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Capacity</CardTitle>
            <Zap className="h-4 w-4 text-[#3D9970]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCapacity.toFixed(1)} MW</div>
            <p className="text-xs text-gray-400">Installed capacity</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Current Output</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{totalCurrentOutput.toFixed(1)} MW</div>
            <p className="text-xs text-green-400">{((totalCurrentOutput / totalCapacity) * 100).toFixed(1)}% of capacity</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Monthly Production</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{totalMonthlyProduction.toLocaleString()}</div>
            <p className="text-xs text-gray-400">MWh this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FFDC00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFDC00]">{avgEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">Performance ratio</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">CO₂ Saved</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalCO2Saved.toLocaleString()}</div>
            <p className="text-xs text-gray-400">tons this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Project Analytics */}
      <div className="space-y-6">
        {energyData.map((project) => (
          <Card key={project.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-[#3D9970]/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(project.type)}
                  <div>
                    <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-gray-400">{project.type} Energy • {project.capacity} Capacity</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(project.status)} text-white`}>
                  {project.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Current Output */}
                <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                  <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{project.currentOutput}</p>
                  <p className="text-sm text-gray-400">Current Output</p>
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
                <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-[#FFDC00] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{project.efficiency}%</p>
                  <p className="text-sm text-gray-400">Efficiency</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-[#3D9970] to-[#4CAF50] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.efficiency}%` }}
                    ></div>
                  </div>
                </div>

                {/* Monthly Production */}
                <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{project.monthlyProduction.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">MWh/Month</p>
                  <p className="text-xs text-blue-400 mt-1">+15% vs last month</p>
                </div>

                {/* CO2 Saved */}
                <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                  <Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{project.co2Saved}</p>
                  <p className="text-sm text-gray-400">CO₂ Tons Saved</p>
                  <p className="text-xs text-green-400 mt-1">Environmental Impact</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-700/50">
                <Button className="bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white">
                  View Detailed Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#3D9970]/50 text-[#3D9970] hover:bg-[#3D9970]/10"
                >
                  Performance Report
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
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
        <Button className="bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white px-8 py-3">
          Generate Monthly Report
        </Button>
        <Button 
          variant="outline" 
          className="border-[#FFDC00] text-[#FFDC00] hover:bg-[#FFDC00]/10 px-8 py-3"
        >
          Export Data
        </Button>
      </div>
    </div>
  );
} 