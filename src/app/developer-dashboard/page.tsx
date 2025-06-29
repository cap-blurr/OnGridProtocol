"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  BarChart3,
  AlertCircle,
  Check,
  ExternalLink,
  FileText,
  Loader2,
  ShieldCheck,
  DollarSign,
  CheckCircle2,
  Bell,
  CreditCard
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserType } from "@/providers/userType";
import { useAccount, useChainId } from "wagmi";
import { useIsVerified } from "@/hooks/contracts/useDeveloperRegistry";
import LoadingScreen from "@/components/ui/loading-screen";
import SwitchAccountButton from "@/components/wallet/SwitchAccountButton";
import { useRouter } from 'next/navigation';
import { DashboardTabs } from "@/components/ui/custom-tabs";
import toast from 'react-hot-toast';
import CreateProjectModal from "@/components/developer/CreateProjectModal";
import { getAddresses, NetworkAddresses } from "@/contracts/addresses";
import { useDeveloperProjects, OnChainProject, IPFS_GATEWAY_PREFIX } from "@/hooks/contracts/useDeveloperProjects";
import { useAllContractEvents, useUserEvents } from "@/hooks/contracts/useContractEvents";
import { useUSDCBalance } from "@/hooks/contracts/useUSDC";
import PoolInfoTest from "@/components/developer/PoolInfoTest";
import PoolInvestmentCard from "@/components/project/PoolInvestmentCard";

// Mock data for solar developer dashboard
const mockData = {
  projects: [
    { 
      id: "proj-1", 
      name: "Residential Solar Array", 
      status: "Live", 
      energyOutput: 2345, 
      lastActive: "2 mins ago",
      solarMetrics: [
        { metric: "Energy Generated", value: 980 },
        { metric: "Carbon Offset", value: 765 },
        { metric: "Efficiency Rate", value: 94 },
      ]
    },
    { 
      id: "proj-2", 
      name: "Commercial Solar Farm", 
      status: "Testing", 
      energyOutput: 1430, 
      lastActive: "1 hour ago",
      solarMetrics: [
        { metric: "Energy Generated", value: 540 },
        { metric: "Carbon Offset", value: 410 },
        { metric: "Efficiency Rate", value: 89 },
      ]
    },
    { 
      id: "proj-3", 
      name: "Community Solar Grid", 
      status: "Development", 
      energyOutput: 756, 
      lastActive: "4 hours ago",
      solarMetrics: [
        { metric: "Energy Generated", value: 280 },
        { metric: "Carbon Offset", value: 356 },
        { metric: "Efficiency Rate", value: 92 },
      ]
    },
  ],
  analytics: {
    totalEnergy: 4531,
    averageEfficiency: 99.7,
    responseTime: "45ms",
    dailyGrowth: 12.5,
  },
  recentActivities: [
    { event: "New Solar Project", time: "2 hours ago", project: "Commercial Solar Farm" },
    { event: "Energy Data Updated", time: "Yesterday", project: "Residential Solar Array" },
    { event: "Efficiency Alert", time: "2 days ago", project: "Community Solar Grid" },
  ]
};

// Helper function to safely get an error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return "An unknown error occurred";
}

