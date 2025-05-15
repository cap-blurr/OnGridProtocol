"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { usePoolCount, usePoolInfo, useUserShares } from "@/hooks/contracts/useLiquidityPoolManager";
import { formatUnits } from "ethers";
import {
  AlertCircle, 
  BarChart, 
  Shield, 
  TrendingUp,
  Wallet,
  Percent,
  Info,
  ArrowRightLeft,
  RefreshCw,
  Loader2,
  Search,
  Wind,
  Leaf
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USDC_DECIMALS } from "@/hooks/contracts/useUSDC";
import PoolInvestmentForm from "@/components/project/PoolInvestmentForm";
import { useRouter } from "next/navigation";

// Risk level mapping
const RISK_LEVELS = {
  1: "Low",
  2: "Medium-Low",
  3: "Medium",
  4: "High"
};

export default function LiquidityPoolsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("pools");
  const { address } = useAccount();
  const router = useRouter();
  
  // Get pool count
  const { poolCount } = usePoolCount();
  
  // Track loaded pools
  const [availablePools, setAvailablePools] = useState<{
    id: number;
    name: string;
    totalAssets: string;
    totalShares: string;
    riskLevel: string;
    aprPercentage: number;
  }[]>([]);
  
  // Load pool information when pool count changes
  useEffect(() => {
    if (poolCount) {
      setIsLoading(true);
      const loadPoolInfo = async () => {
        try {
          const pools = [];
          
          // Pool IDs start at 1
          for (let i = 1; i <= Number(poolCount); i++) {
            pools.push(i);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading pool information:", error);
          setIsLoading(false);
        }
      };
      
      loadPoolInfo();
    }
  }, [poolCount]);
  
  // Load mock pools while we wait for real data
  useEffect(() => {
    const loadMockPools = async () => {
      // In a real app, you would dynamically load pool data from blockchain
      // Here we'll simulate it with static data
      const mockPools = [
        {
          id: 1,
          name: "Green Energy Pool",
          totalAssets: "250000",
          totalShares: "245000",
          riskLevel: "Low",
          aprPercentage: 8.5
        },
        {
          id: 2,
          name: "Solar Innovation Pool",
          totalAssets: "750000",
          totalShares: "730000",
          riskLevel: "Medium-Low",
          aprPercentage: 11.2
        },
        {
          id: 3,
          name: "Wind Energy Pool",
          totalAssets: "500000",
          totalShares: "485000",
          riskLevel: "Medium",
          aprPercentage: 14.7
        }
      ];
      
      setAvailablePools(mockPools);
      setIsLoading(false);
    };
    
    loadMockPools();
  }, []);
  
  // Handle pool selection for investment
  const handlePoolSelect = (poolId: number) => {
    setSelectedPool(poolId);
    setActiveTab("invest");
  };
  
  // Handle investment completion
  const handleInvestmentComplete = () => {
    // Refresh the pools data
    router.refresh();
    
    // Reset selected pool and go back to pools view
    setSelectedPool(null);
    setActiveTab("pools");
  };
  
  // Get pool information for the selected pool
  const selectedPoolInfo = availablePools.find(pool => pool.id === selectedPool);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Liquidity Pools</h1>
          <p className="text-zinc-400">
          Invest in diversified pools to support multiple renewable energy projects
          </p>
        </div>
        
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900/50 border border-zinc-800">
          <TabsTrigger value="pools" className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400">
            Available Pools
          </TabsTrigger>
          {selectedPool && (
            <TabsTrigger value="invest" className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400">
              Invest
            </TabsTrigger>
          )}
          <TabsTrigger value="my-investments" className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400">
            My Pool Investments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pools">
          {/* Search and filter */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Search pools by name" 
                className="pl-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600"
              />
              </div>
              </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <span className="ml-3 text-zinc-400">Loading available pools...</span>
              </div>
          ) : availablePools.length === 0 ? (
            <Card className="relative bg-black/40 backdrop-blur-sm border border-zinc-800/30 overflow-hidden">
              <CardContent className="py-10">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-1">No pools found</h3>
                  <p className="text-zinc-400">There are currently no active liquidity pools available.</p>
              </div>
            </CardContent>
          </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {availablePools.map((pool) => (
                <Card 
                  key={pool.id} 
                  className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-600/50 transition-all cursor-pointer overflow-hidden"
                  onClick={() => handlePoolSelect(pool.id)}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
                  
                  <CardHeader className="relative">
                    <div className="flex justify-between items-start mb-2">
                      <Badge 
                        variant="outline" 
                        className="bg-emerald-900/30 text-emerald-300 border-emerald-800"
                      >
                        <Leaf className="h-3 w-3 mr-1 text-emerald-300" />
                        Pool {pool.id}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          pool.riskLevel === "Low" ? "bg-green-900/30 text-green-300 border-green-800" :
                          pool.riskLevel === "Medium-Low" ? "bg-emerald-900/30 text-emerald-300 border-emerald-800" :
                          pool.riskLevel === "Medium" ? "bg-yellow-900/30 text-yellow-300 border-yellow-800" :
                          "bg-red-900/30 text-red-300 border-red-800"
                        }
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {pool.riskLevel} Risk
                      </Badge>
                    </div>
                    <CardTitle className="text-white">{pool.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Diversified investment pool for renewable energy projects
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Total Assets</span>
                        <span className="text-white">{formatUnits(pool.totalAssets, USDC_DECIMALS)} USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Total Shares</span>
                        <span className="text-white">{formatUnits(pool.totalShares, USDC_DECIMALS)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Expected APR</span>
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-400 font-medium">{pool.aprPercentage.toFixed(1)}%</span>
                      </div>
                      </div>
                    </div>
                    
                    <Alert className="bg-blue-900/30 border-blue-800 py-2">
                      <Info className="h-4 w-4 text-blue-300" />
                      <AlertDescription className="text-blue-300 text-xs">
                        This pool funds low-value projects that match its risk profile.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  
                  <CardFooter className="relative border-t border-zinc-800/50 pt-4">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2 items-center"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      Invest in Pool
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="invest">
          {selectedPoolInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-white">{selectedPoolInfo.name}</CardTitle>
                <CardDescription className="text-zinc-400">
                          Pool #{selectedPoolInfo.id} - {selectedPoolInfo.riskLevel} Risk
                </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          selectedPoolInfo.riskLevel === "Low" ? "bg-green-900/30 text-green-300 border-green-800" :
                          selectedPoolInfo.riskLevel === "Medium-Low" ? "bg-emerald-900/30 text-emerald-300 border-emerald-800" :
                          selectedPoolInfo.riskLevel === "Medium" ? "bg-yellow-900/30 text-yellow-300 border-yellow-800" :
                          "bg-red-900/30 text-red-300 border-red-800"
                        }
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {selectedPoolInfo.riskLevel} Risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-black/40 rounded-lg p-4 border border-emerald-900/10">
                        <div className="text-sm text-zinc-500 mb-1">Total Assets</div>
                        <div className="text-xl font-bold text-white">
                          {formatUnits(selectedPoolInfo.totalAssets, USDC_DECIMALS)} USDC
                        </div>
                      </div>
                      <div className="bg-black/40 rounded-lg p-4 border border-emerald-900/10">
                        <div className="text-sm text-zinc-500 mb-1">Expected APR</div>
                        <div className="text-xl font-bold text-emerald-400">
                          {selectedPoolInfo.aprPercentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-black/40 rounded-lg p-4 border border-emerald-900/10">
                        <div className="text-sm text-zinc-500 mb-1">Risk Level</div>
                        <div className="text-xl font-bold text-white">
                          {selectedPoolInfo.riskLevel}
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="bg-blue-900/20 border-blue-800">
                      <Info className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-400">
                        <span className="font-medium">How Pool Investments Work:</span> Your funds will be automatically allocated to low-value renewable energy projects that match this pool's risk profile. You'll earn returns as those projects make repayments.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-4 pt-4">
                      <h3 className="text-lg font-medium text-white">Pool Details</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Pool Type</span>
                          <span className="text-white">Renewable Energy</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Project Focus</span>
                          <span className="text-white">Low-Value Projects</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Minimum Investment</span>
                          <span className="text-white">100 USDC</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Exit Fee</span>
                          <span className="text-white">0%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Lockup Period</span>
                          <span className="text-white">None</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline"
                        className="border-zinc-700 text-zinc-400"
                        onClick={() => {
                          setSelectedPool(null);
                          setActiveTab("pools");
                        }}
                      >
                        Back to Pools
                      </Button>
                </div>
              </CardContent>
            </Card>
              </div>
              
              <div className="lg:col-span-1">
                <PoolInvestmentForm
                  poolId={selectedPoolInfo.id}
                  poolName={selectedPoolInfo.name}
                  riskLevel={selectedPoolInfo.riskLevel}
                  aprPercentage={selectedPoolInfo.aprPercentage}
                  totalAssets={formatUnits(selectedPoolInfo.totalAssets, USDC_DECIMALS)}
                  onInvestmentComplete={handleInvestmentComplete}
                />
              </div>
            </div>
          )}
          </TabsContent>
          
        <TabsContent value="my-investments">
          {!address ? (
            <Alert className="bg-yellow-900/30 border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertTitle className="text-yellow-400">Wallet not connected</AlertTitle>
              <AlertDescription className="text-yellow-400">
                Please connect your wallet to view your pool investments.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <span className="ml-3 text-zinc-400">Loading your investments...</span>
            </div>
          ) : (
            // Placeholder for user investments - would be populated with blockchain data
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePools.map((pool) => (
                <Card 
                  key={pool.id}
                  className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20"
                >
                  <CardHeader>
                    <CardTitle className="text-white">{pool.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Pool Investment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Your Shares</span>
                        <span className="text-white">1,250</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Share Value</span>
                        <span className="text-white">1.02 USDC</span>
                    </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Investment Value</span>
                        <span className="text-white">1,275 USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Profit</span>
                        <span className="text-emerald-400">+25 USDC</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="text-emerald-500 font-medium">+2.5% Growth</span>
                      </div>
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="text-white">{pool.aprPercentage.toFixed(1)}% APR</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-zinc-800/50 pt-4 grid grid-cols-2 gap-2">
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Deposit More
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-emerald-700 hover:bg-emerald-900/20 text-emerald-400"
                    >
                      Withdraw
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          </TabsContent>
      </Tabs>
    </div>
  );
} 