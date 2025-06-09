"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Download,
  ChevronLeft,
  FileText,
  Wallet,
  LineChart,
  BarChart,
  PieChart,
  Leaf,
  History,
  Sun,
  Zap,
  Heart,
  MapPin
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useVaultDetails, useInvestorShares, useClaimableAmounts } from "@/hooks/contracts/useDirectProjectVault";
import { useGetAllHighValueProjects } from "@/hooks/contracts/useProjectFactory";
import { useAccount } from "wagmi";
import { DirectProjectInvestment, ClaimReturns } from "@/components/investment/InvestmentActions";
import LoadingScreen from "@/components/ui/loading-screen";
import { formatUnits } from "viem";

export default function InvestmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("overview");

  // Get project ID from URL
  const projectId = params?.id as string;
  const projectIndex = parseInt(projectId) - 1;

  // Get all high-value projects to find the vault address
  const { projects: allProjects, isLoading: projectsLoading } = useGetAllHighValueProjects();
  const vaultAddress = allProjects?.[projectIndex] as `0x${string}` | undefined;

  // Get vault details
  const { 
    loanAmount,
    totalAssetsInvested,
    isFundingClosed,
    currentAprBps,
    developer,
    formattedLoanAmount,
    formattedTotalAssetsInvested,
    aprPercentage,
    fundingPercentage,
    isLoading: vaultLoading
  } = useVaultDetails(vaultAddress);

  // Get user's investment details
  const { 
    shares: userShares, 
    isLoading: sharesLoading 
  } = useInvestorShares(vaultAddress, address);

  const { 
    claimablePrincipal,
    claimableYield: claimableInterest,
    isLoading: claimsLoading 
  } = useClaimableAmounts(vaultAddress, address);

  const isLoading = projectsLoading || vaultLoading || sharesLoading || claimsLoading;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-zinc-400" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-zinc-400">Please connect your wallet to view project details</p>
        </div>
      </div>
    );
  }

  if (isLoading || !vaultAddress) {
    return <LoadingScreen />;
  }

  // Enhanced project data with mock metadata (would come from IPFS in production)
  const projectData = {
    id: projectId,
    name: `Solar Energy Project ${projectId}`,
    type: "Direct Investment",
    vaultAddress,
    description: `A large-scale solar energy project generating clean power for communities while providing sustainable returns to investors. This project represents cutting-edge solar technology deployed to maximize energy efficiency and environmental impact.`,
    location: ["Mojave Desert, California", "Nairobi, Kenya", "Lagos, Nigeria", "Cape Town, South Africa"][projectIndex % 4],
    developer: ["SunPower Renewables Inc.", "Kenya Solar Ltd.", "Lagos Energy Co.", "Cape Solar Partners"][projectIndex % 4],
         developmentStage: isFundingClosed ? "Operational" : "Funding",
     riskLevel: ["Medium-Low", "Medium", "Low", "Medium-High"][projectIndex % 4],
     capacity: `${50 + (projectIndex * 15)} MW`,
     homesPowered: 25000 + (projectIndex * 10000),
     // Real blockchain data
     loanAmount: Number(formattedLoanAmount || 0),
     totalInvested: Number(formattedTotalAssetsInvested || 0),
     fundingPercentage: fundingPercentage || 0,
     apr: aprPercentage || 0,
     isFundingClosed: isFundingClosed || false,
     userInvestment: Number(formatUnits(userShares || BigInt(0), 6)),
     claimablePrincipal: Number(formatUnits(claimablePrincipal || BigInt(0), 6)),
     claimableInterest: Number(formatUnits(claimableInterest || BigInt(0), 6)),
     status: isFundingClosed ? "Active" : "Funding",
     duration: `${18 + (projectIndex * 6)} months`,
    // Mock data for UI completeness
    carbonCredits: 850 + (projectIndex * 200),
    energyOutput: `${45 + (projectIndex * 12)},000 kWh`,
    monthlyPerformance: Array.from({ length: 6 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
      returns: 220 + (projectIndex * 30) + (i * 5),
      projected: 210 + (projectIndex * 30) + (i * 4)
    })),
    transactions: [
      ...(userShares && userShares > 0 ? [{
        date: new Date().toISOString().split('T')[0],
        type: "Investment",
        amount: -Number(formatUnits(userShares, 6)),
        status: "Completed"
      }] : []),
      // Mock return transactions
      ...Array.from({ length: 3 }, (_, i) => ({
        date: new Date(Date.now() - (30 - i * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: "Return",
        amount: (220 + projectIndex * 30) + (i * 10),
        status: i < 2 ? "Completed" : "Pending"
      }))
    ],
    documents: [
      { name: "Investment Contract", type: "PDF", date: new Date().toISOString().split('T')[0] },
      { name: "Project Overview", type: "PDF", date: new Date().toISOString().split('T')[0] },
      { name: "Environmental Impact Assessment", type: "PDF", date: new Date().toISOString().split('T')[0] },
      { name: "Financial Projections", type: "XLSX", date: new Date().toISOString().split('T')[0] },
    ]
  };

  const handleInvestmentComplete = () => {
    // Refresh the page to get updated data
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <Link href="/dashboard/investments/opportunities" className="inline-flex items-center text-oga-green hover:text-oga-green-light mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Investment Opportunities
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
                <Sun className="w-6 h-6 mr-3 text-oga-yellow" />
                {projectData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {projectData.location}
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-oga-yellow" />
                  {projectData.capacity}
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-oga-green" />
                  {projectData.homesPowered.toLocaleString()} homes powered
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={
                projectData.status === 'Active' ? 'bg-oga-green/20 text-oga-green border-oga-green/50' :
                'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50'
              }>
                {projectData.status}
              </Badge>
              <Badge className={
                projectData.riskLevel.includes('Low') ? 'bg-oga-green/20 text-oga-green border-oga-green/50' :
                projectData.riskLevel.includes('Medium') ? 'bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50' :
                'bg-red-600/20 text-red-400 border-red-600/50'
              }>
                {projectData.riskLevel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Target Funding</CardTitle>
              <BarChart className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">${projectData.loanAmount.toLocaleString()}</div>
              <p className="text-xs text-oga-green">USDC</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Total Raised</CardTitle>
              <LineChart className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">${projectData.totalInvested.toLocaleString()}</div>
              <p className="text-xs text-oga-green">{projectData.fundingPercentage}% funded</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Expected APR</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{projectData.apr}%</div>
              <p className="text-xs text-oga-green">Annual return</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Your Investment</CardTitle>
              <Wallet className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">${projectData.userInvestment.toLocaleString()}</div>
              <p className="text-xs text-oga-green">USDC invested</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-white">Claimable</CardTitle>
              <Download className="h-4 w-4 text-oga-green" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">
                ${(projectData.claimablePrincipal + projectData.claimableInterest).toLocaleString()}
              </div>
              <p className="text-xs text-oga-green">Principal + Interest</p>
            </CardContent>
          </Card>
        </div>

        {/* Main grid layout with investment form on right side if funding is not closed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Investment metrics stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {projectData.status === 'Active' ? "Investment Amount" : "Total Funding"}
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${projectData.loanAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-zinc-500">
                    USDC
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {projectData.status === 'Active' ? "ROI" : "APR"}
                  </CardTitle>
                  <LineChart className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projectData.apr}%
                  </div>
                  <p className="text-xs text-zinc-500">
                    Annual percentage return
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {projectData.status === 'Active' ? "Current Returns" : "Current Funding"}
                  </CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${projectData.totalInvested.toLocaleString()}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {projectData.fundingPercentage}% of target
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {projectData.status === 'Active' ? "Repayment Progress" : "Funding Progress"}
                  </CardTitle>
                  <Clock className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projectData.fundingPercentage}%
                  </div>
                  <div className="mt-2">
                    <Progress value={projectData.fundingPercentage} className="h-2 bg-zinc-800/70" indicatorClassName="bg-emerald-500" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    {projectData.status === 'Active' ? "Loan Active" : "Funding Open"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for project details */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-zinc-900/50 border border-zinc-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400">Overview</TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400">Performance</TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400">Transactions</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-zinc-300">
                      {projectData.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-zinc-400 mb-1">Location</h3>
                          <p className="text-white">{projectData.location}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-zinc-400 mb-1">Developer Address</h3>
                          <p className="text-white font-mono text-sm">{projectData.developer}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-zinc-400 mb-1">Vault Address</h3>
                          <p className="text-white font-mono text-sm">{projectData.vaultAddress}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-zinc-400 mb-1">Development Stage</h3>
                          <p className="text-white">{projectData.developmentStage}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-zinc-400 mb-1">Risk Level</h3>
                          <Badge 
                            variant="outline" 
                            className={
                              projectData.riskLevel === "Low" ? "border-green-600 text-green-500 bg-green-900/20" :
                              projectData.riskLevel === "Medium-Low" ? "border-emerald-600 text-emerald-500 bg-emerald-900/20" :
                              projectData.riskLevel === "Medium" ? "border-yellow-600 text-yellow-500 bg-yellow-900/20" :
                              "border-red-600 text-red-500 bg-red-900/20"
                            }
                          >
                            {projectData.riskLevel}
                          </Badge>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-zinc-400 mb-1">Carbon Credits Generated</h3>
                          <p className="text-green-500 font-medium">{projectData.carbonCredits} credits</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-zinc-400 mb-1">Energy Output</h3>
                          <p className="text-white">{projectData.energyOutput}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-zinc-400 mb-1">Funding Status</h3>
                          <p className="text-white">{projectData.status === 'Active' ? "Funding Complete" : "Seeking Investment"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            
              <TabsContent value="performance">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                    <CardHeader>
                      <CardTitle>Monthly Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <div className="h-full flex items-end justify-between gap-2">
                          {projectData.monthlyPerformance.map((month, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className="w-full flex flex-col items-center gap-1">
                                <div 
                                  className="w-10 bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors rounded-t-md relative group border border-emerald-600/50"
                                  style={{ height: `${(month.returns / 500) * 100}%` }}
                                >
                                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black border border-emerald-600/50 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                                    ${month.returns}
                                  </div>
                                </div>
                                <div 
                                  className="w-10 border-dashed border-t-2 border-yellow-500/70 absolute"
                                  style={{ 
                                    width: "16px", 
                                    top: `calc(100% - ${(month.projected / 500) * 100}%)`,
                                    left: "50%",
                                    transform: "translateX(-50%)"
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-zinc-300 mt-2 font-medium">{month.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-center gap-8 mt-6">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-emerald-500/40 rounded border border-emerald-600/50"></div>
                          <span className="text-xs text-zinc-300 font-medium">Actual Returns</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0 border-t-2 border-dashed border-yellow-500/70"></div>
                          <span className="text-xs text-zinc-300 font-medium">Projected</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                    <CardHeader>
                      <CardTitle>Investment Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-zinc-400">Initial Investment</span>
                          <span className="text-white font-medium">${projectData.loanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-zinc-400">Current Returns</span>
                          <span className="text-emerald-500 font-medium">${projectData.totalInvested.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-zinc-400">Monthly Average</span>
                          <span className="text-white font-medium">${(projectData.totalInvested / projectData.loanAmount).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-zinc-400">Projected Total Returns</span>
                          <span className="text-white font-medium">${Math.round(projectData.loanAmount * (projectData.apr / 100) * (parseInt(projectData.duration) / 12)).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-zinc-800">
                        <h3 className="text-white font-medium mb-3">Return on Investment</h3>
                        <div className="bg-zinc-800/50 h-4 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-green-500 h-full rounded-full"
                            style={{ width: `${projectData.totalInvested / projectData.loanAmount * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-zinc-400">0%</span>
                          <span className="text-emerald-500 font-medium">{(projectData.totalInvested / projectData.loanAmount * 100).toFixed(1)}% return to date</span>
                          <span className="text-zinc-400">{projectData.apr}%</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-zinc-800">
                        <h3 className="text-white font-medium mb-3">Environmental Impact</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/70 rounded-lg p-3 border border-emerald-900/20">
                            <div className="flex gap-2 items-center">
                              <Leaf className="h-5 w-5 text-green-500" />
                              <span className="text-white">{projectData.carbonCredits} Credits</span>
                            </div>
                          </div>
                          <div className="bg-black/70 rounded-lg p-3 border border-emerald-900/20">
                            <div className="flex gap-2 items-center">
                              <BarChart className="h-5 w-5 text-emerald-500" />
                              <span className="text-white">{projectData.energyOutput}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="transactions">
                <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-zinc-900/30 border-b border-zinc-800/50">
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectData.transactions.map((tx, index) => (
                          <TableRow key={index} className="hover:bg-emerald-900/10 border-b border-zinc-800/30">
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>
                              {tx.type === "Investment" ? (
                                <Badge variant="outline" className="border-blue-600 text-blue-500 bg-blue-900/20">
                                  Initial Investment
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-emerald-600 text-emerald-500 bg-emerald-900/20">
                                  Monthly Return
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={tx.type === "Investment" ? "text-red-500" : "text-emerald-500"}>
                                {tx.amount > 0 ? `+$${tx.amount.toLocaleString()}` : `-$${Math.abs(tx.amount).toLocaleString()}`}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={tx.status === "Completed" ? "success" : "outline"} className={tx.status === "Pending" ? "border-yellow-600 text-yellow-500 bg-yellow-900/20" : ""}>
                                {tx.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                  <CardHeader>
                    <CardTitle>Investment Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projectData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-zinc-800/50 rounded-lg hover:border-emerald-900/30 hover:bg-black/50 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-emerald-900/20 rounded-full flex items-center justify-center mr-4">
                              <FileText className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{doc.name}</p>
                              <p className="text-xs text-zinc-500">{doc.type} • Added on {doc.date}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-emerald-700/40 bg-emerald-900/10 hover:bg-emerald-800/30 hover:text-white hover:border-emerald-600 transition-colors">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Investment form - only show if:
            1. Vault address is available
            2. Funding is not closed
          */}
          <div className="lg:col-span-1">
                         {!projectData.isFundingClosed && (
               <DirectProjectInvestment
                 vaultAddress={projectData.vaultAddress}
                 projectName={projectData.name}
                 minInvestment={1000}
                 maxInvestment={100000}
                 isFundingClosed={projectData.isFundingClosed}
                 onSuccess={handleInvestmentComplete}
               />
             )}
             
             {/* If user has invested, show claimable amounts */}
             {userShares && Number(userShares) > 0 && (
              <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Your Investment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Shares:</span>
                    <span className="text-white">{userShares?.toString() || "0"}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Claimable Principal:</span>
                    <span className="text-white">{projectData.claimablePrincipal.toLocaleString()} USDC</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Claimable Interest:</span>
                    <span className="text-white">{projectData.claimableInterest.toLocaleString()} USDC</span>
                  </div>
                  
                                     <div className="mt-4">
                     <ClaimReturns
                       vaultAddress={projectData.vaultAddress}
                       projectName={projectData.name}
                       claimablePrincipal={projectData.claimablePrincipal.toString()}
                       claimableInterest={projectData.claimableInterest.toString()}
                       onSuccess={handleInvestmentComplete}
                     />
                   </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Redeem All
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 