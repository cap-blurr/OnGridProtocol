"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  Clock,
  Code,
  Terminal,
  Box,
  Settings,
  Network,
  Server,
  Database,
  Sun,
  BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserType } from "@/providers/userType";
import { useAccount } from "wagmi";
import LoadingScreen from "@/components/ui/loading-screen";
import SwitchAccountButton from "@/components/wallet/SwitchAccountButton";
import { useRouter } from 'next/navigation';
import { DashboardTabs } from "@/components/ui/custom-tabs";

// Mock data for developer dashboard
const mockData = {
  apiKeys: [
    { name: "Production API Key", key: "ogp_prod_xxxxxxxxxxxxx", status: "Active", created: "2023-12-01" },
    { name: "Development API Key", key: "ogp_dev_xxxxxxxxxxxxx", status: "Active", created: "2023-11-15" },
    { name: "Test API Key", key: "ogp_test_xxxxxxxxxxxxx", status: "Inactive", created: "2023-10-30" },
  ],
  projects: [
    { 
      id: "proj-1", 
      name: "Residential Solar Array", 
      status: "Live", 
      apiCalls: 2345, 
      lastActive: "2 mins ago",
      endpointUsage: [
        { endpoint: "/energy/metrics", calls: 980 },
        { endpoint: "/carbon/offset", calls: 765 },
        { endpoint: "/transactions", calls: 600 },
      ]
    },
    { 
      id: "proj-2", 
      name: "Commercial Solar Farm", 
      status: "Testing", 
      apiCalls: 1430, 
      lastActive: "1 hour ago",
      endpointUsage: [
        { endpoint: "/energy/metrics", calls: 540 },
        { endpoint: "/carbon/offset", calls: 410 },
        { endpoint: "/transactions", calls: 480 },
      ]
    },
    { 
      id: "proj-3", 
      name: "Community Solar Grid", 
      status: "Development", 
      apiCalls: 756, 
      lastActive: "4 hours ago",
      endpointUsage: [
        { endpoint: "/energy/metrics", calls: 280 },
        { endpoint: "/carbon/offset", calls: 356 },
        { endpoint: "/transactions", calls: 120 },
      ]
    },
  ],
  analytics: {
    totalCalls: 4531,
    successRate: 99.7,
    averageLatency: "45ms",
    dailyGrowth: 12.5,
  },
  recentActivities: [
    { event: "New Solar Project", time: "2 hours ago", project: "Commercial Solar Farm" },
    { event: "Energy Data Updated", time: "Yesterday", project: "Residential Solar Array" },
    { event: "Efficiency Alert", time: "2 days ago", project: "Community Solar Grid" },
  ]
};

