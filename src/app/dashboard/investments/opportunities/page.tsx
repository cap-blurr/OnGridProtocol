"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Leaf,
  LineChart,
  ArrowRight,
  Zap,
  Sun,
  Wind,
  Droplets,
  TreePine,
  ArrowUpRight,
  Globe2,
  DollarSign
} from "lucide-react";

// Mock data for available investment opportunities
const mockOpportunities = {
  featured: [
    {
      id: "op-1",
      name: "Colorado Solar Array",
      type: "Solar",
      target: 500000,
      raised: 325000,
      roi: { min: 8.5, max: 12.3 },
      location: "Colorado, USA",
      duration: "7 years",
      description: "A large-scale solar array project in southern Colorado providing clean energy to over 10,000 homes.",
      carbonReduction: 45000,
      image: "/images/solar-project.jpg"
    },
    {
      id: "op-2",
      name: "Midwest Wind Collective",
      type: "Wind",
      target: 750000,
      raised: 420000,
      roi: { min: 7.8, max: 11.5 },
      location: "Iowa, USA",
      duration: "10 years",
      description: "Wind farm collective spanning three counties with 45 turbines producing consistent clean energy.",
      carbonReduction: 62000,
      image: "/images/wind-project.jpg"
    }
  ],
  projects: [
    {
      id: "op-3",
      name: "Pacific Tidal Energy",
      type: "Tidal",
      target: 900000,
      raised: 380000,
      roi: { min: 9.1, max: 14.7 },
      location: "Oregon Coast, USA",
      duration: "12 years",
      description: "Innovative tidal energy project harnessing the power of ocean waves to generate predictable clean energy.",
      carbonReduction: 58000,
      image: "/images/tidal-project.jpg"
    },
    {
      id: "op-4",
      name: "Arizona Solar Initiative",
      type: "Solar",
      target: 350000,
      raised: 120000,
      roi: { min: 7.5, max: 10.2 },
      location: "Arizona, USA",
      duration: "5 years",
      description: "Desert solar implementation with next-gen panels optimized for high temperature environments.",
      carbonReduction: 32000,
      image: "/images/solar-desert.jpg"
    },
    {
      id: "op-5",
      name: "Geothermal Expansion Project",
      type: "Geothermal",
      target: 1200000,
      raised: 750000,
      roi: { min: 6.8, max: 9.5 },
      location: "Nevada, USA",
      duration: "15 years",
      description: "Expansion of existing geothermal power plant to increase capacity by 45% with minimal environmental impact.",
      carbonReduction: 85000,
      image: "/images/geothermal.jpg"
    },
    {
      id: "op-6",
      name: "Urban Microgrids Network",
      type: "Mixed Renewable",
      target: 280000,
      raised: 95000,
      roi: { min: 8.2, max: 13.8 },
      location: "Chicago, USA",
      duration: "8 years",
      description: "Network of interconnected urban microgrids combining solar, wind and battery storage for resilient city power.",
      carbonReduction: 28000,
      image: "/images/microgrid.jpg"
    }
  ],
  pools: [
    {
      id: "pool-1",
      name: "Green Energy Growth Fund",
      risk: "Low",
      target: 2000000,
      raised: 1450000,
      roi: { min: 6.5, max: 8.2 },
      duration: "5 years",
      description: "Diversified portfolio of established renewable energy projects with stable returns and low risk profile.",
      projectCount: 12
    },
    {
      id: "pool-2",
      name: "Renewable Innovation Fund",
      risk: "Medium",
      target: 1500000,
      raised: 780000,
      roi: { min: 9.5, max: 14.8 },
      duration: "7 years",
      description: "Investment in emerging technologies and innovative approaches to renewable energy generation.",
      projectCount: 8
    },
    {
      id: "pool-3",
      name: "High Impact Clean Energy Fund",
      risk: "High",
      target: 1000000,
      raised: 420000,
      roi: { min: 12.5, max: 22.0 },
      duration: "10 years",
      description: "High risk, high reward investments in breakthrough clean energy technologies with significant growth potential.",
      projectCount: 6
    }
  ]
};

