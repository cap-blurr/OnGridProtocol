"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Leaf,
  Trees,
  ArrowRight,
  TreePine,
  CloudFog,
  BarChart3,
  Award,
  Zap,
  ArrowUpRight,
  Download,
  Globe,
  Factory,
  CheckCircle2
} from "lucide-react";

// Mock data for carbon credits
const mockCarbonData = {
  overview: {
    totalCredits: 285,
    totaltco2eReduced: 285000,
    activeProjects: 8,
    avgPricePerCredit: 47.25,
    totalCreditValue: 13466.25
  },
  carbonSummary: [
    { month: "Jan", credits: 18 },
    { month: "Feb", credits: 22 },
    { month: "Mar", credits: 25 },
    { month: "Apr", credits: 30 },
    { month: "May", credits: 28 },
    { month: "Jun", credits: 32 },
    { month: "Jul", credits: 35 },
    { month: "Aug", credits: 30 },
    { month: "Sep", credits: 25 },
    { month: "Oct", credits: 20 },
    { month: "Nov", credits: 15 },
    { month: "Dec", credits: 5 }
  ],
  projects: [
    {
      id: "cp-1",
      name: "California Solar Farm",
      type: "Solar",
      location: "California, USA",
      creditsGenerated: 95,
      tco2eReduced: 95000,
      verificationStatus: "Verified",
      image: "/images/solar-project.jpg"
    },
    {
      id: "cp-2",
      name: "Texas Wind Farm",
      type: "Wind",
      location: "Texas, USA",
      creditsGenerated: 78,
      tco2eReduced: 78000,
      verificationStatus: "Verified",
      image: "/images/wind-project.jpg"
    },
    {
      id: "cp-3",
      name: "Oregon Hydroelectric Project",
      type: "Hydro",
      location: "Oregon, USA",
      creditsGenerated: 65,
      tco2eReduced: 65000,
      verificationStatus: "Verified",
      image: "/images/hydro-project.jpg"
    },
    {
      id: "cp-4",
      name: "Arizona Solar Array",
      type: "Solar",
      location: "Arizona, USA",
      creditsGenerated: 47,
      tco2eReduced: 47000,
      verificationStatus: "Pending",
      image: "/images/solar-desert.jpg"
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Gold Standard",
      creditsVerified: 185,
      icon: "/images/gold-standard.png"
    },
    {
      id: "cert-2",
      name: "Verified Carbon Standard",
      creditsVerified: 75,
      icon: "/images/vcs.png"
    },
    {
      id: "cert-3",
      name: "Climate Action Reserve",
      creditsVerified: 25,
      icon: "/images/car.png"
    }
  ],
  marketData: {
    currentPrice: 47.25,
    priceChange: 3.8,
    volumeTraded: 12500,
    marketTrend: "Upward",
    forecastPrice: 52.10
  }
};

// Get project type icon
const getProjectIcon = (type: string) => {
  switch (type) {
    case "Solar":
      return <Zap className="h-5 w-5 text-yellow-500" />;
    case "Wind":
      return <Factory className="h-5 w-5 text-blue-400" />;
    case "Hydro":
      return <Globe className="h-5 w-5 text-blue-500" />;
    default:
      return <TreePine className="h-5 w-5 text-green-500" />;
  }
};

export default function CarbonDashboardPage() {
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
            Carbon Credits
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
          </span>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Carbon Dashboard
          </h1>
          <p className="text-zinc-400">
            Monitor and manage your carbon credits and environmental impact
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Carbon Credits
              </CardTitle>
              <TreePine className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockCarbonData.overview.totalCredits.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400">
                From {mockCarbonData.overview.activeProjects} active projects
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                CO₂ Reduced
              </CardTitle>
              <CloudFog className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockCarbonData.overview.totaltco2eReduced.toLocaleString()} <span className="text-base ml-1">kg</span>
              </div>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-400">Equivalent to 60 cars off road for a year</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Avg Price Per Credit
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                ${mockCarbonData.overview.avgPricePerCredit}
              </div>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-400">+{mockCarbonData.marketData.priceChange}% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Credit Value
              </CardTitle>
              <Award className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                ${mockCarbonData.overview.totalCreditValue.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400">
                Market value of all credits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Credits Chart */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden mb-8">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-white">
              <Leaf className="h-5 w-5 text-emerald-500" />
              Carbon Credits Generation (2024)
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Monthly breakdown of carbon credits generated
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="h-64 flex items-end justify-between gap-1">
              {mockCarbonData.carbonSummary.map((month, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div 
                    className="w-9 bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors rounded-t-sm border border-emerald-600/50 relative group" 
                    style={{ height: `${(month.credits / 40) * 100}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 border border-emerald-600/50 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                      {month.credits} Credits
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">{month.month}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 border-t border-zinc-800/50 pt-4">
              <div>
                <p className="text-sm text-zinc-400">Total Generated in 2024</p>
                <p className="text-lg font-medium text-white">
                  {mockCarbonData.carbonSummary.reduce((total, month) => total + month.credits, 0)} Credits
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-emerald-800 hover:bg-emerald-900/20 text-emerald-400">
                Download Report <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Projects and Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden h-full">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trees className="h-5 w-5 text-emerald-500" />
                  Carbon Credit Projects
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Energy projects generating your carbon credits
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {mockCarbonData.projects.map((project) => (
                    <div key={project.id} className="p-4 border border-zinc-800/50 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          {getProjectIcon(project.type)}
                          <div>
                            <h3 className="font-medium text-white">{project.name}</h3>
                            <p className="text-xs text-zinc-400">{project.location}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={project.verificationStatus === "Verified" 
                          ? "bg-green-500/10 text-green-500 border-green-700"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-700"}>
                          {project.verificationStatus}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-zinc-400">Credits Generated</p>
                          <p className="text-base font-medium text-white">{project.creditsGenerated}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400">CO₂ Reduced</p>
                          <p className="text-base font-medium text-emerald-400">{project.tco2eReduced.toLocaleString()} kg</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-3">
                        <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="space-y-6">
              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Award className="h-5 w-5 text-emerald-500" />
                    Certifications
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Verified carbon credit standards
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    {mockCarbonData.certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between items-center p-3 border border-zinc-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{cert.name}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-400">Credits Verified</p>
                          <p className="text-sm font-medium text-emerald-400">{cert.creditsVerified}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5 text-emerald-500" />
                    Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-zinc-400">Current Price</p>
                      <p className="text-xl font-medium text-white">${mockCarbonData.marketData.currentPrice.toFixed(2)}</p>
                      <div className="flex items-center">
                        <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                        <span className="text-xs text-emerald-400">+{mockCarbonData.marketData.priceChange}% over previous month</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-zinc-400">Market Trend</p>
                        <p className="text-base font-medium text-emerald-400">{mockCarbonData.marketData.marketTrend}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Volume Traded</p>
                        <p className="text-base font-medium text-white">{mockCarbonData.marketData.volumeTraded.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/50 mt-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-white">Forecast Price (Next Month)</p>
                        <p className="text-lg font-medium text-emerald-400">${mockCarbonData.marketData.forecastPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          
          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Maximize Your Environmental Impact</h3>
                <p className="text-zinc-400">Invest in more renewable energy projects to generate additional carbon credits</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="border-emerald-800 hover:bg-emerald-900/20 text-emerald-400">
                  Trade Credits
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-500 group">
                  Explore Projects <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 