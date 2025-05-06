"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Battery,
  BatteryCharging,
  RefreshCcw,
  Zap,
  SunMedium,
  Wind,
  Droplets,
  TreePine,
  AlertTriangle,
  CheckCircle2,
  Info,
  Settings,
  ArrowUpRight,
  BarChart4
} from "lucide-react";

// Mock data for device stats
const mockDeviceStats = {
  overview: {
    totalDevices: 12,
    activeDevices: 10,
    totalEnergyOutput: 7850,
    averageEfficiency: 92.4,
    outageHours: 8.5
  },
  deviceTypes: [
    { type: "Solar", count: 5, output: 3500, efficiency: 94.2 },
    { type: "Wind", count: 3, output: 2800, efficiency: 89.7 },
    { type: "Hydro", count: 2, output: 1200, efficiency: 95.3 },
    { type: "Biomass", count: 1, output: 350, efficiency: 88.5 },
  ],
  devices: [
    {
      id: "dev-1",
      name: "Solar Array Alpha",
      type: "Solar",
      status: "Active",
      output: 850,
      capacity: 900,
      efficiency: 94.4,
      lastMaintenance: "2024-03-15",
      location: "California, USA"
    },
    {
      id: "dev-2",
      name: "Solar Array Beta",
      type: "Solar",
      status: "Active",
      output: 780,
      capacity: 850,
      efficiency: 91.8,
      lastMaintenance: "2024-04-02",
      location: "California, USA"
    },
    {
      id: "dev-3",
      name: "Solar Array Gamma",
      type: "Solar",
      status: "Active",
      output: 720,
      capacity: 800,
      efficiency: 90.0,
      lastMaintenance: "2024-02-28",
      location: "Arizona, USA"
    },
    {
      id: "dev-4",
      name: "Wind Turbine Cluster 1",
      type: "Wind",
      status: "Active",
      output: 980,
      capacity: 1100,
      efficiency: 89.1,
      lastMaintenance: "2024-03-10",
      location: "Texas, USA"
    },
    {
      id: "dev-5",
      name: "Wind Turbine Cluster 2",
      type: "Wind",
      status: "Maintenance",
      output: 0,
      capacity: 950,
      efficiency: 0,
      lastMaintenance: "2024-05-20",
      location: "Texas, USA"
    },
    {
      id: "dev-6",
      name: "Hydroelectric Station A",
      type: "Hydro",
      status: "Active",
      output: 650,
      capacity: 680,
      efficiency: 95.6,
      lastMaintenance: "2024-04-15",
      location: "Oregon, USA"
    }
  ],
  dailyOutput: [
    { day: "Mon", output: 1240 },
    { day: "Tue", output: 1180 },
    { day: "Wed", output: 1350 },
    { day: "Thu", output: 1270 },
    { day: "Fri", output: 1200 },
    { day: "Sat", output: 950 },
    { day: "Sun", output: 920 }
  ],
  alerts: [
    {
      id: 1,
      device: "Wind Turbine Cluster 2",
      type: "Maintenance",
      message: "Scheduled maintenance in progress",
      time: "2024-05-20 08:00",
      severity: "Info"
    },
    {
      id: 2,
      device: "Solar Array Delta",
      type: "Performance",
      message: "Output below expected levels (15%)",
      time: "2024-05-18 14:30",
      severity: "Warning"
    },
    {
      id: 3,
      device: "Biomass Generator A",
      type: "System",
      message: "Temperature levels above normal range",
      time: "2024-05-18 11:15",
      severity: "Warning"
    }
  ]
};

// Get device type icon
const getDeviceIcon = (type: string) => {
  switch (type) {
    case "Solar":
      return <SunMedium className="h-5 w-5 text-yellow-500" />;
    case "Wind":
      return <Wind className="h-5 w-5 text-blue-400" />;
    case "Hydro":
      return <Droplets className="h-5 w-5 text-blue-500" />;
    case "Biomass":
      return <TreePine className="h-5 w-5 text-green-500" />;
    default:
      return <Zap className="h-5 w-5 text-emerald-500" />;
  }
};

// Get alert severity badge
const getAlertBadge = (severity: string) => {
  switch (severity) {
    case "Critical":
      return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-700">Critical</Badge>;
    case "Warning":
      return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-700">Warning</Badge>;
    case "Info":
      return <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-700">Info</Badge>;
    default:
      return <Badge variant="outline" className="bg-zinc-500/20 text-zinc-400 border-zinc-600">Unknown</Badge>;
  }
};

// Get device status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-700">Active</Badge>;
    case "Maintenance":
      return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-700">Maintenance</Badge>;
    case "Offline":
      return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-700">Offline</Badge>;
    default:
      return <Badge variant="outline" className="bg-zinc-500/20 text-zinc-400 border-zinc-600">Unknown</Badge>;
  }
};

