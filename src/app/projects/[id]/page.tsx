'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { InvestmentCard } from '@/components/project/InvestmentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Wind, Droplet, Leaf, Calendar, ArrowLeft, Globe, Users, BarChart3, PiggyBank } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUserType } from '@/providers/userType';

// This would ideally come from an API or contract
// For demo purposes, we're hardcoding some sample projects
const SAMPLE_PROJECTS = [
  {
    id: '1',
    title: 'Solar Farm California',
    type: 'solar',
    description: 'Large-scale solar installation providing clean energy to over 10,000 homes in Southern California.',
    longDescription: `
      This project involves the deployment of a 50MW solar farm in Southern California. 
      The facility will use high-efficiency photovoltaic panels and advanced tracking systems to maximize energy production.
      
      The project will provide clean energy to approximately 10,000 homes, reducing carbon emissions by an estimated 75,000 tons per year.
      
      Funding will go towards final construction costs, grid connection, and initial operational expenses.
    `,
    vaultAddress: '0x0000000000000000000000000000000000000001' as `0x${string}`,
    developer: '0x0000000000000000000000000000000000000001' as `0x${string}`,
    developerName: 'SolarTech Innovations',
    loanAmount: '50000',
    apr: '12.5',
    tenor: '24 months',
    location: 'California, USA',
    impact: 'Reduces 75,000 tons of CO2 per year',
    beneficiaries: '10,000 homes',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    startDate: '2023-09-01',
    typeIcon: Sun
  },
  {
    id: '2',
    title: 'Wind Farm Texas',
    type: 'wind',
    description: 'State-of-the-art wind turbine installation generating sustainable energy in West Texas.',
    longDescription: `
      This project will install 25 modern wind turbines in West Texas, an area known for its consistent wind patterns.
      Each turbine has a capacity of 3MW, for a total project capacity of 75MW.
      
      The wind farm will provide clean energy to the local grid, powering approximately 40,000 homes and reducing carbon emissions by an estimated 200,000 tons per year.
      
      Funding will support the final phase of turbine installation, grid connection infrastructure, and commissioning.
    `,
    vaultAddress: '0x0000000000000000000000000000000000000002' as `0x${string}`,
    developer: '0x0000000000000000000000000000000000000002' as `0x${string}`,
    developerName: 'WindPower Solutions',
    loanAmount: '75000',
    apr: '14.8',
    tenor: '36 months',
    location: 'West Texas, USA',
    impact: 'Reduces 200,000 tons of CO2 per year',
    beneficiaries: '40,000 homes',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    startDate: '2023-10-15',
    typeIcon: Wind
  },
  {
    id: '3',
    title: 'Microhydro Kenya',
    type: 'hydro',
    description: 'Microhydro power installation bringing clean electricity to rural communities in Kenya.',
    longDescription: `
      This project will install 15 microhydro power systems across rural communities in Kenya.
      Each system will have a capacity of 50-100kW, providing reliable clean energy to villages currently without grid access.
      
      The project will bring electricity to approximately 5,000 households, 30 schools, and 15 health clinics.
      
      Funding will cover equipment costs, installation, community training, and establishing a maintenance program.
    `,
    vaultAddress: '0x0000000000000000000000000000000000000003' as `0x${string}`,
    developer: '0x0000000000000000000000000000000000000003' as `0x${string}`,
    developerName: 'HydroAfrica Initiatives',
    loanAmount: '30000',
    apr: '16.2',
    tenor: '48 months',
    location: 'Central Kenya',
    impact: 'Reduces 10,000 tons of CO2 per year',
    beneficiaries: '5,000 households, 30 schools, 15 clinics',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    startDate: '2023-11-01',
    typeIcon: Droplet
  }
];

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userType } = useUserType();
  
  // In a real app, this would fetch project details from your contracts/API
  useEffect(() => {
    // Simulate API fetch
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        // For demo, just find the project in our sample data
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
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-[600px] bg-black/20 rounded-lg animate-pulse"></div>
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
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/projects" className="inline-flex items-center text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Project details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project header */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="relative h-72">
              <Image 
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2 bg-emerald-600 hover:bg-emerald-700">
                    {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                  </Badge>
                  <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                  <p className="text-zinc-300">
                    Developed by {project.developerName}
                  </p>
                </div>
                <TypeIcon className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
          </div>
          
          {/* Project tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-emerald-900/30">
                <h3 className="text-xl font-semibold text-white mb-4">Project Description</h3>
                <p className="text-zinc-300 whitespace-pre-line">{project.longDescription}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-sm font-medium text-zinc-300">Start Date</h4>
                  </div>
                  <p className="text-white">{project.startDate}</p>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-sm font-medium text-zinc-300">Location</h4>
                  </div>
                  <p className="text-white">{project.location}</p>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-sm font-medium text-zinc-300">Developer</h4>
                  </div>
                  <p className="text-white">{project.developerName}</p>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TypeIcon className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-sm font-medium text-zinc-300">Type</h4>
                  </div>
                  <p className="text-white">{project.type.charAt(0).toUpperCase() + project.type.slice(1)} Energy</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="impact" className="space-y-6">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-emerald-900/30">
                <h3 className="text-xl font-semibold text-white mb-4">Environmental Impact</h3>
                <p className="text-zinc-300 mb-6">
                  This project contributes to climate action by reducing greenhouse gas emissions and promoting renewable energy adoption.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-white mb-2">Emissions Reduction</h4>
                    <p className="text-zinc-300">{project.impact}</p>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-white mb-2">Beneficiaries</h4>
                    <p className="text-zinc-300">{project.beneficiaries}</p>
                  </div>
                </div>
                
                <Separator className="my-6 bg-emerald-900/30" />
                
                <h4 className="text-md font-medium text-white mb-2">Sustainable Development Goals</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-blue-600 hover:bg-blue-700">SDG 7: Affordable and Clean Energy</Badge>
                  <Badge className="bg-green-600 hover:bg-green-700">SDG 13: Climate Action</Badge>
                  {project.type === 'hydro' && (
                    <Badge className="bg-purple-600 hover:bg-purple-700">SDG 6: Clean Water and Sanitation</Badge>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-emerald-900/30">
                <h3 className="text-xl font-semibold text-white mb-4">Financial Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <PiggyBank className="h-4 w-4 text-emerald-500" />
                      <h4 className="text-sm font-medium text-zinc-300">Total Funding Target</h4>
                    </div>
                    <p className="text-white text-lg font-medium">${project.loanAmount} USDC</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-emerald-500" />
                      <h4 className="text-sm font-medium text-zinc-300">APR</h4>
                    </div>
                    <p className="text-white text-lg font-medium">{project.apr}%</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      <h4 className="text-sm font-medium text-zinc-300">Tenor</h4>
                    </div>
                    <p className="text-white text-lg font-medium">{project.tenor}</p>
                  </div>
                </div>
                
                <Separator className="my-6 bg-emerald-900/30" />
                
                <h4 className="text-md font-medium text-white mb-2">Loan Terms</h4>
                <p className="text-zinc-300">
                  Payments are made monthly. Principal and interest are distributed to investors proportionally to their investment.
                  Investors can claim their principal and yield anytime after repayments are processed.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Investment card */}
        <div className="lg:col-span-1">
          <InvestmentCard 
            id={project.id}
            vaultAddress={project.vaultAddress}
            developerAddress={project.developer}
          />
          
          {/* If user is a developer, show additional actions */}
          {userType === 'developer' && project.developer.toLowerCase() === '0x0000000000000000000000000000000000000002'.toLowerCase() && (
            <div className="mt-6 bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-emerald-900/30">
              <h3 className="text-lg font-semibold text-white mb-4">Developer Actions</h3>
              <div className="space-y-3">
                <Button className="w-full">Make Repayment</Button>
                <Button variant="outline" className="w-full">Update Project Details</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 