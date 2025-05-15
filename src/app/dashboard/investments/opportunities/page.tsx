"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "wagmi";
import { useContractAddresses } from "@/hooks/contracts/useDeveloperRegistry";
import { useContractRead, useWatchContractEvent } from "wagmi";
import ProjectFactoryABI from "@/contracts/abis/ProjectFactory.json";
import DirectProjectVaultABI from "@/contracts/abis/DirectProjectVault.json";
import { formatEther, formatUnits } from "ethers";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight, 
  Leaf,
  Calendar, 
  BarChart, 
  Search,
  Clock,
  AlertCircle,
  Sun,
  Wind,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { USDC_DECIMALS } from "@/hooks/contracts/useUSDC";

interface ProjectVault {
  id: string;
  vaultAddress: string;
  developer: string;
  loanAmount: bigint;
  currentFunding: bigint;
  fundingPercentage: number;
  apr: number;
  tenorDays: number;
  isFundingClosed: boolean;
  name: string; // From metadata
}

export default function InvestmentOpportunitiesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<ProjectVault[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectVault[]>([]);
  const { address } = useAccount();
  const addresses = useContractAddresses();
  const router = useRouter();

  // Mock project names while real metadata loading is implemented
  const projectTypes = ["Solar Farm", "Wind Turbines", "Hydro Power", "Biomass Plant", "Geothermal"];
  const locations = ["California", "Texas", "New York", "Arizona", "Florida", "Colorado"];

  // Listen for ProjectCreated events to find available vaults
  useWatchContractEvent({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    eventName: 'ProjectCreated',
    listener(logs) {
      if (logs.length > 0) {
        logs.forEach(log => {
          const { args } = log;
          if (args) {
            const projectId = args.projectId.toString();
            const vaultAddress = args.vaultAddress as string;
            const developer = args.developer as string;
            const loanAmount = args.loanAmount as bigint;

            // Check if we already have this project
            if (!projects.some(p => p.id === projectId)) {
              // Fetch additional vault details
              fetchVaultDetails(vaultAddress, projectId, developer, loanAmount);
            }
          }
        });
      }
    },
  });

  // Mock function to simulate fetching vault details
  // In a real implementation, you would use useContractRead for each vault
  const fetchVaultDetails = async (vaultAddress: string, projectId: string, developer: string, loanAmount: bigint) => {
    try {
      // This would be replaced with actual contract reads
      const mockTenor = Math.floor(Math.random() * 365) + 180; // 180-545 days
      const mockAPR = 8 + Math.random() * 5; // 8-13%
      const mockFunding = Math.floor(Math.random() * Number(loanAmount));
      const mockFundingPercentage = (mockFunding / Number(loanAmount)) * 100;
      const mockClosed = Math.random() > 0.7; // 30% chance of being closed
      
      // Generate a mock name
      const type = projectTypes[Math.floor(Math.random() * projectTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const mockName = `${location} ${type} Project`;

      const newProject: ProjectVault = {
        id: projectId,
        vaultAddress,
        developer,
        loanAmount,
        currentFunding: BigInt(mockFunding),
        fundingPercentage: mockFundingPercentage,
        apr: mockAPR,
        tenorDays: mockTenor,
        isFundingClosed: mockClosed,
        name: mockName
      };

      setProjects(prev => [...prev, newProject]);
    } catch (error) {
      console.error("Error fetching vault details:", error);
    }
  };

  // Simulate loading projects on mount
  useEffect(() => {
    const loadMockProjects = async () => {
      // In a real implementation, you would query past events or have a backend API
      // that provides the list of active vaults
      const mockProjects: ProjectVault[] = [];
      
      for (let i = 1; i <= 5; i++) {
        const loanAmount = BigInt(Math.floor(Math.random() * 1000000) * 1e6); // Random amount up to 1M USDC
        const currentFunding = BigInt(Math.floor(Math.random() * Number(loanAmount)));
        const fundingPercentage = (Number(currentFunding) / Number(loanAmount)) * 100;
        const type = projectTypes[Math.floor(Math.random() * projectTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        mockProjects.push({
          id: `${i}`,
          vaultAddress: `0x${i}${'0'.repeat(39)}`,
          developer: `0x${'d'.repeat(40)}`,
          loanAmount,
          currentFunding,
          fundingPercentage,
          apr: 8 + Math.random() * 5, // 8-13%
          tenorDays: Math.floor(Math.random() * 365) + 180, // 180-545 days
          isFundingClosed: Math.random() > 0.7, // 30% chance of being closed
          name: `${location} ${type} Project`
        });
      }
      
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setIsLoading(false);
    };
    
    loadMockProjects();
  }, []);

  // Filter projects based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchTerm, projects]);

  const handleProjectClick = (projectId: string, vaultAddress: string) => {
    router.push(`/dashboard/investments/details/${projectId}?vault=${vaultAddress}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Investment Opportunities</h1>
          <p className="text-zinc-400">
          Explore and fund high-impact renewable energy projects
          </p>
        </div>
        
      {/* Search and filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search projects by name or location" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600"
          />
        </div>
              </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="ml-3 text-zinc-400">Loading investment opportunities...</span>
              </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="relative bg-black/40 backdrop-blur-sm border border-zinc-800/30 overflow-hidden">
          <CardContent className="py-10">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-1">No projects found</h3>
              <p className="text-zinc-400">Try adjusting your search criteria or check back later for new opportunities.</p>
              </div>
            </CardContent>
          </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className={`relative bg-black/40 backdrop-blur-sm border ${
                project.isFundingClosed 
                  ? 'border-zinc-800/30 opacity-70' 
                  : 'border-emerald-800/30 hover:border-emerald-600/50'
              } transition-all cursor-pointer overflow-hidden`}
              onClick={() => !project.isFundingClosed && handleProjectClick(project.id, project.vaultAddress)}
            >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
              {project.isFundingClosed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                  <div className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md">
                    <span className="text-zinc-400 font-medium">Funding Closed</span>
                  </div>
                </div>
              )}
                
                <CardHeader className="relative">
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant="outline" 
                    className="bg-emerald-900/30 text-emerald-300 border-emerald-800"
                  >
                    {project.name.includes("Solar") ? (
                      <Sun className="h-3 w-3 mr-1 text-emerald-300" />
                    ) : project.name.includes("Wind") ? (
                      <Wind className="h-3 w-3 mr-1 text-emerald-300" />
                    ) : (
                      <Leaf className="h-3 w-3 mr-1 text-emerald-300" />
                    )}
                    Energy Project
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-blue-900/30 text-blue-300 border-blue-800"
                  >
                    ID: {project.id}
                    </Badge>
                  </div>
                <CardTitle className="text-white">{project.name}</CardTitle>
                <CardDescription className="text-zinc-400">
                  Developer: {project.developer.substring(0, 6)}...{project.developer.substring(38)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Target Funding</span>
                    <span className="text-white">{formatUnits(project.loanAmount, USDC_DECIMALS)} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Current Progress</span>
                    <span className="text-white">{formatUnits(project.currentFunding, USDC_DECIMALS)} USDC</span>
                      </div>
                      <Progress 
                    value={project.fundingPercentage} 
                    className="h-2 mt-1 bg-zinc-800" 
                        indicatorClassName="bg-emerald-500" 
                      />
                  <div className="flex justify-end text-xs text-emerald-400">
                    {project.fundingPercentage.toFixed(1)}% funded
                      </div>
                    </div>
                
                <Separator className="bg-zinc-800/50" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-zinc-900/50 rounded-md">
                    <span className="text-zinc-400 text-xs mb-1">APR</span>
                    <div className="flex items-center">
                      <BarChart className="h-3 w-3 mr-1 text-emerald-500" />
                      <span className="text-white font-medium">{project.apr.toFixed(1)}%</span>
                    </div>
                      </div>
                  <div className="flex flex-col items-center p-3 bg-zinc-900/50 rounded-md">
                    <span className="text-zinc-400 text-xs mb-1">Tenor</span>
                      <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-emerald-500" />
                      <span className="text-white font-medium">{project.tenorDays} days</span>
                    </div>
                      </div>
                    </div>
                  </CardContent>
                  
              <CardFooter className="relative border-t border-zinc-800/50 pt-4">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={project.isFundingClosed}
                >
                      View Project Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
      )}
    </div>
  );
} 