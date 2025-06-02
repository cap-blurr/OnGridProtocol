"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  ArrowRight,
  Globe2,
  RefreshCw,
  Clock,
  Trees,
  BarChart3,
  History,
  Network,
  Wallet,
  CreditCard,
  LineChart,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateProjectModal } from "@/components/project/create-project";
import Link from "next/link";
import { useUserType } from "@/providers/userType";
import { useAccount } from "wagmi";
import LoadingScreen from "@/components/ui/loading-screen";
import SwitchAccountButton from "@/components/wallet/SwitchAccountButton";
import { useRouter } from "next/navigation";
import { DashboardTabs } from "@/components/ui/custom-tabs";
import PoolInvestmentCard from "@/components/project/PoolInvestmentCard";
import DirectProjectInvestmentList from "@/components/project/DirectProjectInvestmentList";
import CarbonCreditsDashboardCard from "@/components/project/CarbonCreditsDashboardCard";

const mockData = {
  investments: {
    totalValue: 385000,
    totalProjects: 5,
    change: 8.5,
    roi: 12.7,
    activePoolInvestments: 3,
    projectsDistribution: [
      { name: "Solar Farms", percentage: 40 },
      { name: "Wind Energy", percentage: 30 },
      { name: "Hydroelectric", percentage: 20 },
      { name: "Biomass", percentage: 10 },
    ],
    recentTransactions: [
      {
        id: 1,
        project: "California Solar Farm",
        amount: 50000,
        type: "Direct Investment",
        timestamp: "2024-05-15T10:00:00",
      },
      {
        id: 2,
        project: "Green Energy Pool A",
        amount: 25000,
        type: "Pool Investment",
        timestamp: "2024-05-10T15:30:00",
      },
      {
        id: 3,
        project: "Texas Wind Farm",
        amount: 35000,
        type: "Direct Investment",
        timestamp: "2024-05-05T09:15:00",
      },
    ],
  },
  carbonCredits: {
    totalCredits: 1250,
    creditValue: 125000,
    tco2eReduced: 1250, // in tonnes
    energyProduced: 2800, // in kWh
    deviceEfficiency: 92, // percentage
    dailyEnergyOutput: [
      { day: "Mon", output: 420 },
      { day: "Tue", output: 380 },
      { day: "Wed", output: 450 },
      { day: "Thu", output: 470 },
      { day: "Fri", output: 400 },
      { day: "Sat", output: 350 },
      { day: "Sun", output: 330 },
    ],
    devices: [
      {
        id: 1,
        name: "Solar Panel Array A",
        status: "Active",
        output: 850,
        efficiency: 94,
      },
      {
        id: 2,
        name: "Wind Turbine Cluster B",
        status: "Active",
        output: 1200,
        efficiency: 89,
      },
      {
        id: 3,
        name: "Hydroelectric Unit C",
        status: "Maintenance",
        output: 750,
        efficiency: 0,
      },
    ],
  },
};

export default function DashboardPage() {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const { userType, isLoading } = useUserType();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("investments");

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle authentication and routing
  useEffect(() => {
    if (!mounted) return; // Wait for client-side hydration
    
    const handleAuth = async () => {
      try {
        if (isLoading) return; // Wait for auth state
        
        if (!userType) {
          await router.replace('/');
          return;
        }
        
        if (userType === 'developer') {
          await router.replace('/developer-dashboard');
          return;
        }
        
        // Only set loading to false if we're staying on this page
        setIsLoadingAuth(false);
      } catch (error) {
        console.error('Error during auth check:', error);
      }
    };
    
    handleAuth();
  }, [userType, isLoading, router]);

  if (isLoadingAuth) {
    return <LoadingScreen />;
  }

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
            Investor Dashboard
            <div className="absolute -left-6 top-1/2 w-3 h-px bg-emerald-500" />
          </span>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-zinc-400">
            Monitor your investments and carbon credits
          </p>
        </div>
        
        {/* Wallet Connection Notice */}
        {!isConnected && (
          <Alert className="mb-6 bg-emerald-900/20 border-emerald-800/50 text-emerald-100">
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to access full investment features and make transactions.
              <SwitchAccountButton className="ml-3" />
            </AlertDescription>
          </Alert>
        )}
        
        <DashboardTabs
          tabs={[
            { value: "investments", label: "Investments" },
            { value: "carbonCredits", label: "Carbon Credits" }
          ]}
          activeTab={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsContent value="investments">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Investment Overview Card */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors cursor-pointer overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Total Investments
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    ${mockData.investments.totalValue.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-xs text-emerald-400">{mockData.investments.change}% monthly growth</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors cursor-pointer overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Average ROI
                  </CardTitle>
                  <LineChart className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    {mockData.investments.roi}%
                  </div>
                  <p className="text-xs text-zinc-400">
                    Annual percentage return
                  </p>
                </CardContent>
              </Card>

              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors cursor-pointer overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Active Pools
                  </CardTitle>
                  <Network className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    {mockData.investments.activePoolInvestments}
                  </div>
                  <p className="text-xs text-zinc-400">
                    With varied APY rates
                  </p>
                </CardContent>
              </Card>

              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-colors cursor-pointer overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Total Projects
                  </CardTitle>
                  <Trees className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-white">
                    {mockData.investments.totalProjects}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Direct and pooled investments
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <History className="h-5 w-5 text-emerald-500" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your latest investment activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    {mockData.investments.recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between border-b border-zinc-800/50 pb-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{tx.project}</span>
                          <span className="text-sm text-zinc-400">{new Date(tx.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-emerald-500">${tx.amount.toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs border-emerald-800 bg-emerald-900/20 text-emerald-300">{tx.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-auto mx-auto mt-4 px-4 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-900/20 group" asChild>
                    <Link href="/dashboard/investments/current">
                      View all transactions <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Investment Distribution */}
              <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                    Investment Distribution
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Allocation of your investments across projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    {mockData.investments.projectsDistribution.map((project, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-zinc-300">{project.name}</span>
                          <span className="text-zinc-300">{project.percentage}%</span>
                        </div>
                        <Progress value={project.percentage} className="h-1.5 bg-zinc-800/70" indicatorClassName="bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="border-emerald-800 hover:bg-emerald-900/20 hover:text-emerald-300" asChild>
                  <Link href="/dashboard/investments/opportunities">
                    Browse Investment Opportunities
                  </Link>
                </Button>
                <Button variant="outline" className="border-emerald-800 hover:bg-emerald-900/20 hover:text-emerald-300" asChild>
                  <Link href="/dashboard/investments/pools">
                    Explore Investment Pools
                  </Link>
                </Button>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-8 border-zinc-800/50" />

            {/* Pool Investment Section */}
            <PoolInvestmentCard />

            {/* Divider */}
            <hr className="my-8 border-zinc-800/50" />

            {/* Direct Project Investment Section */}
            <DirectProjectInvestmentList />

          </TabsContent>
          
          <TabsContent value="carbonCredits">
            <CarbonCreditsDashboardCard />
          </TabsContent>
        </DashboardTabs>
      </div>
    </div>
  );
}