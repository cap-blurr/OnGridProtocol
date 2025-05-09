"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Leaf,
  ArrowRight,
  CloudFog,
  BarChart3,
  PieChart,
  TreePine,
  Car,
  Plane,
  Building2,
  CircleDollarSign,
  DownloadCloud,
  Share2
} from "lucide-react";

// Mock data for tco2e emissions reduced
const mockEmissionsData = {
  overview: {
    totaltco2eReduced: 450000,
    equivalentCars: 97,
    equivalentFlights: 225,
    creditValueUSD: 21150,
    carbonFootprintReduction: 28.5
  },
  monthlyReduction: [
    { month: "Jan", value: 32500 },
    { month: "Feb", value: 34800 },
    { month: "Mar", value: 38600 },
    { month: "Apr", value: 41200 },
    { month: "May", value: 43500 },
    { month: "Jun", value: 45800 },
    { month: "Jul", value: 47200 },
    { month: "Aug", value: 44700 },
    { month: "Sep", value: 42100 },
    { month: "Oct", value: 39800 },
    { month: "Nov", value: 36400 },
    { month: "Dec", value: 33400 }
  ],
  bySource: [
    { source: "Solar Energy", percentage: 42, amount: 189000 },
    { source: "Wind Energy", percentage: 35, amount: 157500 },
    { source: "Hydroelectric", percentage: 18, amount: 81000 },
    { source: "Biomass", percentage: 5, amount: 22500 }
  ],
  impact: [
    {
      category: "Transportation",
      equivalentTo: "97 cars taken off the road for a year",
      icon: <Car className="h-10 w-10 text-cyan-400" />,
      description: "Equal to removing 97 passenger vehicles driven for one year or 1,125,000 miles not driven"
    },
    {
      category: "Air Travel",
      equivalentTo: "225 flights from NYC to LA",
      icon: <Plane className="h-10 w-10 text-purple-400" />,
      description: "Equal to 225 round-trip flights between New York and Los Angeles (approximately 621,000 passenger miles)"
    },
    {
      category: "Home Energy",
      equivalentTo: "Energy usage of 54 homes for one year",
      icon: <Building2 className="h-10 w-10 text-amber-400" />,
      description: "Equal to the electricity use of 54 homes for one year or 527,000 kWh of electricity saved"
    }
  ],
  reductionGoals: {
    currentYear: {
      target: 500000,
      achieved: 450000,
      percentage: 90
    },
    previousYears: [
      { year: 2021, target: 300000, achieved: 285000 },
      { year: 2022, target: 350000, achieved: 362000 },
      { year: 2023, target: 425000, achieved: 418000 }
    ]
  },
  carbonReports: [
    {
      id: "report-1",
      title: "Q1 2024 Carbon Reduction Report",
      date: "April 5, 2024",
      format: "PDF",
      size: "2.4 MB"
    },
    {
      id: "report-2",
      title: "2023 Annual Emissions Impact",
      date: "January 15, 2024",
      format: "PDF",
      size: "5.1 MB"
    },
    {
      id: "report-3",
      title: "Environmental Impact Statement",
      date: "December 8, 2023",
      format: "PDF",
      size: "3.8 MB"
    }
  ]
};

