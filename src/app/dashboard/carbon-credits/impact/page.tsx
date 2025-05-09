"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TreePine,
  Leaf,
  Car,
  Factory,
  Wind,
  Home,
  CloudSun,
  Droplets,
  Download,
  ChevronLeft,
  TreeDeciduous,
  Share2,
  Copy,
  BarChart
} from "lucide-react";
import Link from "next/link";

// Mock data for environmental impact
const mockImpactData = {
  carbonCredits: 1250,
  tco2eReduced: 1250, // in tonnes
  energyProduced: 58700, // in kWh
  impactMetrics: {
    treesPlanted: 62500, // 50 trees per tonne of tco2e
    carEquivalent: 538, // Average car produces 4.6 tonnes tco2e per year
    homesPowered: 195, // Average home uses ~300kWh per month
    waterSaved: 2875000, // Liters of water saved (coal power plants use water for cooling)
  },
  historicalImpact: [
    { year: 2022, tco2eReduced: 320, credits: 320 },
    { year: 2023, tco2eReduced: 480, credits: 480 },
    { year: 2024, tco2eReduced: 450, credits: 450 }, // YTD
  ],
  sdgContributions: [
    { goal: "SDG 7", name: "Affordable and Clean Energy", contribution: 75 },
    { goal: "SDG 13", name: "Climate Action", contribution: 85 },
    { goal: "SDG 12", name: "Responsible Consumption and Production", contribution: 60 },
    { goal: "SDG 15", name: "Life on Land", contribution: 45 },
  ],
  certificates: [
    { 
      id: "GCC-2024-05-001", 
      name: "Green Carbon Certificate", 
      date: "May 15, 2024",
      credits: 340,
      tco2e: 340,
    },
    { 
      id: "GCC-2024-04-001", 
      name: "Green Carbon Certificate", 
      date: "April 12, 2024",
      credits: 250,
      tco2e: 250,
    },
    { 
      id: "GCC-2024-03-001", 
      name: "Green Carbon Certificate", 
      date: "March 18, 2024",
      credits: 210,
      tco2e: 210,
    },
  ]
};

