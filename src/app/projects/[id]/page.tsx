'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InvestmentCard } from '@/components/project/InvestmentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { usePrivy } from '@privy-io/react-auth';
import { useUserType } from '@/providers/userType';
import { 
  Sun, 
  Wind, 
  Droplet, 
  Leaf, 
  Calendar, 
  ArrowLeft, 
  Globe, 
  Users, 
  BarChart3, 
  PiggyBank,
  MapPin,
  Zap,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Target,
  Loader2,
  CheckCircle,
  Edit,
  Settings,
  Download,
  ExternalLink,
  AlertCircle,
  Info
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { useVaultWithMetadata } from '@/hooks/contracts/useDirectProjectVault';
import { InvestmentModal } from '@/components/project/investment-modal';

// Enhanced sample projects with more detailed data
const SAMPLE_PROJECTS = [
  {
    id: '1',
    title: 'Lagos Solar Farm Alpha',
    type: 'solar',
    description: 'Large-scale solar farm providing clean energy to 50,000 homes in Lagos metropolitan area.',
    longDescription: `
      This project involves the deployment of a 50MW solar farm in Lagos, Nigeria. 
      The facility will use high-efficiency monocrystalline silicon panels and advanced tracking systems to maximize energy production.
      
      The project will provide clean energy to approximately 50,000 homes, reducing carbon emissions by an estimated 75,000 tons per year.
      
      Funding will go towards final construction costs, grid connection, and initial operational expenses.
    `,
    vaultAddress: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    developer: '0xdeveloper1234567890123456789012345678901' as `0x${string}`,
    developerName: 'SolarTech Nigeria',
    loanAmount: 5000000,
    currentFunding: 3750000,
    fundingPercentage: 75,
    apr: 12.5,
    tenor: '24 months',
    location: 'Lagos, Nigeria',
    capacity: '50 MW',
    impact: 'Reduces 75,000 tons of CO2 per year',
    beneficiaries: '50,000 homes',
    carbonCredits: 15000,
    minInvestment: 1000,
    maxInvestment: 100000,
    riskLevel: 'medium',
    expectedReturns: 12.5,
    timeline: '24 months',
    totalInvestors: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    startDate: '2024-01-15',
    typeIcon: Sun,
    technology: 'Monocrystalline Silicon',
    projectUpdates: [
      {
        id: 1,
        date: '2024-06-15',
        title: 'Construction Phase 2 Completed',
        description: 'Successfully completed installation of 60% of solar panels. Project remains on schedule.',
        type: 'milestone'
      },
      {
        id: 2,
        date: '2024-05-20',
        title: 'Grid Connection Approved',
        description: 'Received final approval from Lagos State Electricity Board for grid connection.',
        type: 'approval'
      }
    ]
  },
  {
    id: '2',
    title: 'Kano Wind Farm Project',
    type: 'wind',
    description: 'Wind energy project harnessing northern winds for sustainable power generation.',
    longDescription: `
      This project will install 20 modern wind turbines in Kano State, an area known for its consistent wind patterns.
      Each turbine has a capacity of 2MW, for a total project capacity of 40MW.
      
      The wind farm will provide clean energy to the local grid, powering approximately 30,000 homes and reducing carbon emissions by an estimated 120,000 tons per year.
      
      Funding will support the final phase of turbine installation, grid connection infrastructure, and commissioning.
    `,
    vaultAddress: '0x2345678901234567890123456789012345678901' as `0x${string}`,
    developer: '0xdeveloper2345678901234567890123456789012' as `0x${string}`,
    developerName: 'WindPower Nigeria',
    loanAmount: 3200000,
    currentFunding: 2400000,
    fundingPercentage: 75,
    apr: 11.5,
    tenor: '20 months',
    location: 'Kano, Nigeria',
    capacity: '40 MW',
    impact: 'Reduces 120,000 tons of CO2 per year',
    beneficiaries: '30,000 homes',
    carbonCredits: 12000,
    minInvestment: 1500,
    maxInvestment: 75000,
    riskLevel: 'medium',
    expectedReturns: 11.5,
    timeline: '20 months',
    totalInvestors: 32,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    startDate: '2024-02-10',
    typeIcon: Wind,
    technology: 'Advanced Wind Turbines',
    projectUpdates: [
      {
        id: 1,
        date: '2024-06-10',
        title: 'Turbine Installation Progress',
        description: '15 out of 20 turbines successfully installed and tested.',
        type: 'milestone'
      }
    ]
  },
  {
    id: '3',
    title: 'Port Harcourt Industrial Solar',
    type: 'solar',
    description: 'Industrial-scale solar facility designed for manufacturing sector energy needs.',
    longDescription: `
      This project will install a 75MW solar facility specifically designed to serve the industrial sector in Port Harcourt.
      The facility will use bifacial solar panels to maximize energy generation efficiency.
      
      The project will provide clean energy to local manufacturing facilities, reducing their carbon footprint and energy costs.
      
      Funding will cover equipment costs, installation, and grid integration infrastructure.
    `,
    vaultAddress: '0x3456789012345678901234567890123456789012' as `0x${string}`,
    developer: '0xdeveloper3456789012345678901234567890123' as `0x${string}`,
    developerName: 'Industrial Solar Solutions',
    loanAmount: 7500000,
    currentFunding: 0,
    fundingPercentage: 0,
    apr: 15.2,
    tenor: '36 months',
    location: 'Port Harcourt, Nigeria',
    capacity: '75 MW',
    impact: 'Reduces 200,000 tons of CO2 per year',
    beneficiaries: 'Industrial facilities',
    carbonCredits: 22000,
    minInvestment: 2000,
    maxInvestment: 250000,
    riskLevel: 'high',
    expectedReturns: 15.2,
    timeline: '36 months',
    totalInvestors: 0,
    status: 'fundraising',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    startDate: '2024-03-05',
    typeIcon: Sun,
    technology: 'Bifacial Solar Panels',
    projectUpdates: [
      {
        id: 1,
        date: '2024-06-01',
        title: 'Project Launch',
        description: 'Project officially launched and open for investment.',
        type: 'announcement'
      }
    ]
  }
];

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  
  const { authenticated, ready } = usePrivy();
  const { userType } = useUserType();
  
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          const foundProject = SAMPLE_PROJECTS.find(p => p.id === id);
          setProject(foundProject || null);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching project:', error);
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleInvest = async () => {
    if (!project || !investmentAmount) return;
    
    setIsInvesting(true);
    try {
      // Simulate investment transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setInvestmentSuccess(true);
      setInvestmentAmount("");
      
      // Update project funding
      const newFunding = project.currentFunding + (parseFloat(investmentAmount) * 1e6);
      setProject({
        ...project,
        currentFunding: newFunding,
        fundingPercentage: (newFunding / project.loanAmount) * 100,
        totalInvestors: project.totalInvestors + 1
      });
      
      // Reset success state after showing message
      setTimeout(() => {
        setInvestmentSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Investment failed:', error);
    } finally {
      setIsInvesting(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'fundraising': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      case 'announcement': return <Globe className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl text-white mb-4">Project Not Found</h2>
          <p className="text-zinc-400 mb-8">
            The project you're looking for doesn't seem to exist.
          </p>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const TypeIcon = project.typeIcon;
  const isDeveloper = userType === 'developer';
  const isProjectOwner = isDeveloper; // In real app, check if current user is the project developer
  
  // Fetch comprehensive project data
  const { 
    loanAmount,
    totalAssetsInvested,
    isFundingClosed,
    aprPercentage,
    developer,
    fundingPercentage,
    summary,
    metadata,
    error
  } = useVaultWithMetadata(project.vaultAddress);

  if (error || !loanAmount) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
              <p className="text-zinc-400 mb-6">The requested project could not be loaded.</p>
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="border-zinc-700 text-zinc-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate project metrics
  const fundingProgress = summary?.fundingProgressPercentage || fundingPercentage || 0;
  const loanAmountFormatted = formatUnits(loanAmount, 6);
  const totalRaisedFormatted = formatUnits(totalAssetsInvested || BigInt(0), 6);
  const timeRemainingDays = summary?.timeRemainingSeconds ? Math.ceil(summary.timeRemainingSeconds / (24 * 60 * 60)) : 0;

  // Use metadata if available, otherwise fallback values
  const projectName = metadata?.name || `Solar Project #${id}`;
  const projectDescription = metadata?.description || 'Renewable energy project creating sustainable value';
  const projectLocation = metadata?.location || 'Location TBD';
  const projectType = metadata?.projectType || 'solar';
  const capacity = metadata?.capacity || 0;
  const expectedROI = metadata?.financial?.expectedROI || aprPercentage || 0;
  const carbonCredits = metadata?.carbonCreditsExpected || 0;
  const expectedGeneration = metadata?.expectedAnnualGeneration || 0;

  // Get project status
  const getProjectStatus = () => {
    if (isFundingClosed) {
      return { label: "Active", color: "bg-green-600", icon: CheckCircle };
    } else if (fundingProgress >= 100) {
      return { label: "Funded", color: "bg-green-600", icon: CheckCircle };
    } else if (timeRemainingDays > 0) {
      return { label: "Funding Open", color: "bg-blue-600", icon: Clock };
    } else {
      return { label: "Funding Closed", color: "bg-gray-600", icon: AlertCircle };
    }
  };

  const status = getProjectStatus();
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Sun className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{projectName}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-zinc-400">
                      <MapPin className="h-4 w-4 mr-1" />
                      {projectLocation}
                    </div>
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">
                {projectDescription}
              </p>
            </div>

            {/* Investment Action */}
            {!isFundingClosed && fundingProgress < 100 && timeRemainingDays > 0 && (
              <div className="lg:min-w-[300px]">
                <Card className="bg-zinc-900/50 border-green-600/50">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold text-white mb-2">
                        ${Number(loanAmountFormatted).toLocaleString()}
                      </p>
                      <p className="text-zinc-400">Investment Target</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-white">{fundingProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(fundingProgress, 100)} className="h-3" />
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>${Number(totalRaisedFormatted).toLocaleString()} raised</span>
                        <span>{timeRemainingDays} days left</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setShowInvestmentModal(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      <DollarSign className="h-5 w-5 mr-2" />
                      Invest Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{capacity} MW</div>
              <p className="text-xs text-zinc-400">Capacity</p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{expectedROI.toFixed(1)}%</div>
              <p className="text-xs text-zinc-400">Expected ROI</p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 text-center">
              <Leaf className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{carbonCredits.toLocaleString()}t</div>
              <p className="text-xs text-zinc-400">CO₂ Avoided/Year</p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{expectedGeneration.toLocaleString()}</div>
              <p className="text-xs text-zinc-400">MWh/Year</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-900/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Information */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-400" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Project Type:</span>
                      <Badge variant="secondary" className="capitalize">
                        {projectType} Energy
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Location:</span>
                      <span className="text-white">{projectLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Developer:</span>
                      <span className="text-white font-mono text-sm">
                        {developer ? `${developer.slice(0, 6)}...${developer.slice(-4)}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Project ID:</span>
                      <span className="text-white">{id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funding Status */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Funding Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Target Amount:</span>
                      <span className="text-white font-bold">
                        ${Number(loanAmountFormatted).toLocaleString()} USDC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Amount Raised:</span>
                      <span className="text-green-400 font-bold">
                        ${Number(totalRaisedFormatted).toLocaleString()} USDC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Progress:</span>
                      <span className="text-white">{fundingProgress.toFixed(1)}%</span>
                    </div>
                    {timeRemainingDays > 0 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Time Remaining:</span>
                        <span className="text-white">{timeRemainingDays} days</span>
                      </div>
                    )}
                  </div>
                  <Progress value={Math.min(fundingProgress, 100)} className="h-3" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Energy Production</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Capacity:</span>
                        <span className="text-white">{capacity} MW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Annual Generation:</span>
                        <span className="text-white">{expectedGeneration.toLocaleString()} MWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Capacity Factor:</span>
                        <span className="text-white">
                          {capacity > 0 ? ((expectedGeneration / (capacity * 8760)) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Project Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Installation:</span>
                        <span className="text-white">
                          {metadata?.technical?.installationTimeline || '6-12 months'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Maintenance:</span>
                        <span className="text-white">
                          {metadata?.technical?.maintenanceSchedule || 'Annual'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {metadata?.technical?.equipment && metadata.technical.equipment.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Equipment & Technology</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {metadata.technical.equipment.map((item, index) => (
                        <Badge key={index} variant="outline" className="justify-start">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Investment Returns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Expected ROI:</span>
                      <span className="text-green-400 font-bold">{expectedROI.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Payback Period:</span>
                      <span className="text-white">
                        {metadata?.financial?.paybackPeriod || 36} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Loan Term:</span>
                      <span className="text-white">
                        {Math.round((metadata?.financial?.tenor || 365) / 365)} years
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-400" />
                    Project Economics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Project Cost:</span>
                      <span className="text-white font-bold">
                        ${(metadata?.financial?.totalCost || Number(loanAmountFormatted)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Financing Amount:</span>
                      <span className="text-white">
                        ${Number(loanAmountFormatted).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Revenue Model:</span>
                      <span className="text-white">Power Purchase Agreement</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-400" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">CO₂ Avoided (Annual):</span>
                      <span className="text-green-400 font-bold">{carbonCredits.toLocaleString()} tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Equivalent Cars Off Road:</span>
                      <span className="text-white">{Math.round(carbonCredits * 2.3).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Trees Equivalent:</span>
                      <span className="text-white">{Math.round(carbonCredits * 45).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Social Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Jobs Created:</span>
                      <span className="text-white">25-50 during construction</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Permanent Jobs:</span>
                      <span className="text-white">5-10 operations</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Community Benefit:</span>
                      <span className="text-white">Clean energy access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Investment Modal */}
        <InvestmentModal
          open={showInvestmentModal}
          onOpenChange={setShowInvestmentModal}
          projectData={{
            vaultAddress: project.vaultAddress,
            projectId: id,
            name: projectName,
            loanAmount,
            totalAssetsInvested,
            fundingPercentage,
            aprPercentage: expectedROI,
            timeRemaining: timeRemainingDays,
            isFundingClosed
          }}
          type="project"
        />
      </div>
    </div>
  );
} 