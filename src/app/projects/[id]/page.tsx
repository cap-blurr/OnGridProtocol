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
  Download
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/projects" className="inline-flex items-center text-zinc-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        
        {isProjectOwner && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Project details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project header */}
          <Card className="bg-gray-900/50 border-gray-700 overflow-hidden">
            <div className="relative h-64">
              <Image 
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {project.status.toUpperCase()}
                      </Badge>
                      <Badge className={`${getRiskColor(project.riskLevel)} text-white`}>
                        {project.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                    <p className="text-zinc-300 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location}
                    </p>
                  </div>
                  <TypeIcon className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Capacity</p>
                <p className="text-lg font-semibold text-white">{project.capacity}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Expected ROI</p>
                <p className="text-lg font-semibold text-white">{project.expectedReturns}%</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Investors</p>
                <p className="text-lg font-semibold text-white">{project.totalInvestors}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Leaf className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Carbon Credits</p>
                <p className="text-lg font-semibold text-white">{project.carbonCredits.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Project tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 bg-gray-900/50 border border-gray-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {project.longDescription}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Project Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Developer:</span>
                          <span className="text-white">{project.developerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Technology:</span>
                          <span className="text-white">{project.technology}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Timeline:</span>
                          <span className="text-white">{project.timeline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Start Date:</span>
                          <span className="text-white">{project.startDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-3">Investment Range</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Minimum:</span>
                          <span className="text-white">${project.minInvestment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Maximum:</span>
                          <span className="text-white">${project.maxInvestment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Risk Level:</span>
                          <span className="text-white capitalize">{project.riskLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="impact" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-green-900/20 rounded-lg">
                      <Leaf className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">CO2 Reduction</h3>
                      <p className="text-green-400 text-2xl font-bold">75,000</p>
                      <p className="text-gray-400 text-sm">tons per year</p>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-900/20 rounded-lg">
                      <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Beneficiaries</h3>
                      <p className="text-blue-400 text-2xl font-bold">50,000</p>
                      <p className="text-gray-400 text-sm">homes powered</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-white mb-3">Additional Benefits</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Creates 150+ local jobs during construction</li>
                      <li>• Provides 25 permanent operational jobs</li>
                      <li>• Reduces local air pollution</li>
                      <li>• Contributes to Nigeria's renewable energy goals</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Investment Terms</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected APR:</span>
                          <span className="text-emerald-400 font-semibold">{project.apr}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Investment Period:</span>
                          <span className="text-white">{project.tenor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Frequency:</span>
                          <span className="text-white">Quarterly</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-3">Risk Assessment</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Risk:</span>
                          <span className="text-yellow-400">Medium</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Technology Risk:</span>
                          <span className="text-green-400">Low</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Regulatory Risk:</span>
                          <span className="text-green-400">Low</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="updates" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.projectUpdates.map((update: any) => (
                      <div key={update.id} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex-shrink-0">
                          {getUpdateTypeIcon(update.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-white">{update.title}</h4>
                            <span className="text-sm text-gray-400">{update.date}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{update.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Investment card */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Investment Opportunity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Funding Progress</span>
                  <span className="text-white">
                    ${(project.currentFunding / 1e6).toFixed(1)}M / ${(project.loanAmount / 1e6).toFixed(1)}M
                  </span>
                </div>
                <Progress value={project.fundingPercentage} className="h-3" />
                <p className="text-xs text-gray-400 mt-1">{project.fundingPercentage.toFixed(1)}% funded</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Expected Returns</p>
                  <p className="text-emerald-400 font-semibold">{project.expectedReturns}% APR</p>
                </div>
                <div>
                  <p className="text-gray-400">Timeline</p>
                  <p className="text-white font-semibold">{project.timeline}</p>
                </div>
              </div>

              {authenticated && userType !== 'developer' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Invest Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Invest in {project.title}</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Enter your investment amount to fund this renewable energy project
                      </DialogDescription>
                    </DialogHeader>
                    
                    {investmentSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Investment Successful!</h3>
                        <p className="text-gray-400">Your investment has been processed successfully.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Expected Returns</p>
                            <p className="text-emerald-400 font-semibold">{project.expectedReturns}% APR</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Investment Range</p>
                            <p className="text-white font-semibold">${project.minInvestment} - ${project.maxInvestment}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Investment Amount (USDC)
                          </label>
                          <Input
                            type="number"
                            placeholder={`Min: $${project.minInvestment}`}
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                            min={project.minInvestment}
                            max={project.maxInvestment}
                          />
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Investment Summary</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Investment Amount:</span>
                              <span className="text-white">${investmentAmount || '0'} USDC</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Expected Annual Return:</span>
                              <span className="text-emerald-400">
                                ${investmentAmount ? (parseFloat(investmentAmount) * project.expectedReturns / 100).toFixed(2) : '0'} USDC
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Project Duration:</span>
                              <span className="text-white">{project.timeline}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleInvest}
                          disabled={!investmentAmount || parseFloat(investmentAmount) < project.minInvestment || parseFloat(investmentAmount) > project.maxInvestment || isInvesting}
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          {isInvesting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing Investment...
                            </>
                          ) : (
                            'Confirm Investment'
                          )}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}

              {!authenticated && (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm mb-4">Connect your wallet to invest</p>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                    Connect Wallet
                  </Button>
                </div>
              )}

              {userType === 'developer' && (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">Developer view - Investment not available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Developer Actions */}
          {isProjectOwner && (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Project Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  <Download className="w-4 h-4 mr-2" />
                  Download Reports
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  <Edit className="w-4 h-4 mr-2" />
                  Post Update
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Investors
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 