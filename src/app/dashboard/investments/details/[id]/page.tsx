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
  History
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useVaultDetails, useInvestorShares, useClaimableAmounts } from "@/hooks/contracts/useDirectProjectVault";
import { useAccount } from "wagmi";
import InvestmentForm from "@/components/project/InvestmentForm";

// Mock investment data - in a real app would fetch based on ID
const mockInvestmentsData = {
  1: {
    id: 1,
    name: "California Solar Farm",
    type: "Direct Investment",
    investmentDate: "2024-05-15",
    amount: 50000,
    roi: 12.5,
    status: "Active",
    duration: "36 months",
    returns: 2750,
    maturityDate: "2027-05-15",
    description: "A large-scale solar farm project in California's Mojave Desert, generating clean energy for over 10,000 homes and reducing carbon emissions by 12,500 tonnes annually.",
    location: "Mojave Desert, California",
    developer: "SunPower Renewables, Inc.",
    developmentStage: "Operational",
    riskLevel: "Medium-Low",
    carbonCredits: 850,
    energyOutput: "58,700 kWh",
    monthlyPerformance: [
      { month: "Jan", returns: 230, projected: 220 },
      { month: "Feb", returns: 245, projected: 220 },
      { month: "Mar", returns: 238, projected: 225 },
      { month: "Apr", returns: 252, projected: 225 },
      { month: "May", returns: 265, projected: 230 },
      { month: "Jun", returns: 270, projected: 230 },
    ],
    transactions: [
      { date: "2024-05-15", type: "Investment", amount: -50000, status: "Completed" },
      { date: "2024-06-15", type: "Return", amount: 520, status: "Completed" },
      { date: "2024-07-15", type: "Return", amount: 525, status: "Completed" },
      { date: "2024-08-15", type: "Return", amount: 535, status: "Completed" },
      { date: "2024-09-15", type: "Return", amount: 540, status: "Completed" },
      { date: "2024-10-15", type: "Return", amount: 530, status: "Pending" },
    ],
    documents: [
      { name: "Investment Contract", type: "PDF", date: "2024-05-15" },
      { name: "Project Overview", type: "PDF", date: "2024-05-15" },
      { name: "Environmental Impact Assessment", type: "PDF", date: "2024-05-10" },
      { name: "Financial Projections", type: "XLSX", date: "2024-05-12" },
    ]
  },
  2: {
    id: 2,
    name: "Green Energy Pool A",
    type: "Pool Investment",
    investmentDate: "2024-05-10",
    amount: 25000,
    roi: 10.2,
    status: "Active",
    duration: "24 months",
    returns: 1050,
    maturityDate: "2026-05-10",
    description: "A diversified pool of renewable energy projects focused on solar and wind energy, spread across multiple locations to optimize risk and return profiles.",
    location: "Multiple Locations",
    developer: "Green Investment Partners",
    developmentStage: "Mixed (80% Operational, 20% Construction)",
    riskLevel: "Low",
    carbonCredits: 420,
    energyOutput: "32,400 kWh",
    monthlyPerformance: [
      { month: "Jan", returns: 210, projected: 200 },
      { month: "Feb", returns: 205, projected: 200 },
      { month: "Mar", returns: 215, projected: 205 },
      { month: "Apr", returns: 210, projected: 205 },
      { month: "May", returns: 220, projected: 210 },
      { month: "Jun", returns: 225, projected: 210 },
    ],
    transactions: [
      { date: "2024-05-10", type: "Investment", amount: -25000, status: "Completed" },
      { date: "2024-06-10", type: "Return", amount: 210, status: "Completed" },
      { date: "2024-07-10", type: "Return", amount: 215, status: "Completed" },
      { date: "2024-08-10", type: "Return", amount: 220, status: "Completed" },
      { date: "2024-09-10", type: "Return", amount: 210, status: "Completed" },
      { date: "2024-10-10", type: "Return", amount: 215, status: "Pending" },
    ],
    documents: [
      { name: "Pool Investment Agreement", type: "PDF", date: "2024-05-10" },
      { name: "Pool Projects Summary", type: "PDF", date: "2024-05-08" },
      { name: "Risk Assessment", type: "PDF", date: "2024-05-05" },
      { name: "Quarterly Report Q1 2024", type: "PDF", date: "2024-04-15" },
    ]
  },
  3: {
    id: 3,
    name: "Texas Wind Farm",
    type: "Direct Investment",
    investmentDate: "2024-05-05",
    amount: 35000,
    roi: 14.8,
    status: "Active",
    duration: "48 months",
    returns: 2350,
    maturityDate: "2028-05-05",
    description: "A cutting-edge wind farm in West Texas utilizing the latest turbine technology to generate reliable clean energy while providing strong returns for investors.",
    location: "West Texas",
    developer: "WindStream Energy",
    developmentStage: "Operational",
    riskLevel: "Medium",
    carbonCredits: 720,
    energyOutput: "45,200 kWh",
    monthlyPerformance: [
      { month: "Jan", returns: 435, projected: 420 },
      { month: "Feb", returns: 445, projected: 420 },
      { month: "Mar", returns: 450, projected: 425 },
      { month: "Apr", returns: 460, projected: 425 },
      { month: "May", returns: 455, projected: 430 },
      { month: "Jun", returns: 465, projected: 430 },
    ],
    transactions: [
      { date: "2024-05-05", type: "Investment", amount: -35000, status: "Completed" },
      { date: "2024-06-05", type: "Return", amount: 430, status: "Completed" },
      { date: "2024-07-05", type: "Return", amount: 440, status: "Completed" },
      { date: "2024-08-05", type: "Return", amount: 445, status: "Completed" },
      { date: "2024-09-05", type: "Return", amount: 450, status: "Completed" },
      { date: "2024-10-05", type: "Return", amount: 455, status: "Pending" },
    ],
    documents: [
      { name: "Investment Agreement", type: "PDF", date: "2024-05-05" },
      { name: "Wind Farm Technical Specs", type: "PDF", date: "2024-05-01" },
      { name: "Environmental Certification", type: "PDF", date: "2024-04-28" },
      { name: "Performance Projections", type: "XLSX", date: "2024-04-30" },
    ]
  },
  4: {
    id: 4,
    name: "Sustainable Energy Fund",
    type: "Pool Investment",
    investmentDate: "2024-04-20",
    amount: 15000,
    roi: 9.5,
    status: "Active",
    duration: "12 months",
    returns: 550,
    maturityDate: "2025-04-20",
    description: "A short-term liquid investment pool focused on established sustainable energy projects with proven track records and stable returns.",
    location: "Multiple Locations",
    developer: "Sustainable Future Fund",
    developmentStage: "Operational",
    riskLevel: "Low",
    carbonCredits: 310,
    energyOutput: "22,800 kWh",
    monthlyPerformance: [
      { month: "Jan", returns: 120, projected: 115 },
      { month: "Feb", returns: 122, projected: 115 },
      { month: "Mar", returns: 118, projected: 118 },
      { month: "Apr", returns: 124, projected: 118 },
      { month: "May", returns: 128, projected: 120 },
      { month: "Jun", returns: 130, projected: 120 },
    ],
    transactions: [
      { date: "2024-04-20", type: "Investment", amount: -15000, status: "Completed" },
      { date: "2024-05-20", type: "Return", amount: 120, status: "Completed" },
      { date: "2024-06-20", type: "Return", amount: 118, status: "Completed" },
      { date: "2024-07-20", type: "Return", amount: 122, status: "Completed" },
      { date: "2024-08-20", type: "Return", amount: 125, status: "Completed" },
      { date: "2024-09-20", type: "Return", amount: 124, status: "Pending" },
    ],
    documents: [
      { name: "Fund Agreement", type: "PDF", date: "2024-04-20" },
      { name: "Fund Prospectus", type: "PDF", date: "2024-04-15" },
      { name: "Risk Disclosure", type: "PDF", date: "2024-04-18" },
      { name: "Quarterly Performance Report", type: "PDF", date: "2024-07-05" },
    ]
  }
};