export default function SolarDeveloperDashboard() {
  const { address: connectedAddress, isConnected } = useAccount();
  const { userType, isLoading: isLoadingUserType } = useUserType();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects");
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const chainId = useChainId();
  const [currentAddresses, setCurrentAddresses] = useState<NetworkAddresses | undefined>(undefined);
  
  const { data: kycStatus, isLoading: isLoadingKyc, error: kycError } = useIsVerified(connectedAddress);

  // Fetch developer projects
  const { 
    projects: developerProjects, 
    isLoading: isLoadingProjects, 
    error: projectsError,
    refetchProjects 
  } = useDeveloperProjects();

  // Phase 3: Event monitoring and real-time updates
  const { events: userEvents } = useUserEvents(connectedAddress);
  const { events: allEvents } = useAllContractEvents();
  const { formattedBalance: usdcBalance } = useUSDCBalance(connectedAddress);
  
  // Phase 3: Recent notifications from contract events
  const recentNotifications = userEvents.slice(0, 5).map(event => {
    switch (event.type) {
      case 'ProjectCreated':
        return {
          id: event.id,
          type: 'success' as const,
          title: 'Project Created',
          message: `Solar project #${event.data?.projectId} created successfully`,
          timestamp: new Date(event.timestamp),
          actionUrl: `/developer-dashboard/projects/${event.data?.projectId}`
        };
      case 'RepaymentRouted':
        return {
          id: event.id,
          type: 'info' as const,
          title: 'Repayment Processed',
          message: `Loan repayment processed for project #${event.data?.projectId}`,
          timestamp: new Date(event.timestamp),
          actionUrl: '/developer-dashboard/repayment'
        };
      case 'KYCStatusChanged':
        return {
          id: event.id,
          type: event.data?.isVerified ? 'success' as const : 'warning' as const,
          title: 'KYC Status Updated',
          message: event.data?.isVerified ? 'KYC verification approved!' : 'KYC status changed',
          timestamp: new Date(event.timestamp),
          actionUrl: '/developer-dashboard/kyc'
        };
      default:
        return {
          id: event.id,
          type: 'info' as const,
          title: 'Blockchain Event',
          message: `New ${event.type} event`,
          timestamp: new Date(event.timestamp)
        };
    }
  });



  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (chainId) {
      try {
        setCurrentAddresses(getAddresses(chainId));
      } catch (error) {
        console.error("Failed to get contract addresses for chain ID:", chainId, error);
        setCurrentAddresses(undefined);
        toast.error(`Configuration error: Unsupported network (Chain ID: ${chainId}).`);
      }
    } else {
      setCurrentAddresses(undefined); 
    }
  }, [chainId]);
  
  useEffect(() => {
    // Simplified isLoadingData logic: it's true if essential initial data is still loading.
    // Project loading status (isLoadingProjects) is handled separately within the component body.
    setIsLoadingData(isMounted ? (isLoadingUserType || currentAddresses === undefined || isLoadingKyc) : true );
  }, [isMounted, isLoadingUserType, currentAddresses, isLoadingKyc]);

  const [isProcessing, setIsProcessing] = useState(false); 

  const handleCreateProject = async () => {
    if (isLoadingKyc) { 
      toast.loading("Checking KYC status...", { id: "kycCheckToast" });
      return;
    }
    toast.dismiss("kycCheckToast"); 

    if (kycError) {
      console.error("KYC Status Error:", kycError);
      toast.error(`Could not verify KYC status: ${getErrorMessage(kycError)}. Please try again.`);
      return;
    }

    if (kycStatus === true) {
      setIsCreateProjectModalOpen(true);
    } else {
      toast.error("KYC verification is required to create a project. Please complete the KYC process.");
      router.push('/developer-dashboard/kyc');
    }
  };
  
  if (isLoadingData && !isMounted) { // Adjusted initial loading condition slightly for clarity
    return <LoadingScreen />;
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Developer Dashboard</h1>
        <p className="text-xl text-gray-300">Please connect your wallet to access the developer dashboard.</p>
      </div>
    );
  }

  if (isLoadingUserType && isMounted) { // Show loading screen if user type is still loading after mount
    return <LoadingScreen />;
  }

  if (!userType || userType !== 'developer') {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-xl text-zinc-400">Access denied. This page is for developers only.</p>
        </div>
    );
  }

  if (!currentAddresses && isMounted) { // Show unsupported network if addresses not found after mount
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Developer Dashboard</h1>
        <p className="text-xl text-red-500">
          Unsupported Network (Chain ID: {chainId ?? 'N/A'}). Please connect to a supported network like Base Sepolia.
        </p>
        <p className="text-zinc-400 mt-2">If you believe this is an error, please check your wallet connection or contact support.</p>
      </div>
    );
  }
  
  // Ensure projectFactoryProxy exists before attempting to use it,
  // currentAddresses itself could be defined but specific addresses might be missing if not configured.
  const projectFactoryAddressForModal = currentAddresses?.projectFactoryProxy;

  if (isMounted && currentAddresses && (!projectFactoryAddressForModal || !currentAddresses.developerRegistryProxy)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Developer Dashboard</h1>
        <p className="text-xl text-red-500">
          Configuration Error: Critical contract addresses (ProjectFactory or DeveloperRegistry) are missing for Base Sepolia. Please contact support.
        </p>
      </div>
    );
  }

  if (kycError && !isLoadingKyc && isMounted) { 
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Developer Dashboard</h1>
        <p className="text-xl text-red-500">Error verifying developer status:</p>
        <p className="text-zinc-400 mt-2">{getErrorMessage(kycError)}</p>
        <p className="text-zinc-400 mt-2">
          Please ensure the Developer Registry contract is correctly configured and reachable, or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Solar Developer Dashboard</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Manage your solar energy projects, track funding, and access developer tools
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={refetchProjects}
              variant="outline"
              size="sm"
              className="border-[#4CAF50]/30 text-[#4CAF50] hover:bg-[#4CAF50]/10"
              disabled={isLoadingProjects}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingProjects ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-[#4CAF50] to-[#4CAF50]/90 hover:from-[#4CAF50]/90 hover:to-[#4CAF50] text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 text-lg font-semibold"
              disabled={isLoadingKyc}
            >
              <ArrowUpRight className="w-5 h-5 mr-2" />
              🚀 Create New Solar Project
            </Button>
          </div>
        </div>

        {/* Verification Status */}
        <Alert className="mb-6 bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
          <ShieldCheck className="h-5 w-5 text-[#4CAF50]" />
          <AlertTitle className="text-white">
            Developer Verification Status:
            {isLoadingKyc ? <Loader2 className="inline-block w-4 h-4 ml-2 animate-spin" /> :
              kycStatus ? <span className="text-[#4CAF50] font-bold ml-2">Verified</span> :
              <span className="text-red-400 font-bold ml-2">Not Verified</span>
            }
          </AlertTitle>
          <AlertDescription className="text-zinc-400">
            {kycStatus ? 
              "You are a verified developer. You can create and manage solar projects." :
              "Your developer account is not verified. Please complete KYC to create projects."
            }
          </AlertDescription>
          {!kycStatus && !isLoadingKyc && (
            <div className="mt-3">
              <Button
                size="sm"
                className="bg-[#4CAF50]/80 hover:bg-[#4CAF50] text-white"
                onClick={() => router.push('/developer-dashboard/kyc')}
              >
                Complete KYC Verification
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Alert>
        
        {/* Dashboard Tabs */}
        <DashboardTabs
          tabs={[
            { value: "projects", label: "My Projects" },
            { value: "analytics", label: "Analytics" },
            { value: "notifications", label: "Notifications" },
            { value: "repayment", label: "Repayment" },
            { value: "kyc", label: "KYC Status" },
            { value: "pool-test", label: "⚠️ Pool Testing (Advanced)" },
          ]}
          activeTab={activeTab}
          onValueChange={setActiveTab}
        >
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="mt-6">
              {isLoadingProjects ? (
                <div className="w-full text-center py-10">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#4CAF50]" />
                  <p className="text-zinc-400 mt-2">Loading your solar projects...</p>
                </div>
              ) : projectsError ? (
                <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading Projects</AlertTitle>
                  <AlertDescription>{getErrorMessage(projectsError)}</AlertDescription>
                </Alert>
              ) : developerProjects.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
                  <Sun className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Solar Projects Found</h3>
                  <p className="text-zinc-400 mb-4">Get started by creating your first solar energy project.</p>
                  <Alert className="bg-blue-900/30 border-blue-700 text-blue-300 mb-4 text-left max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>How to Create a Project</AlertTitle>
                    <AlertDescription>
                      Click the button below to start the project creation process. 
                      This will open a step-by-step wizard to create your solar project.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleCreateProject}
                    className="bg-gradient-to-r from-[#4CAF50] to-[#4CAF50]/90 hover:from-[#4CAF50]/90 hover:to-[#4CAF50] text-white px-6 py-3 text-lg font-semibold"
                    disabled={isLoadingKyc}
                  >
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    🚀 Create Your First Solar Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {developerProjects.map((project: OnChainProject) => (
                    <Card key={project.id} className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 hover:border-[#4CAF50]/50 transition-colors duration-300 flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-white font-semibold flex items-center gap-2">
                            <Sun className="w-5 h-5 text-oga-yellow" />
                            {project.metadata?.name || `Project #${project.id}`}
                          </CardTitle>
                          <Badge className={`capitalize ${
                            project.status === "Metadata Loaded" ? 'bg-[#4CAF50]/20 text-[#4CAF50] border-[#4CAF50]/50' : 
                            project.status === "Fetching Metadata" ? 'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50' :
                            project.status === "Metadata Error" ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                            'bg-zinc-700/20 text-zinc-400 border-zinc-600/50'
                          }`}>
                            {project.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                        <p className="text-sm text-zinc-400 h-16 overflow-hidden">
                          {project.metadata?.description || 'No description available.'}
                        </p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Loan Amount:</span>
                            <span className="text-white font-medium">${Number(project.loanAmount).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Type:</span>
                            <span className="text-[#4CAF50] font-medium">{project.isLowValue ? 'Low Value' : 'High Value'}</span>
                          </div>
                          {project.poolId && (
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Pool ID:</span>
                              <span className="text-[#4CAF50] font-medium">{project.poolId}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-[#4CAF50]/20 pt-4">
                        <Button 
                          variant="outline" 
                          className="w-full border-[#4CAF50]/30 text-[#4CAF50] hover:bg-[#4CAF50]/10"
                          onClick={() => router.push(`/developer-dashboard/projects/${project.id}`)}
                        >
                          Manage Project <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Phase 3: Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="mt-6 space-y-6">
              {/* Enhanced Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-oga-green/20 rounded-lg">
                        <DollarSign className="h-5 w-5 text-oga-green" />
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">USDC Balance</div>
                        <div className="text-lg font-semibold text-white">{usdcBalance} USDC</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Sun className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">Total Projects</div>
                        <div className="text-lg font-semibold text-white">{developerProjects.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-oga-yellow/20 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-oga-yellow" />
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">Active Events</div>
                        <div className="text-lg font-semibold text-white">{userEvents.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm text-zinc-400">KYC Status</div>
                        <div className="text-lg font-semibold text-white">
                          {kycStatus ? 'Verified' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Project Performance Analytics */}
              <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                <CardHeader>
                  <CardTitle className="text-white">Project Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {developerProjects.length > 0 ? (
                      developerProjects.map((project: OnChainProject) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-oga-green/20">
                          <div className="flex items-center gap-3">
                            <Sun className="h-5 w-5 text-oga-yellow" />
                            <div>
                              <div className="text-white font-medium">
                                {project.metadata?.name || `Project #${project.id}`}
                              </div>
                              <div className="text-zinc-400 text-sm">
                                ${Number(project.loanAmount).toLocaleString()} | {project.isLowValue ? 'Low Value' : 'High Value'}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-oga-green/20 text-oga-green border-oga-green/50">
                            {project.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Sun className="h-12 w-12 mx-auto mb-3 text-zinc-600" />
                        <p className="text-zinc-400">No projects to analyze yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pool Testing Tab */}
          {activeTab === 'pool-test' && (
            <div className="mt-6">
              <Alert className="bg-orange-900/30 border-orange-700 text-orange-300 mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>⚠️ WARNING: This is POOL INVESTMENT testing, NOT project creation!</AlertTitle>
                <AlertDescription>
                  <strong>If you want to CREATE a new solar project:</strong>
                  <br />
                  → Click the "Create New Project" button at the top of this page
                  <br />
                  <br />
                  <strong>This tab is only for testing POOL INVESTMENTS (investing in existing pools).</strong>
                  <br />
                  Do not confuse pool investment with project creation!
                </AlertDescription>
              </Alert>
              
              <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-[#4CAF50]" />
                    Pool Investment Testing (For Investors)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="bg-blue-900/30 border-blue-700 text-blue-300">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Pool Investment Interface Only</AlertTitle>
                      <AlertDescription>
                        This tests pool investment functionality for existing liquidity pools. 
                        This is NOT for creating new projects - use the "Create New Project" button for that.
                      </AlertDescription>
                    </Alert>
                    
                    <PoolInfoTest />
                    
                    {/* Enhanced Pool Investment Test */}
                    <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30 mt-6">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-[#4CAF50]" />
                          Enhanced Pool Investment Interface
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Alert className="bg-blue-900/30 border-blue-700 text-blue-300 mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>User-Friendly Pool Investment</AlertTitle>
                          <AlertDescription>
                            This is the enhanced pool investment interface with improved UX, better error handling, and the new #4CAF50 color scheme.
                          </AlertDescription>
                        </Alert>
                        <PoolInvestmentCard />
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
                      <h3 className="text-zinc-300 font-medium mb-2">Testing Summary</h3>
                      <div className="space-y-2 text-sm text-zinc-400">
                        <div>✅ Updated MockUSDC address: <code className="text-[#4CAF50]">0x145aA83e713BBc200aB08172BE9e347442a6c33E</code></div>
                        <div>✅ Updated USDC contract ABI to use MockUSDC</div>
                        <div>✅ Pool investment buttons should now be active</div>
                        <div>✅ USDC approval should work with the correct contract</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Phase 3: Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="mt-6">
              <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-oga-green" />
                    Recent Notifications
                    {recentNotifications.length > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {recentNotifications.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((notification) => (
                        <div key={notification.id} className="flex items-start gap-3 p-3 bg-black/20 rounded border border-oga-green/20">
                          <div className="flex-shrink-0 mt-1">
                            {notification.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                            {notification.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-400" />}
                            {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-400" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{notification.title}</h4>
                            <p className="text-zinc-400 text-sm">{notification.message}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                              <span>{notification.timestamp.toLocaleString()}</span>
                              {notification.actionUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(notification.actionUrl!)}
                                  className="text-oga-green border-oga-green/30 hover:bg-oga-green/20 h-auto py-1 px-2"
                                >
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 mx-auto mb-3 text-zinc-600" />
                        <p className="text-zinc-400">No recent notifications.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Phase 3: Enhanced Repayment Tab */}
          {activeTab === 'repayment' && (
            <div className="mt-6">
              <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-oga-green" />
                    Loan Repayment Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-black/20 border border-oga-green/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-oga-green/20 rounded-lg">
                            <DollarSign className="h-5 w-5 text-oga-green" />
                          </div>
                          <div>
                            <div className="text-sm text-zinc-400">Total Loan Amount</div>
                            <div className="text-lg font-semibold text-white">
                              ${developerProjects.reduce((sum, p) => sum + Number(p.loanAmount), 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/20 border border-oga-green/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Clock className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm text-zinc-400">Pending Payments</div>
                            <div className="text-lg font-semibold text-white">
                              {developerProjects.filter(p => p.status === 'Metadata Loaded').length}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/20 border border-oga-green/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-sm text-zinc-400">Repayment Events</div>
                            <div className="text-lg font-semibold text-white">
                              {userEvents.filter(e => e.type === 'RepaymentRouted').length}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="pt-4">
                    <p className="text-zinc-400 mb-4">
                      Manage your solar project loan repayments, view payment history, and track outstanding balances.
                    </p>
                    <Button
                      onClick={() => router.push('/developer-dashboard/repayment')}
                      className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Repayments
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* KYC Tab */}
          {activeTab === 'kyc' && (
            <div className="mt-6">
              <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
                <CardHeader>
                  <CardTitle className="text-white">KYC Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400">
                    KYC is required to create projects on the OnGrid platform. 
                    This ensures a secure and trusted environment for investors.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </DashboardTabs>
      </div>

              {isCreateProjectModalOpen && currentAddresses?.projectFactoryProxy && (
                  <CreateProjectModal 
          isOpen={isCreateProjectModalOpen}
          onClose={() => setIsCreateProjectModalOpen(false)}
          onProjectCreated={refetchProjects}
        />
        )}
    </div>
  );
} 