// Get icon based on project type
const getProjectIcon = (type: string) => {
  switch (type) {
    case "Solar":
      return <Sun className="h-5 w-5 text-yellow-500" />;
    case "Wind":
      return <Wind className="h-5 w-5 text-blue-400" />;
    case "Tidal":
      return <Droplets className="h-5 w-5 text-blue-500" />;
    case "Geothermal":
      return <Zap className="h-5 w-5 text-red-500" />;
    case "Mixed Renewable":
      return <TreePine className="h-5 w-5 text-green-500" />;
    default:
      return <Leaf className="h-5 w-5 text-emerald-500" />;
  }
};

// Get risk badge color
const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Low":
      return "bg-green-500/20 text-green-500 border-green-700";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-500 border-yellow-700";
    case "High":
      return "bg-red-500/20 text-red-500 border-red-700";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-600";
  }
};

export default function InvestmentOpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("all");

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
            Investments
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
          </span>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Investment Opportunities
          </h1>
          <p className="text-zinc-400">
            Discover and invest in renewable energy projects driving positive environmental impact
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Available Projects
              </CardTitle>
              <Globe2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockOpportunities.projects.length + mockOpportunities.featured.length}
              </div>
              <p className="text-xs text-emerald-400">
                Across multiple technologies
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Potential ROI Range
              </CardTitle>
              <LineChart className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                6.5% - 22.0%
              </div>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-400">Varies by risk profile</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                CO₂ Reduction Potential
              </CardTitle>
              <Leaf className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                310,000+ <span className="text-base ml-1">tonnes</span>
              </div>
              <p className="text-xs text-emerald-400">
                Combined impact of all projects
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Featured Projects */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Featured Opportunities</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockOpportunities.featured.map(project => (
              <Card key={project.id} className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <div className="h-40 w-full bg-emerald-900/20 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getProjectIcon(project.type)}
                    <span className="text-white ml-2">{project.type} Energy Project</span>
                  </div>
                </div>
                
                <CardHeader className="relative">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white text-xl">{project.name}</CardTitle>
                    <Badge variant="outline" className="bg-emerald-900/30 text-emerald-300 border-emerald-700">
                      Featured
                    </Badge>
                  </div>
                  <CardDescription className="text-zinc-400 mt-1">
                    {project.location} • {project.duration}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative space-y-4">
                  <p className="text-zinc-300">{project.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Target</span>
                      <span className="text-white">${project.target.toLocaleString()}</span>
                    </div>
                    
                    <Progress 
                      value={(project.raised / project.target) * 100} 
                      className="h-2 bg-zinc-800" 
                      indicatorClassName="bg-emerald-500" 
                    />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Raised</span>
                      <span className="text-emerald-400">${project.raised.toLocaleString()} ({Math.round((project.raised / project.target) * 100)}%)</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-400">ROI Range</p>
                      <p className="text-base font-medium text-emerald-400">{project.roi.min}% - {project.roi.max}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">CO₂ Reduction</p>
                      <p className="text-base font-medium text-white">{project.carbonReduction.toLocaleString()} tonnes</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="relative bg-zinc-900/30 border-t border-zinc-800/50 flex justify-between">
                  <p className="text-zinc-400 text-sm">
                    <DollarSign className="h-4 w-4 inline-block text-emerald-500" /> Minimum investment: $5,000
                  </p>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 group">
                    Invest Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* All Projects and Pools */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/50 border border-zinc-800 p-1 w-full flex">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5"
            >
              All Opportunities
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5"
            >
              Direct Projects
            </TabsTrigger>
            <TabsTrigger 
              value="pools" 
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 px-6 py-2.5"
            >
              Investment Pools
            </TabsTrigger>
          </TabsList>
          
          {/* All Opportunities Tab */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockOpportunities.projects.slice(0, 3).map(project => (
                <Card key={project.id} className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                  
                  <CardHeader className="relative p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getProjectIcon(project.type)}
                        <Badge variant="outline" className="ml-2 border-zinc-700 bg-zinc-800/50 text-zinc-300">
                          {project.type}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg mt-2">{project.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {project.location} • {project.duration}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-3 p-4 pt-0">
                    <p className="text-zinc-300 text-sm line-clamp-2">{project.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-emerald-400">{Math.round((project.raised / project.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(project.raised / project.target) * 100} 
                        className="h-1.5 bg-zinc-800" 
                        indicatorClassName="bg-emerald-500" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <p className="text-xs text-zinc-400">ROI Range</p>
                        <p className="text-sm font-medium text-emerald-400">{project.roi.min}% - {project.roi.max}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Target</p>
                        <p className="text-sm font-medium text-white">${project.target.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="relative border-t border-zinc-800/50 px-4 py-3">
                    <Button size="sm" variant="outline" className="text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-900/20 w-full">
                      View Project Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {mockOpportunities.pools.map(pool => (
                <Card key={pool.id} className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                  
                  <CardHeader className="relative p-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={getRiskColor(pool.risk)}>
                        {pool.risk} Risk
                      </Badge>
                      <Badge variant="outline" className="bg-indigo-900/30 text-indigo-300 border-indigo-700">
                        Pool
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg mt-2">{pool.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {pool.projectCount} Projects • {pool.duration}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-3 p-4 pt-0">
                    <p className="text-zinc-300 text-sm line-clamp-2">{pool.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-emerald-400">{Math.round((pool.raised / pool.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(pool.raised / pool.target) * 100} 
                        className="h-1.5 bg-zinc-800" 
                        indicatorClassName="bg-emerald-500" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <p className="text-xs text-zinc-400">ROI Range</p>
                        <p className="text-sm font-medium text-emerald-400">{pool.roi.min}% - {pool.roi.max}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Target</p>
                        <p className="text-sm font-medium text-white">${pool.target.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="relative border-t border-zinc-800/50 px-4 py-3">
                    <Button size="sm" variant="outline" className="text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-900/20 w-full">
                      View Pool Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="border-emerald-800 hover:bg-emerald-900/20 hover:text-emerald-300 group">
                View All Opportunities <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </TabsContent>
          
          {/* Direct Projects Tab */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...mockOpportunities.featured, ...mockOpportunities.projects].map(project => (
                <Card key={project.id} className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                  
                  <CardHeader className="relative p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getProjectIcon(project.type)}
                        <Badge variant="outline" className="ml-2 border-zinc-700 bg-zinc-800/50 text-zinc-300">
                          {project.type}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg mt-2">{project.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {project.location} • {project.duration}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-3 p-4 pt-0">
                    <p className="text-zinc-300 text-sm line-clamp-2">{project.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-emerald-400">{Math.round((project.raised / project.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(project.raised / project.target) * 100} 
                        className="h-1.5 bg-zinc-800" 
                        indicatorClassName="bg-emerald-500" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <p className="text-xs text-zinc-400">ROI Range</p>
                        <p className="text-sm font-medium text-emerald-400">{project.roi.min}% - {project.roi.max}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Target</p>
                        <p className="text-sm font-medium text-white">${project.target.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="relative border-t border-zinc-800/50 px-4 py-3">
                    <Button size="sm" variant="outline" className="text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-900/20 w-full">
                      View Project Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Investment Pools Tab */}
          <TabsContent value="pools">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockOpportunities.pools.map(pool => (
                <Card key={pool.id} className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                  
                  <CardHeader className="relative p-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={getRiskColor(pool.risk)}>
                        {pool.risk} Risk
                      </Badge>
                      <Badge variant="outline" className="bg-indigo-900/30 text-indigo-300 border-indigo-700">
                        Pool
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg mt-2">{pool.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {pool.projectCount} Projects • {pool.duration}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-3 p-4 pt-0">
                    <p className="text-zinc-300 text-sm line-clamp-2">{pool.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-emerald-400">{Math.round((pool.raised / pool.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(pool.raised / pool.target) * 100} 
                        className="h-1.5 bg-zinc-800" 
                        indicatorClassName="bg-emerald-500" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <p className="text-xs text-zinc-400">ROI Range</p>
                        <p className="text-sm font-medium text-emerald-400">{pool.roi.min}% - {pool.roi.max}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Target</p>
                        <p className="text-sm font-medium text-white">${pool.target.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="relative border-t border-zinc-800/50 px-4 py-3">
                    <Button size="sm" variant="outline" className="text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-900/20 w-full">
                      View Pool Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 