export default function EnvironmentalImpactPage() {
  // Calculate the total of historical impact
  const totalHistoricaltco2e = mockImpactData.historicalImpact.reduce((sum, year) => sum + year.tco2eReduced, 0);
  
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link 
            href="/dashboard/carbon-credits" 
            className="text-zinc-400 hover:text-white flex items-center mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Carbon Credits
          </Link>
          <h1 className="text-3xl font-bold text-white">Your Environmental Impact</h1>
          <p className="text-zinc-400 mt-2">
            See the real-world difference your clean energy investments are making
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-emerald-700 bg-emerald-900/10 hover:bg-emerald-800/30 hover:text-white hover:border-emerald-600 transition-colors">
            <Share2 className="mr-2 h-4 w-4" />
            Share Impact
          </Button>
          <Button variant="outline" className="border-emerald-700 bg-emerald-900/10 hover:bg-emerald-800/30 hover:text-white hover:border-emerald-600 transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
      
      <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20 mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Environmental Equivalents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-black/50 border border-emerald-900/30 rounded-lg text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-800/40 to-green-700/40 rounded-full flex items-center justify-center mb-4">
                <TreeDeciduous className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-white">{mockImpactData.impactMetrics.treesPlanted.toLocaleString()}</div>
              <p className="text-zinc-400 text-sm mt-1">Trees Planted Equivalent</p>
            </div>
            
            <div className="p-6 bg-black/50 border border-emerald-900/30 rounded-lg text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-800/40 to-green-700/40 rounded-full flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-white">{mockImpactData.impactMetrics.carEquivalent.toLocaleString()}</div>
              <p className="text-zinc-400 text-sm mt-1">Cars Off the Road for a Year</p>
            </div>
            
            <div className="p-6 bg-black/50 border border-emerald-900/30 rounded-lg text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-800/40 to-green-700/40 rounded-full flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-[#FFDC00]" />
              </div>
              <div className="text-2xl font-bold text-white">{mockImpactData.impactMetrics.homesPowered.toLocaleString()}</div>
              <p className="text-zinc-400 text-sm mt-1">Homes Powered for a Year</p>
            </div>
            
            <div className="p-6 bg-black/50 border border-emerald-900/30 rounded-lg text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-800/40 to-green-700/40 rounded-full flex items-center justify-center mb-4">
                <Droplets className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-white">{(mockImpactData.impactMetrics.waterSaved / 1000000).toFixed(1)}M</div>
              <p className="text-zinc-400 text-sm mt-1">Liters of Water Saved</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Contribution to UN Sustainable Development Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockImpactData.sdgContributions.map((sdg, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-600 mb-1">{sdg.goal}</Badge>
                      <h3 className="text-white font-medium">{sdg.name}</h3>
                    </div>
                    <span className="text-emerald-500 font-medium">{sdg.contribution}%</span>
                  </div>
                  <Progress 
                    value={sdg.contribution} 
                    className="h-2 bg-zinc-800/70" 
                    indicatorClassName={
                      index === 0 ? "bg-emerald-500" : 
                      index === 1 ? "bg-green-500" : 
                      index === 2 ? "bg-[#FFDC00]" : 
                      "bg-blue-500"
                    } 
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-black/60 border border-zinc-800/50 rounded-lg">
              <div className="flex items-start gap-4">
                <CloudSun className="h-10 w-10 text-[#FFDC00] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-medium mb-1">UN SDG Impact</h3>
                  <p className="text-zinc-400 text-sm">
                    Your investments are making significant contributions to multiple UN Sustainable Development Goals, particularly in advancing clean energy access and climate action.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Impact Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-4">
              {mockImpactData.historicalImpact.map((year) => (
                <div key={year.year} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full max-w-20 bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors rounded-t-md relative group border border-emerald-600/50"
                    style={{ height: `${(year.tco2eReduced / totalHistoricaltco2e) * 200}px` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black border border-emerald-600/50 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                      {year.tco2eReduced} tonnes CO₂
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-white font-medium">{year.year}</div>
                    <div className="text-xs text-zinc-400">{year.credits} credits</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-black/60 border border-zinc-800/50 rounded-lg">
              <div className="flex items-start gap-4">
                <BarChart className="h-10 w-10 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-medium mb-1">Growing Impact</h3>
                  <p className="text-zinc-400 text-sm">
                    Your environmental impact has been steadily growing year over year. Since 2022, you've reduced {totalHistoricaltco2e} tonnes of CO₂ emissions through your clean energy investments.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20 mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Impact Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockImpactData.certificates.map((cert, index) => (
              <div key={index} className="border border-emerald-900/30 bg-black/60 rounded-lg p-6 hover:border-emerald-700/40 transition-colors">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-[#FFDC00]" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-900/20 text-emerald-400 border-emerald-600">Verified</Badge>
                </div>
                
                <h3 className="text-white font-medium text-lg mb-1">{cert.name}</h3>
                <p className="text-xs text-zinc-500 mb-4">ID: {cert.id}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Date:</span>
                    <span className="text-zinc-300">{cert.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Credits:</span>
                    <span className="text-zinc-300">{cert.credits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">CO₂ Reduced:</span>
                    <span className="text-zinc-300">{cert.tco2e} tonnes</span>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-9 border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-300">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 aspect-square p-0 border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-900/20 text-emerald-300">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 backdrop-blur-sm border-emerald-900/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">Expand Your Environmental Impact</h2>
              <p className="text-zinc-300">
                Increase your positive environmental footprint by exploring new clean energy investment opportunities.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="default" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-colors" asChild>
                <Link href="/dashboard/investments/opportunities">
                  Explore Opportunities
                </Link>
              </Button>
              <Button variant="outline" className="border-emerald-500 bg-black/50 hover:bg-emerald-900/40 hover:text-white" asChild>
                <Link href="/dashboard/carbon-credits/device-stats">
                  View Devices
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 