"use client";

import { useState, useEffect, useCallback } from "react";
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
  BarChart3,
  AlertCircle,
  Check,
  ExternalLink,
  FileText,
  Loader2
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
    if (isMounted && !isLoadingUserType && currentAddresses !== undefined && !isLoadingKyc && !isLoadingProjects) {
      setIsLoadingData(false);
    } else {
      setIsLoadingData(isMounted ? (isLoadingUserType || isLoadingKyc || isLoadingProjects || currentAddresses === undefined) : true );
    }
  }, [isMounted, isLoadingUserType, currentAddresses, isLoadingKyc, isLoadingProjects]);

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
  
  if (isLoadingData) { 
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

  if (!userType || userType !== 'developer') {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-xl text-gray-300">Access denied. This page is for developers only.</p>
        </div>
    );
  }

  if (!currentAddresses) { 
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Developer Dashboard</h1>
        <p className="text-xl text-red-400">
          Unsupported Network (Chain ID: {chainId ?? 'N/A'}). Please connect to a supported network like Base Sepolia.
        </p>
        <p className="text-gray-300 mt-2">If you believe this is an error, please check your wallet connection or contact support.</p>
      </div>
    );
  }
  
  // Ensure projectFactoryProxy exists before attempting to use it,
  // currentAddresses itself could be defined but specific addresses might be missing if not configured.
  const projectFactoryAddressForModal = currentAddresses.projectFactoryProxy;

  if (!projectFactoryAddressForModal || !currentAddresses.developerRegistryProxy) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Developer Dashboard</h1>
        <p className="text-xl text-red-400">
          Configuration Error: Critical contract addresses (ProjectFactory or DeveloperRegistry) are missing for Base Sepolia. Please contact support.
        </p>
      </div>
    );
  }

  if (kycError && !isLoadingKyc) { 
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Developer Dashboard</h1>
        <p className="text-xl text-red-400">Error verifying developer status:</p>
        <p className="text-gray-300 mt-2">{getErrorMessage(kycError)}</p>
        <p className="text-gray-300 mt-2">
          Please ensure the Developer Registry contract is correctly configured and reachable, or try again later.
        </p>
      </div>
    );
  }

  if (isLoadingProjects) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" /> 
        <p className="ml-2 text-zinc-400">Loading projects...</p>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center bg-zinc-900 p-6 rounded-lg border border-red-500/30">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-white">Error Loading Projects</h3>
        <p className="text-zinc-400">
          Failed to fetch project data. Please try again later.
        </p>
      </div>
    );
  }

  if (!developerProjects || developerProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center bg-zinc-900/70 p-8 rounded-lg border border-zinc-800">
        <FileText size={48} className="text-zinc-500 mb-4" />
        <h3 className="text-xl font-semibold text-white">No Projects Found</h3>
        <p className="text-zinc-400 max-w-md">
          You haven't created any projects yet, or no projects match your current view. 
          Get started by creating a new project.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {projectFactoryAddressForModal && ( 
        <CreateProjectModal 
          isOpen={isCreateProjectModalOpen}
          onClose={() => {
            setIsCreateProjectModalOpen(false);
            refetchProjects();
          }}
        />
      )}
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative">
        <div className="mb-8 relative pl-6">
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
          {kycError && !isLoadingKyc && ( 
            <Alert variant="destructive" className="mb-4 bg-red-900/30 border-red-700 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>KYC Status Error</AlertTitle>
              <AlertDescription>
                Could not fetch KYC status: {getErrorMessage(kycError)}. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          {!kycError && kycStatus === false && !isLoadingKyc && ( 
            <Alert variant="default" className="mb-4 bg-yellow-900/30 border-yellow-700 text-yellow-300 cursor-pointer hover:bg-yellow-800/40" onClick={() => router.push('/developer-dashboard/kyc')}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>KYC Verification Required</AlertTitle>
              <AlertDescription>
                Your KYC is not verified. Please complete the KYC process to create and manage projects. Click here to start.
              </AlertDescription>
            </Alert>
          )}
          {!kycError && kycStatus === true && !isLoadingKyc && ( 
            <Alert variant="default" className="mb-4 bg-emerald-900/30 border-emerald-700 text-emerald-300">
              <Check className="h-4 w-4" />
              <AlertTitle>KYC Verified</AlertTitle>
              <AlertDescription>
                Your organization is KYC verified. You can now create and manage projects.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {kycStatus === true ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
              {/* Card components (mockData) */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                  <CardTitle className="text-sm font-medium text-white">Total Energy Output</CardTitle>
                  <Sun className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent className="relative p-4 pt-0">
                  <div className="text-xl md:text-2xl font-bold text-white">{mockData.analytics.totalEnergy.toLocaleString()} kWh</div>
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
                  <div className="text-xl md:text-2xl font-bold text-white">{mockData.analytics.averageEfficiency}%</div>
                  <Progress value={mockData.analytics.averageEfficiency} className="h-1 mt-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
                </CardContent>
              </Card>

              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                  <CardTitle className="text-sm font-medium text-white">Data Transfer Speed</CardTitle>
                  <Clock className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent className="relative p-4 pt-0">
                  <div className="text-xl md:text-2xl font-bold text-white">{mockData.analytics.responseTime}</div>
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

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <SwitchAccountButton />
                <Button onClick={refetchProjects} variant="outline" disabled={isLoadingProjects} className="h-10">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingProjects ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <Button 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 h-10"
                onClick={handleCreateProject}
                disabled={isProcessing || isLoadingKyc} 
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sun className="h-4 w-4" />}
                Create New Solar Project
              </Button>
            </div>
            
            {projectsError && (
              <Alert variant="destructive" className="mb-4 bg-red-900/30 border-red-700 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Fetching Projects</AlertTitle>
                <AlertDescription>{projectsError}</AlertDescription>
              </Alert>
            )}

            <DashboardTabs
              tabs={[
                { value: "projects", label: "My Solar Projects" },
              ]}
              activeTab={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsContent value="projects" className="space-y-4">
                {isLoadingProjects && !projectsError && <p className="text-zinc-400">Loading projects...</p>}
                {!isLoadingProjects && !projectsError && developerProjects.length === 0 && (
                  <p className="text-zinc-400 text-center py-8">You haven't created any projects yet.</p>
                )}
                {!isLoadingProjects && !projectsError && developerProjects.length > 0 && (
                  <div className="overflow-x-auto -mx-3 px-3">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="border-b border-zinc-800/50 hover:bg-transparent">
                          <TableHead className="text-zinc-400">Name / ID</TableHead>
                          <TableHead className="text-zinc-400">Status</TableHead>
                          <TableHead className="text-zinc-400">Loan Amount</TableHead>
                          <TableHead className="text-zinc-400">Type</TableHead>
                          <TableHead className="text-zinc-400">Created</TableHead>
                          <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {developerProjects.map((project: OnChainProject) => (
                          <TableRow key={project.id} className="border-b border-zinc-800/20 hover:bg-zinc-800/10">
                            <TableCell className="font-medium text-white">
                              {project.metadata?.name || `Project ${project.id.substring(0,8)}...`}
                              <p className="text-xs text-zinc-500">ID: {project.id}</p>
                              {project.metadata?.description && <p className="text-xs text-zinc-400 mt-1 truncate max-w-xs">{project.metadata.description}</p>}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  project.status === "Metadata Error" ? "bg-red-900/30 text-red-300 border-red-700" :
                                  project.status === "Metadata Loaded" && project.isLowValue && !project.lowValueSuccess ? "bg-yellow-900/30 text-yellow-300 border-yellow-700" :
                                  project.status === "Metadata Loaded" ? "bg-emerald-900/30 text-emerald-300 border-emerald-700" :
                                  "bg-blue-900/30 text-blue-300 border-blue-700" 
                                }
                              >
                                {project.isLowValue ? (project.lowValueSuccess ? 'Funded (Low Value)' : 'Pending Funding (LV)') : 'High Value'}
                                <span className="ml-1 text-xs opacity-70">({project.status})</span>
                              </Badge>
                              {project.metadataError && <p className="text-xs text-red-400 mt-1">{project.metadataError}</p>}
                            </TableCell>
                            <TableCell>{project.loanAmount} USDC</TableCell>
                            <TableCell>{project.isLowValue ? "Low-Value Pool" : "Direct Vault"}</TableCell>
                             <TableCell className="text-xs text-zinc-400">
                                {project.timestamp ? project.timestamp.toLocaleDateString() : 'N/A'}
                             </TableCell>
                            <TableCell className="text-right space-x-1">
                              {project.metadataCID && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-sky-400 hover:text-sky-300 hover:bg-sky-900/20"
                                  onClick={() => window.open(`${IPFS_GATEWAY_PREFIX}${project.metadataCID}`, '_blank')}
                                  title="View Metadata on IPFS"
                                >
                                  <ExternalLink size={14}/>
                                </Button>
                              )}
                              {project.vaultAddress && currentAddresses && ( // Example: Link to vault on explorer
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-sky-400 hover:text-sky-300 hover:bg-sky-900/20"
                                  // onClick={() => window.open(`https://basescan.org/address/${project.vaultAddress}`, '_blank')} // Adjust explorer URL
                                  title="View Vault on Explorer"
                                >
                                  <Box size={14}/>
                                </Button>
                              )}
                              {/* Add more actions like "View Details" linking to a project details page */}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </DashboardTabs>
            
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
          </>
        ) : (
          // This part is shown if kycStatus is false (and not loading, and no kycError)
          <div className="text-center p-6 bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Project Creation & Management Disabled</h2>
            <p className="text-gray-300">
              Your connected wallet (<code className="bg-gray-700 px-1 rounded">{connectedAddress}</code>) is not recognized as a KYC-verified developer.
            </p>
            <p className="text-gray-300 mt-2">
              Please complete the KYC process to access these features.
            </p>
            <Button 
              onClick={() => router.push('/developer-dashboard/kyc')} 
              className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Go to KYC Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 