export default function InvestmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { address: investorAddress } = useAccount();
  const [projectMetadata, setProjectMetadata] = useState<any>(null);
  
  // Get project ID and vault address from URL
  const projectId = params.id as string;
  const vaultAddress = searchParams.get('vault') as `0x${string}` || undefined;
  
  // Fetch on-chain vault details
  const {
    loanAmount,
    totalAssetsInvested,
    isFundingClosed,
    currentAprBps,
    developer,
    loanTenor,
    loanStartTime,
    fundingPercentage,
    formattedLoanAmount,
    formattedTotalAssetsInvested,
    aprPercentage,
    tenorDays
  } = useVaultDetails(vaultAddress);
  
  // Fetch investor's shares
  const { shares } = useInvestorShares(vaultAddress, investorAddress);
  
  // Fetch claimable amounts
  const {
    claimablePrincipal,
    claimableYield,
    formattedClaimablePrincipal,
    formattedClaimableYield,
    isLoading: isLoadingClaimable
  } = useClaimableAmounts(vaultAddress, investorAddress);
  
  // Function to refresh data after successful investment
  const handleInvestmentComplete = () => {
    // This would trigger a refetch of vault details
    router.refresh();
  };

  // Determine if mock data should be used (this would be removed in a production app)
  const useMockData = !vaultAddress || !loanAmount;
  
  // Fallback to mock data if vault data is not available
  const mockInvestmentId = parseInt(projectId);
  const mockInvestment = mockInvestmentsData[mockInvestmentId as keyof typeof mockInvestmentsData];
  
  // Fetch project metadata from IPFS (simulated)
  useEffect(() => {
    // In a real implementation, you would fetch metadata from IPFS or your API
    // using the projectId or a metadataCID
    const fetchMetadata = async () => {
      // Simulate API call 
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock metadata
      setProjectMetadata({
        name: useMockData ? mockInvestment?.name : `Renewable Energy Project #${projectId}`,
        description: useMockData ? mockInvestment?.description : "A renewable energy project aiming to reduce carbon emissions and provide clean energy to the local community.",
        location: useMockData ? mockInvestment?.location : "Global",
        developer: useMockData ? mockInvestment?.developer : developer?.slice(0, 6) + '...' + developer?.slice(-4),
        developmentStage: useMockData ? mockInvestment?.developmentStage : "Construction",
        riskLevel: useMockData ? mockInvestment?.riskLevel : "Medium",
        carbonCredits: useMockData ? mockInvestment?.carbonCredits : Math.floor(Math.random() * 1000),
        energyOutput: useMockData ? mockInvestment?.energyOutput : `${Math.floor(Math.random() * 100000)} kWh`,
      });
    };
    
    fetchMetadata();
  }, [projectId, useMockData, mockInvestment, developer]);
  
  // If neither mock data nor contract data is available, show not found
  if (useMockData && !mockInvestment) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-2xl font-bold text-white mb-4">Investment not found</h1>
        <p className="text-zinc-400 mb-6">The investment you're looking for doesn't exist or may have been removed.</p>
        <Button variant="outline" className="border-emerald-700 hover:bg-emerald-800/30 hover:text-white" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Investments
        </Button>
      </div>
    );
  }

  // Determine investment metrics using either on-chain data or mock data
  const investmentAmount = useMockData ? mockInvestment.amount : Number(formattedLoanAmount);
  const roi = useMockData ? mockInvestment.roi : aprPercentage;
  const totalReturns = useMockData 
    ? mockInvestment.transactions.filter(tx => tx.type === "Return" && tx.status === "Completed").reduce((sum, tx) => sum + tx.amount, 0)
    : Number(formattedClaimableYield);
  
  // Calculate completions/progress
  let completionPercentage = 0;
  if (useMockData) {
    completionPercentage = Math.round(
      (new Date().getTime() - new Date(mockInvestment.investmentDate).getTime()) / 
      (new Date(mockInvestment.maturityDate).getTime() - new Date(mockInvestment.investmentDate).getTime()) * 100
    );
  } else {
    // If funding is not closed yet, show funding percentage
    // If funding is closed, show loan repayment progress
    completionPercentage = isFundingClosed
      ? Math.min(100, Math.round(Number(claimablePrincipal) * 100 / Number(loanAmount)))
      : Math.min(100, fundingPercentage);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link 
            href="/dashboard/investments/opportunities" 
            className="text-zinc-400 hover:text-white flex items-center mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Investment Opportunities
          </Link>
          <h1 className="text-3xl font-bold text-white">{projectMetadata?.name || "Loading..."}</h1>
          <div className="flex items-center mt-2">
            <Badge 
              variant="outline" 
              className="border-emerald-600 text-emerald-500 bg-emerald-900/20 mr-2"
            >
              Direct Investment
            </Badge>
            {!useMockData && (
              <Badge 
                variant="outline" 
                className={isFundingClosed 
                  ? "border-blue-600 text-blue-500 bg-blue-900/20 mr-2" 
                  : "border-yellow-600 text-yellow-500 bg-yellow-900/20 mr-2"
                }
              >
                {isFundingClosed ? "Funding Complete" : "Funding Open"}
              </Badge>
            )}
            <span className="text-zinc-400">Project ID: {projectId}</span>
          </div>
        </div>
        
        <Button variant="outline" className="border-emerald-700 bg-emerald-900/10 hover:bg-emerald-800/30 hover:text-white hover:border-emerald-600 transition-colors">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Main grid layout with investment form on right side if funding is not closed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Investment metrics stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                  {useMockData ? "Investment Amount" : "Total Funding"}
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                  {useMockData ? `$${investmentAmount.toLocaleString()}` : `${formattedLoanAmount} USDC`}
            </div>
            <p className="text-xs text-zinc-500">
                  {useMockData ? mockInvestment.duration : `${tenorDays || 0} days tenor`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                  {useMockData ? "ROI" : "APR"}
            </CardTitle>
            <LineChart className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                  {typeof roi === 'number' ? roi.toFixed(2) : '0'}%
            </div>
            <p className="text-xs text-zinc-500">
              Annual percentage return
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                  {useMockData ? "Current Returns" : "Current Funding"}
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                  {useMockData 
                    ? `$${totalReturns.toLocaleString()}` 
                    : `${formattedTotalAssetsInvested} USDC`}
            </div>
            <p className="text-xs text-zinc-500">
                  {useMockData 
                    ? `${(totalReturns / mockInvestment.transactions.filter(tx => tx.type === "Return" && tx.status === "Completed").length).toFixed(0)} USD monthly average` 
                    : `${fundingPercentage}% of target`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                  {isFundingClosed ? "Repayment Progress" : "Funding Progress"}
            </CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionPercentage}%
            </div>
            <div className="mt-2">
              <Progress value={completionPercentage} className="h-2 bg-zinc-800/70" indicatorClassName="bg-emerald-500" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
                  {useMockData 
                    ? `Matures: ${mockInvestment.maturityDate}` 
                    : isFundingClosed 
                      ? "Loan Active" 
                      : "Funding Open"}
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
                    {projectMetadata?.description || "Loading project description..."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-400 mb-1">Location</h3>
                        <p className="text-white">{projectMetadata?.location || "Global"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-zinc-400 mb-1">Developer Address</h3>
                        <p className="text-white font-mono text-sm">{developer || projectMetadata?.developer || "Unknown"}</p>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium text-zinc-400 mb-1">Vault Address</h3>
                        <p className="text-white font-mono text-sm">{vaultAddress || "N/A"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-zinc-400 mb-1">Development Stage</h3>
                        <p className="text-white">{projectMetadata?.developmentStage || "Unknown"}</p>
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-400 mb-1">Risk Level</h3>
                      <Badge 
                        variant="outline" 
                        className={
                            projectMetadata?.riskLevel === "Low" ? "border-green-600 text-green-500 bg-green-900/20" :
                            projectMetadata?.riskLevel === "Medium-Low" ? "border-emerald-600 text-emerald-500 bg-emerald-900/20" :
                            projectMetadata?.riskLevel === "Medium" ? "border-yellow-600 text-yellow-500 bg-yellow-900/20" :
                          "border-red-600 text-red-500 bg-red-900/20"
                        }
                      >
                          {projectMetadata?.riskLevel || "Unknown"}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-zinc-400 mb-1">Carbon Credits Generated</h3>
                        <p className="text-green-500 font-medium">{projectMetadata?.carbonCredits || 0} credits</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-zinc-400 mb-1">Energy Output</h3>
                        <p className="text-white">{projectMetadata?.energyOutput || "0 kWh"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-zinc-400 mb-1">Funding Status</h3>
                        <p className="text-white">{!useMockData && isFundingClosed ? "Funding Complete" : "Seeking Investment"}</p>
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
                        {mockInvestment?.monthlyPerformance.map((month, index) => (
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
                        <span className="text-white font-medium">${investmentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-zinc-400">Current Returns</span>
                    <span className="text-emerald-500 font-medium">${totalReturns.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-zinc-400">Monthly Average</span>
                        <span className="text-white font-medium">${(totalReturns / investmentAmount).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-zinc-400">Projected Total Returns</span>
                        <span className="text-white font-medium">${Math.round(investmentAmount * (roi / 100) * (parseInt(mockInvestment?.duration) / 12)).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-zinc-800">
                  <h3 className="text-white font-medium mb-3">Return on Investment</h3>
                  <div className="bg-zinc-800/50 h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-600 to-green-500 h-full rounded-full"
                          style={{ width: `${totalReturns / investmentAmount * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-zinc-400">0%</span>
                        <span className="text-emerald-500 font-medium">{(totalReturns / investmentAmount * 100).toFixed(1)}% return to date</span>
                        <span className="text-zinc-400">{typeof roi === 'number' ? roi.toFixed(1) : '0'}%</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-zinc-800">
                  <h3 className="text-white font-medium mb-3">Environmental Impact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/70 rounded-lg p-3 border border-emerald-900/20">
                      <div className="flex gap-2 items-center">
                        <Leaf className="h-5 w-5 text-green-500" />
                            <span className="text-white">{projectMetadata?.carbonCredits || 0} Credits</span>
                      </div>
                    </div>
                    <div className="bg-black/70 rounded-lg p-3 border border-emerald-900/20">
                      <div className="flex gap-2 items-center">
                        <BarChart className="h-5 w-5 text-emerald-500" />
                            <span className="text-white">{projectMetadata?.energyOutput || "0 kWh"}</span>
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
                      {mockInvestment?.transactions.map((tx, index) => (
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
                    {mockInvestment?.documents.map((doc, index) => (
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
          {!useMockData && vaultAddress && (
            <InvestmentForm
              vaultAddress={vaultAddress}
              projectName={projectMetadata?.name || `Project #${projectId}`}
              totalFunding={formattedLoanAmount}
              currentFunding={formattedTotalAssetsInvested}
              fundingPercentage={fundingPercentage}
              isFundingClosed={!!isFundingClosed}
              onInvestmentComplete={handleInvestmentComplete}
            />
          )}
          
          {/* If funding is closed and the user has invested, show their investment details */}
          {!useMockData && vaultAddress && isFundingClosed && shares && Number(shares) > 0 && (
            <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Your Investment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Shares:</span>
                  <span className="text-white">{shares?.toString() || "0"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Claimable Principal:</span>
                  <span className="text-white">{formattedClaimablePrincipal} USDC</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Claimable Yield:</span>
                  <span className="text-white">{formattedClaimableYield} USDC</span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Claim Principal</Button>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Claim Yield</Button>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Redeem All
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
} 