export default function DeviceStatsPage() {
  return (
    <div className="relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative">
        <div className="mb-8 relative pl-6">
          {/* Thin accent line */}
          <div className="absolute -left-4 top-0 h-full w-px bg-emerald-700/30" />
          
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-emerald-500 mb-2 relative">
            Carbon Credits
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
          </span>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Device Energy Stats
          </h1>
          <p className="text-zinc-400">
            Monitor performance of your renewable energy devices
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Active Devices
              </CardTitle>
              <BatteryCharging className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockDeviceStats.overview.activeDevices}/{mockDeviceStats.overview.totalDevices}
              </div>
              <p className="text-xs text-emerald-400">
                {Math.round((mockDeviceStats.overview.activeDevices / mockDeviceStats.overview.totalDevices) * 100)}% operational
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Energy Output
              </CardTitle>
              <Zap className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockDeviceStats.overview.totalEnergyOutput.toLocaleString()} <span className="text-base ml-1">kWh</span>
              </div>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-400">5.2% increase from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Average Efficiency
              </CardTitle>
              <Battery className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockDeviceStats.overview.averageEfficiency}%
              </div>
              <Progress 
                value={mockDeviceStats.overview.averageEfficiency} 
                className="h-1.5 mt-2 bg-zinc-800" 
                indicatorClassName="bg-emerald-500" 
              />
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Outage Hours
              </CardTitle>
              <RefreshCcw className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockDeviceStats.overview.outageHours}
              </div>
              <p className="text-xs text-emerald-400">
                99.5% uptime last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Device Output Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  Daily Energy Output (kWh)
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Last 7 days performance across all devices
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="h-64 flex items-end justify-between gap-3">
                  {mockDeviceStats.dailyOutput.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-14 bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors rounded-t-sm border border-emerald-600/50 relative group" 
                        style={{ height: `${(day.output / 1500) * 100}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 border border-emerald-600/50 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                          {day.output} kWh
                        </div>
                      </div>
                      <span className="text-xs text-zinc-400">{day.day}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4 border-t border-zinc-800/50 pt-4">
                  <div>
                    <p className="text-sm text-zinc-400">Weekly Total</p>
                    <p className="text-lg font-medium text-white">
                      {mockDeviceStats.dailyOutput.reduce((total, day) => total + day.output, 0).toLocaleString()} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Daily Average</p>
                    <p className="text-lg font-medium text-white">
                      {Math.round(mockDeviceStats.dailyOutput.reduce((total, day) => total + day.output, 0) / mockDeviceStats.dailyOutput.length).toLocaleString()} kWh
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart4 className="h-5 w-5 text-emerald-500" />
                  Output By Device Type
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {mockDeviceStats.deviceTypes.map((deviceType, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(deviceType.type)}
                          <span className="text-white">{deviceType.type}</span>
                        </div>
                        <div className="text-xs text-zinc-400">
                          {deviceType.count} {deviceType.count === 1 ? 'device' : 'devices'}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-400">Output</span>
                          <span className="text-emerald-400">{deviceType.output.toLocaleString()} kWh</span>
                        </div>
                        <Progress 
                          value={(deviceType.output / mockDeviceStats.overview.totalEnergyOutput) * 100} 
                          className="h-1.5 bg-zinc-800" 
                          indicatorClassName="bg-emerald-500" 
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Efficiency</span>
                        <span className="text-white">{deviceType.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Devices and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="h-5 w-5 text-emerald-500" />
                    Device Performance Monitor
                  </CardTitle>
                  <Button variant="outline" size="sm" className="border-emerald-800 hover:bg-emerald-900/20 text-emerald-400">
                    View All Devices
                  </Button>
                </div>
                <CardDescription className="text-zinc-400">
                  Real-time status and performance of energy generating devices
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {mockDeviceStats.devices.map((device) => (
                    <div key={device.id} className="p-4 border border-zinc-800/50 rounded-lg">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.type)}
                          <div>
                            <h3 className="font-medium text-white">{device.name}</h3>
                            <p className="text-xs text-zinc-400">{device.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(device.status)}
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/70">
                            <Info className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-zinc-400">Energy Output</p>
                          <p className="text-base font-medium text-white">
                            {device.status === "Active" 
                              ? `${device.output.toLocaleString()} kWh` 
                              : "Offline"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Capacity Utilization</p>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={device.status === "Active" ? (device.output / device.capacity) * 100 : 0} 
                              className="h-1.5 bg-zinc-800 flex-1" 
                              indicatorClassName="bg-emerald-500" 
                            />
                            <span className="text-xs text-white">
                              {device.status === "Active" 
                                ? `${Math.round((device.output / device.capacity) * 100)}%` 
                                : "0%"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">Last Maintenance</p>
                          <p className="text-base font-medium text-white">{device.lastMaintenance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5 text-emerald-500" />
                  Recent Alerts
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  System notifications and warnings
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {mockDeviceStats.alerts.map((alert) => (
                    <div key={alert.id} className="p-3 border border-zinc-800/50 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium text-white">{alert.device}</h4>
                          <p className="text-xs text-zinc-400">{alert.time}</p>
                        </div>
                        {getAlertBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-zinc-300">{alert.message}</p>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-4 pt-2 border-t border-zinc-800/50">
                  <Button variant="outline" size="sm" className="border-emerald-800 hover:bg-emerald-900/20 text-emerald-400 mt-2">
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 