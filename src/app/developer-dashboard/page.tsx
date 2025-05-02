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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GradientSection from "@/components/ui/gradient-section";
import { useUserType } from "@/providers/userType";
import { useAccount } from "wagmi";
import LoadingScreen from "@/components/ui/loading-screen";
import SwitchAccountButton from "@/components/wallet/SwitchAccountButton";
import { useRouter } from 'next/navigation';

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
      name: "Solar Farm Integration", 
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
      name: "Wind Energy API", 
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
      name: "Carbon Credit Tracking", 
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
    { event: "API Key Created", time: "2 hours ago", project: "Wind Energy API" },
    { event: "Endpoint Added", time: "Yesterday", project: "Solar Farm Integration" },
    { event: "Error Rate Alert", time: "2 days ago", project: "Carbon Credit Tracking" },
  ]
};

export default function DeveloperDashboard() {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { isConnected } = useAccount();
  const { userType, isLoading } = useUserType();
  const router = useRouter();

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
    <GradientSection>
      <div className="min-h-screen pt-32 dark">
        <div className="container mx-auto px-4 py-8">
          {/* Header and Stats */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-200 mb-4">
                  Developer Dashboard
                </h1>
                <p className="text-zinc-400">
                  Manage your API keys, endpoints, and integration metrics
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <SwitchAccountButton />
                <Button 
                  className="bg-oga-green hover:bg-oga-green-dark text-white rounded-full flex items-center gap-2"
                  onClick={handleGenerateKey}
                  disabled={isGeneratingKey}
                >
                  {isGeneratingKey ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}
                  Generate New API Key
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
                  <Database className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.analytics.totalCalls.toLocaleString()}</div>
                  <p className="text-xs text-zinc-500">
                    <span className="text-emerald-500 inline-flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {mockData.analytics.dailyGrowth}%
                    </span>{" "}
                    from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Box className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.analytics.successRate}%</div>
                  <Progress value={mockData.analytics.successRate} className="h-1 mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
                  <Clock className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.analytics.averageLatency}</div>
                  <p className="text-xs text-zinc-500">
                    Last 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Status</CardTitle>
                  <Network className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Operational</div>
                  <p className="text-xs text-zinc-500">
                    All systems online
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="projects" className="space-y-4">
                <TabsList className="bg-transparent h-10 rounded-full">
                  <TabsTrigger
                    value="projects"
                    className="flex-1 rounded-full h-full data-[state=active]:bg-oga-green"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="api-keys"
                    className="flex-1 rounded-full h-full data-[state=active]:bg-oga-green"
                  >
                    API Keys
                  </TabsTrigger>
                  <TabsTrigger
                    value="endpoints"
                    className="flex-1 rounded-full h-full data-[state=active]:bg-oga-green"
                  >
                    Endpoints
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="projects">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/5">
                    <CardHeader>
                      <CardTitle>Your Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-700">
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>API Calls</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockData.projects.map((project, index) => (
                            <TableRow key={index} className="border-zinc-800">
                              <TableCell className="font-medium">
                                {project.name}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    project.status === "Live"
                                      ? "bg-emerald-500/20 text-emerald-500"
                                      : project.status === "Testing"
                                      ? "bg-amber-500/20 text-amber-500"
                                      : "bg-blue-500/20 text-blue-500"
                                  }`}
                                >
                                  {project.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{project.apiCalls.toLocaleString()}</TableCell>
                              <TableCell>{project.lastActive}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" className="h-8 border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-200">
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="api-keys">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/5">
                    <CardHeader>
                      <CardTitle>API Keys</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-700">
                            <TableHead>Name</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockData.apiKeys.map((apiKey, index) => (
                            <TableRow key={index} className="border-zinc-800">
                              <TableCell className="font-medium">
                                {apiKey.name}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {apiKey.key}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    apiKey.status === "Active"
                                      ? "bg-emerald-500/20 text-emerald-500"
                                      : "bg-red-500/20 text-red-500"
                                  }`}
                                >
                                  {apiKey.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{apiKey.created}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" className="h-8 border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-200">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="endpoints">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/5">
                    <CardHeader>
                      <CardTitle>Endpoint Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {mockData.projects.map((project, index) => (
                          <div key={index} className="space-y-3">
                            <h3 className="font-medium text-zinc-200">{project.name}</h3>
                            <div className="space-y-2">
                              {project.endpointUsage.map((endpoint, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                                    <span className="text-sm font-mono text-zinc-400">{endpoint.endpoint}</span>
                                  </div>
                                  <span className="text-zinc-300">{endpoint.calls} calls</span>
                                </div>
                              ))}
                            </div>
                            <Progress value={70} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-emerald-900/30 hover:bg-black/50 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <Terminal className="h-5 w-5 text-emerald-500 mr-3" />
                        <span>API Reference</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-emerald-900/30 hover:bg-black/50 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <Code className="h-5 w-5 text-emerald-500 mr-3" />
                        <span>Code Examples</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-emerald-900/30 hover:bg-black/50 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-emerald-500 mr-3" />
                        <span>Integration Guide</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/5">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.event}</p>
                          <p className="text-xs text-zinc-400">
                            {activity.time} • {activity.project}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Network Alert */}
              <Alert className="bg-[#28a745]/20 border border-[#28a745]/50">
                <AlertDescription className="text-[#28a745] flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  API rate limits increased by 20%
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </GradientSection>
  );
} 