export default function tco2eEmissionsReducedPage() {
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
            CO₂ Emissions Reduced
          </h1>
          <p className="text-zinc-400">
            Track the environmental impact of your renewable energy investments
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total CO₂ Reduced
              </CardTitle>
              <CloudFog className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockEmissionsData.overview.totaltco2eReduced.toLocaleString()} <span className="text-base ml-1">kg</span>
              </div>
              <p className="text-xs text-emerald-400">
                {mockEmissionsData.overview.carbonFootprintReduction}% of your carbon footprint
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Equivalent to Cars
              </CardTitle>
              <Car className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockEmissionsData.overview.equivalentCars}
              </div>
              <p className="text-xs text-emerald-400">
                Vehicles taken off the road for a year
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Equivalent to Flights
              </CardTitle>
              <Plane className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                {mockEmissionsData.overview.equivalentFlights}
              </div>
              <p className="text-xs text-emerald-400">
                Cross-country flights not taken
              </p>
            </CardContent>
          </Card>

          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Carbon Credit Value
              </CardTitle>
              <CircleDollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-white">
                ${mockEmissionsData.overview.creditValueUSD.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400">
                Market value at current rates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* tco2e Reduction Chart */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden mb-8">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              Monthly CO₂ Reduction (2024)
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Monthly breakdown of carbon dioxide reduced in kilograms
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="h-64 flex items-end justify-between gap-1">
              {mockEmissionsData.monthlyReduction.map((month, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div 
                    className="w-9 bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors rounded-t-sm border border-emerald-600/50 relative group" 
                    style={{ height: `${(month.value / 50000) * 100}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 border border-emerald-600/50 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                      {month.value.toLocaleString()} kg
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">{month.month}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 border-t border-zinc-800/50 pt-4">
              <div>
                <p className="text-sm text-zinc-400">Year to Date</p>
                <p className="text-lg font-medium text-white">
                  {mockEmissionsData.monthlyReduction.reduce((total, month) => total + month.value, 0).toLocaleString()} kg
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-emerald-800 hover:bg-emerald-900/20 text-emerald-400">
                View Annual Report
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Reduction by Source and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
            
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-white">
                <PieChart className="h-5 w-5 text-emerald-500" />
                CO₂ Reduction by Source
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Breakdown of emissions reduction by energy source
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-center my-6">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{mockEmissionsData.overview.totaltco2eReduced.toLocaleString()}</div>
                      <div className="text-xs text-zinc-400">kg CO₂ reduced</div>
                    </div>
                  </div>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                    {mockEmissionsData.bySource.reduce((acc: { paths: JSX.Element[], offset: number }, source, i) => {
                      const startAngle = acc.offset;
                      const angle = source.percentage / 100 * 360;
                      const endAngle = startAngle + angle;
                      const largeArcFlag = angle > 180 ? 1 : 0;
                      
                      // Calculate coordinates on a circle
                      const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                      const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                      const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                      const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                      
                      const colors = [
                        "rgba(16, 185, 129, 0.7)", // emerald
                        "rgba(59, 130, 246, 0.7)", // blue
                        "rgba(99, 102, 241, 0.7)", // indigo
                        "rgba(217, 70, 239, 0.7)"  // fuchsia
                      ];
                      
                      acc.paths.push(
                        <path
                          key={i}
                          d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                          fill={colors[i % colors.length]}
                          stroke="#000"
                          strokeWidth="0.5"
                          className="transition-opacity duration-200 hover:opacity-90"
                        />
                      );
                      
                      return { paths: acc.paths, offset: endAngle };
                    }, { paths: [], offset: 0 }).paths}
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                {mockEmissionsData.bySource.map((source, index) => (
                  <div key={index} className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full 
                        ${index === 0 ? 'bg-emerald-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          index === 2 ? 'bg-indigo-500' : 
                          'bg-fuchsia-500'}`}
                      ></div>
                      <span className="text-white">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-emerald-400">{source.percentage}%</div>
                      <div className="text-xs text-zinc-400">{source.amount.toLocaleString()} kg</div>
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
                <TreePine className="h-5 w-5 text-emerald-500" />
                Reduction Goals Progress
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Progress toward annual carbon reduction targets
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Current Year Goal (2024)</h3>
                    <Badge variant="outline" className="bg-emerald-900/30 text-emerald-300 border-emerald-700">
                      In Progress
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Progress</span>
                      <span className="text-emerald-400">
                        {mockEmissionsData.reductionGoals.currentYear.achieved.toLocaleString()} / 
                        {mockEmissionsData.reductionGoals.currentYear.target.toLocaleString()} kg 
                        ({mockEmissionsData.reductionGoals.currentYear.percentage}%)
                      </span>
                    </div>
                    <Progress 
                      value={mockEmissionsData.reductionGoals.currentYear.percentage} 
                      className="h-2.5 bg-zinc-800" 
                      indicatorClassName="bg-emerald-500" 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-white">Previous Years Performance</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800/50">
                        <th className="text-left py-2 text-zinc-400 text-sm">Year</th>
                        <th className="text-left py-2 text-zinc-400 text-sm">Target</th>
                        <th className="text-left py-2 text-zinc-400 text-sm">Achieved</th>
                        <th className="text-left py-2 text-zinc-400 text-sm">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockEmissionsData.reductionGoals.previousYears.map((year, index) => {
                        const percentage = Math.round((year.achieved / year.target) * 100);
                        const overPerformed = year.achieved >= year.target;
                        
                        return (
                          <tr key={index} className="border-b border-zinc-800/20">
                            <td className="py-3 text-white">{year.year}</td>
                            <td className="py-3 text-white">{year.target.toLocaleString()} kg</td>
                            <td className="py-3 text-white">{year.achieved.toLocaleString()} kg</td>
                            <td className="py-3">
                              <span className={`text-sm ${overPerformed ? 'text-emerald-400' : 'text-red-400'}`}>
                                {percentage}%
                                {overPerformed ? ' (+)' : ' (-)'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Environmental Impact */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden mb-8">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-white">
              <Leaf className="h-5 w-5 text-emerald-500" />
              Environmental Impact Equivalencies
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Your carbon reduction in everyday terms
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockEmissionsData.impact.map((item, index) => (
                <div key={index} className="p-4 border border-zinc-800/50 rounded-lg text-center">
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-lg text-white mb-1">{item.category}</h3>
                  <p className="text-emerald-400 font-medium mb-3">{item.equivalentTo}</p>
                  <p className="text-sm text-zinc-300">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Carbon Reports */}
        <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          
          <CardHeader className="relative">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-white">
                <DownloadCloud className="h-5 w-5 text-emerald-500" />
                Carbon Reduction Reports
              </CardTitle>
              <Button size="sm" variant="outline" className="border-emerald-800 hover:bg-emerald-900/20 text-emerald-400">
                <Share2 className="h-4 w-4 mr-2" />
                Share Reports
              </Button>
            </div>
            <CardDescription className="text-zinc-400">
              Detailed analysis of your carbon footprint reduction
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              {mockEmissionsData.carbonReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-zinc-800/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">{report.title}</h4>
                    <p className="text-xs text-zinc-400">{report.date} • {report.format}, {report.size}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-emerald-800 hover:bg-emerald-900/20 text-emerald-400">
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="border-t border-zinc-800/50 mt-6 pt-6">
              <p className="text-zinc-300 text-sm">
                Your carbon reduction efforts are making a significant impact. By generating clean, renewable energy, you're helping combat climate change and creating a more sustainable future.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 