export default function SolarDeveloperDashboard() {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { isConnected } = useAccount();
  const { userType, isLoading } = useUserType();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects");

  // Add auth redirection only for developer dashboard access
  useEffect(() => {
    // First wait for auth state to be loaded
    if (isLoading) return;
    
    // Redirect unauthenticated users to home
    if (!isConnected) {
      router.push('/');
      return;
    }
    
    // Redirect users with no type selection to home
    // They'll be shown the account type modal
    if (isConnected && !userType) {
      return;
    }
    
    // Redirect normal users to regular dashboard
    if (userType === 'normal') {
      router.push('/dashboard');
      return;
    }
    
    // User is authenticated and a developer, allow access
    setIsLoadingAuth(false);
  }, [isConnected, userType, isLoading, router]);

  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const handleGenerateKey = async () => {
    setIsGeneratingKey(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGeneratingKey(false);
  };
  
  if (isLoadingAuth) {
    return <LoadingScreen />;
  }

  // Not a developer - handled by the useEffect
  if (!userType || userType !== 'developer') {
    return null;
  }

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
            Solar Developer Platform
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
          </span>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Solar Developer Dashboard
          </h1>
          <p className="text-zinc-400">
            Manage your solar projects and DePIN infrastructure
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 p-4">
              <CardTitle className="text-sm font-medium text-white">Total Energy Data</CardTitle>
              <Sun className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative p-4 pt-0">
              <div className="text-xl md:text-2xl font-bold text-white">{mockData.analytics.totalCalls.toLocaleString()}</div>
              <p className="text-xs text-emerald-400">
                <span className="inline-flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {mockData.analytics.dailyGrowth}%
                </span>{" "}
                from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 p-4">
              <CardTitle className="text-sm font-medium text-white">Panel Efficiency</CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative p-4 pt-0">
              <div className="text-xl md:text-2xl font-bold text-white">{mockData.analytics.successRate}%</div>
              <Progress value={mockData.analytics.successRate} className="h-1 mt-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 p-4">
              <CardTitle className="text-sm font-medium text-white">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative p-4 pt-0">
              <div className="text-xl md:text-2xl font-bold text-white">{mockData.analytics.averageLatency}</div>
              <p className="text-xs text-emerald-400">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 p-4">
              <CardTitle className="text-sm font-medium text-white">DePIN Status</CardTitle>
              <Network className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative p-4 pt-0">
              <div className="text-xl md:text-2xl font-bold text-white">Operational</div>
              <p className="text-xs text-emerald-400">
                All systems online
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Generate API Key Button - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <SwitchAccountButton />
          </div>
          <Button 
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
            onClick={handleGenerateKey}
            disabled={isGeneratingKey}
          >
            {isGeneratingKey ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}
            Generate New API Key
          </Button>
        </div>
        
        {/* Main Content Tabs */}
        <DashboardTabs
          tabs={[
            { value: "projects", label: "Solar Projects" },
            { value: "api-keys", label: "API Keys" },
            { value: "endpoints", label: "Endpoints" }
          ]}
          activeTab={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsContent value="projects" className="space-y-4">
            <div className="overflow-x-auto -mx-3 px-3">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-zinc-800/50 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Project Name</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Energy Data</TableHead>
                    <TableHead className="text-zinc-400 text-right">Last Update</TableHead>
                    <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.projects.map((project) => (
                    <TableRow key={project.id} className="border-b border-zinc-800/20 hover:bg-zinc-800/10">
                      <TableCell className="font-medium text-white">{project.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            project.status === "Live"
                              ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
                              : project.status === "Testing"
                              ? "bg-yellow-900/30 text-yellow-300 border-yellow-700"
                              : "bg-blue-900/30 text-blue-300 border-blue-700"
                          }`}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.apiCalls.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{project.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-4">
            <div className="overflow-x-auto -mx-3 px-3">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-zinc-800/50 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Key Name</TableHead>
                    <TableHead className="text-zinc-400">Key</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Created</TableHead>
                    <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.apiKeys.map((key, i) => (
                    <TableRow key={i} className="border-b border-zinc-800/20 hover:bg-zinc-800/10">
                      <TableCell className="font-medium text-white">{key.name}</TableCell>
                      <TableCell className="font-mono text-sm">{key.key}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            key.status === "Active"
                              ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
                              : "bg-zinc-900/30 text-zinc-300 border-zinc-700"
                          }`}
                        >
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{key.created}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="endpoints" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockData.projects.map((project) => (
                <Card key={project.id} className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                  
                  <CardHeader className="relative">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">{project.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`${
                          project.status === "Live"
                            ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
                            : project.status === "Testing"
                            ? "bg-yellow-900/30 text-yellow-300 border-yellow-700"
                            : "bg-blue-900/30 text-blue-300 border-blue-700"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-4">
                    <div className="space-y-2">
                      {project.endpointUsage.map((endpoint, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="font-mono text-sm text-zinc-300">{endpoint.endpoint}</div>
                          <div className="text-sm text-zinc-400">{endpoint.calls.toLocaleString()} calls</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                      <div className="text-sm text-zinc-400">Last active: {project.lastActive}</div>
                      <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
                        View Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </DashboardTabs>
        
        {/* Recent Activity Card */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden mt-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="text-white">Recent DePIN Activity</CardTitle>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="space-y-4">
              {mockData.recentActivities.map((activity, i) => (
                <div key={i} className="flex justify-between items-center pb-3 border-b border-zinc-800/30">
                  <div>
                    <div className="font-medium text-white">{activity.event}</div>
                    <div className="text-xs text-zinc-400">Project: {activity.project}</div>
                  </div>
                  <div className="text-sm text-zinc-300">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 