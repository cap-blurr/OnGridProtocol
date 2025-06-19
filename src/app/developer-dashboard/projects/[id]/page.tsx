'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Sun, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Zap,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import components and hooks
import ProjectDetailsCard from '@/components/developer/ProjectDetailsCard';
import { useDeveloperProjects, OnChainProject } from '@/hooks/contracts/useDeveloperProjects';
import { useIsVerified } from '@/hooks/contracts/useDeveloperRegistry';
import LoadingScreen from '@/components/ui/loading-screen';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address: userAddress, isConnected } = useAccount();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<OnChainProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get developer projects to find the specific project
  const { 
    projects: developerProjects, 
    isLoading: isLoadingProjects, 
    error: projectsError, 
    refetchProjects 
  } = useDeveloperProjects();

  // Get KYC status
  const { data: kycStatus } = useIsVerified(userAddress);

  // Find the specific project
  useEffect(() => {
    if (!isLoadingProjects && developerProjects.length > 0) {
      const foundProject = developerProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        setError(null);
      } else {
        setError(`Project #${projectId} not found or you don't have access to it.`);
      }
      setIsLoading(false);
    } else if (!isLoadingProjects && developerProjects.length === 0) {
      setError(`No projects found for your account.`);
      setIsLoading(false);
    }
  }, [isLoadingProjects, developerProjects, projectId]);

  // Set error if projects failed to load
  useEffect(() => {
    if (projectsError) {
      const errorMessage = typeof projectsError === 'string' ? projectsError : 
                          projectsError && typeof projectsError === 'object' && 'message' in projectsError ? 
                          (projectsError as Error).message : 
                          'Unknown error occurred';
      setError(`Failed to load projects: ${errorMessage}`);
      setIsLoading(false);
    }
  }, [projectsError]);

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    refetchProjects();
  };

  // Loading state
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Project Details</h1>
        <p className="text-xl text-gray-300">Please connect your wallet to access project details.</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-oga-green hover:bg-oga-green/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Project</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="mt-4 flex gap-4">
            <Button onClick={handleRefresh} className="bg-oga-green hover:bg-oga-green/80">
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/developer-dashboard')}
              className="border-oga-green/30 text-oga-green hover:bg-oga-green/10"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No project found
  if (!project) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-oga-green hover:bg-oga-green/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="text-center py-12">
            <Sun className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-semibold text-white mb-2">Project Not Found</h3>
            <p className="text-zinc-400 mb-4">
              Project #{projectId} could not be found or you don't have access to it.
            </p>
            <Button
              onClick={() => router.push('/developer-dashboard')}
              className="bg-oga-green hover:bg-oga-green/80"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get project type and status information
  const getProjectTypeInfo = () => {
    if (project.isLowValue) {
      return {
        type: 'Low Value Project',
        description: 'Funded through liquidity pools',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      };
    } else {
      return {
        type: 'High Value Project',
        description: 'Direct investor funding via vault',
        color: 'bg-oga-green/20 text-oga-green border-oga-green/50'
      };
    }
  };

  const projectTypeInfo = getProjectTypeInfo();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-oga-green hover:bg-oga-green/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Sun className="w-8 h-8 text-oga-yellow" />
                {project.metadata?.name || `Project #${project.id}`}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={projectTypeInfo.color}>
                  {projectTypeInfo.type}
                </Badge>
                <span className="text-zinc-400 text-sm">{projectTypeInfo.description}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-oga-green/30 text-oga-green hover:bg-oga-green/10"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        </div>

        {/* KYC Status Alert */}
        {!kycStatus && (
          <Alert className="mb-6 bg-oga-yellow/20 border-oga-yellow/50 text-oga-yellow">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>KYC Verification Required</AlertTitle>
            <AlertDescription>
              Complete your KYC verification to access all project management features.
              <Button
                size="sm"
                className="ml-2 bg-oga-yellow/80 hover:bg-oga-yellow text-black"
                onClick={() => router.push('/developer-dashboard/kyc')}
              >
                Complete KYC
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Project Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-oga-green/20 data-[state=active]:text-oga-green"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="management" 
              className="data-[state=active]:bg-oga-green/20 data-[state=active]:text-oga-green"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Management
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-oga-green/20 data-[state=active]:text-oga-green"
            >
              <Users className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Project Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Project ID:</span>
                      <span className="text-white font-medium">#{project.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Type:</span>
                      <span className="text-oga-green font-medium">
                        {project.isLowValue ? 'Low Value' : 'High Value'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Loan Amount:</span>
                      <span className="text-white font-medium">
                        ${Number(project.loanAmount).toLocaleString()}
                      </span>
                    </div>
                    {project.poolId && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Pool ID:</span>
                        <span className="text-oga-green font-medium">{project.poolId}</span>
                      </div>
                    )}
                    {project.timestamp && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Created:</span>
                        <span className="text-white font-medium">
                          {project.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {project.vaultAddress && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-oga-green/30 text-oga-green hover:bg-oga-green/10"
                        onClick={() => window.open(`https://sepolia.basescan.org/address/${project.vaultAddress}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Vault Contract
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-oga-green/30 text-oga-green hover:bg-oga-green/10"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Public Project Page
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Project Description */}
              <div className="lg:col-span-2">
                <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30 h-full">
                  <CardHeader>
                    <CardTitle className="text-white">Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-300 leading-relaxed">
                      {project.metadata?.description || 'No description available for this project.'}
                    </p>
                    
                    {project.metadata?.location && (
                      <div className="mt-4">
                        <span className="text-zinc-400">Location: </span>
                        <span className="text-white">{project.metadata.location}</span>
                      </div>
                    )}

                    {project.metadataCID && (
                      <div className="mt-4 p-3 bg-black/20 rounded border border-oga-green/20">
                        <span className="text-zinc-400 text-sm">Metadata CID: </span>
                        <span className="text-white font-mono text-sm break-all">
                          {project.metadataCID}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management">
            <ProjectDetailsCard 
              project={project} 
              onRefresh={handleRefresh}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
              <CardHeader>
                <CardTitle className="text-white">Project Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                  <h3 className="text-lg font-semibold text-white mb-2">Analytics Coming Soon</h3>
                  <p className="text-zinc-400">
                    Detailed project analytics including investor data, performance metrics, and energy generation tracking will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}