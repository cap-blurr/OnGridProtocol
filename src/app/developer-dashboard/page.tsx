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
  ShieldCheck
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
              className="border-oga-green/30 text-oga-green hover:bg-oga-green/10"
              disabled={isLoadingProjects}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingProjects ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
              disabled={isLoadingKyc}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          </div>
        </div>

        {/* Verification Status */}
        <Alert className="mb-6 bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <ShieldCheck className="h-5 w-5 text-oga-green" />
          <AlertTitle className="text-white">
            Developer Verification Status:
            {isLoadingKyc ? <Loader2 className="inline-block w-4 h-4 ml-2 animate-spin" /> :
              kycStatus ? <span className="text-oga-green font-bold ml-2">Verified</span> :
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
                className="bg-oga-green/80 hover:bg-oga-green text-white"
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
            { value: "kyc", label: "KYC Status" },
          ]}
          activeTab={activeTab}
          onValueChange={setActiveTab}
        >
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="mt-6">
              {isLoadingProjects ? (
                <div className="w-full text-center py-10">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-oga-green" />
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
                  <Button
                    onClick={handleCreateProject}
                    className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
                    disabled={isLoadingKyc}
                  >
                    Create Your First Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {developerProjects.map((project: OnChainProject) => (
                    <Card key={project.id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-colors duration-300 flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-white font-semibold flex items-center gap-2">
                            <Sun className="w-5 h-5 text-oga-yellow" />
                            {project.metadata?.name || `Project #${project.id}`}
                          </CardTitle>
                          <Badge className={`capitalize ${
                            project.status === "Metadata Loaded" ? 'bg-oga-green/20 text-oga-green border-oga-green/50' : 
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
                            <span className="text-oga-green font-medium">{project.isLowValue ? 'Low Value' : 'High Value'}</span>
                          </div>
                          {project.poolId && (
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Pool ID:</span>
                              <span className="text-oga-green font-medium">{project.poolId}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-oga-green/20 pt-4">
                        <Button 
                          variant="outline" 
                          className="w-full border-oga-green/30 text-oga-green hover:bg-oga-green/10"
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

          {/* KYC Tab */}
          {activeTab === 'kyc' && (
            <div className="mt-6">
              <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
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
        />
      )}
    </div>
  );
} 