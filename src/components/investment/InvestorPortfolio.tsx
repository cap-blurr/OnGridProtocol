import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  TrendingUp,
  DollarSign,
  Sun,
  Users,
  Clock,
  Zap,
  Wallet,
  ArrowUpRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  Target
} from 'lucide-react';
import { formatUnits } from 'viem';
import toast from 'react-hot-toast';

// Import hooks following integration guide
import { useGetAllHighValueProjects } from '@/hooks/contracts/useProjectFactory';
import { useVaultDetails, useInvestorDetails, useClaimPrincipal, useClaimYield } from '@/hooks/contracts/useDirectProjectVault';
import { useUserPoolInvestments, useUserShares, useRedeemFromPool } from '@/hooks/contracts/useLiquidityPoolManager';
import { useUSDCBalance } from '@/hooks/contracts/useUSDC';
import { useEnhancedDashboardData } from '@/hooks/contracts/useEnhancedDashboardData';
import { useUserTransactionHistory } from '@/hooks/contracts/useDashboardData';

interface HighValueInvestment {
  vaultAddress: `0x${string}`;
  projectId: string;
  shares: bigint;
  principalClaimed: bigint;
  interestClaimed: bigint;
  claimablePrincipal: bigint;
  claimableInterest: bigint;
  totalAssets: bigint;
  fundingPercentage: number;
  isFundingClosed: boolean;
}

interface PoolInvestment {
  poolId: number;
  shares: bigint;
  value: bigint;
  poolName?: string;
}

export default function InvestorPortfolio() {
  const { address: userAddress, isConnected } = useAccount();
  const [selectedVaultForClaim, setSelectedVaultForClaim] = useState<`0x${string}` | null>(null);
  const [claimType, setClaimType] = useState<'principal' | 'interest' | 'both'>('both');

  // Get USDC balance
  const { formattedBalance: usdcBalance } = useUSDCBalance(userAddress);

  // Use enhanced dashboard data for portfolio metrics
  const { 
    metrics, 
    poolInvestments: poolData, 
    projectInvestments, 
    isLoading: isLoadingEnhanced 
  } = useEnhancedDashboardData();

  // Get transaction history
  const { recentTransactions } = useUserTransactionHistory();

  // Get user's pool investments (for detailed operations)
  const { poolIds, shares: poolShares, values: poolValues, isLoading: isLoadingPools } = useUserPoolInvestments(userAddress);

  // Transform project investments to match interface
  const highValueInvestments: HighValueInvestment[] = projectInvestments.map(project => ({
    vaultAddress: project.vaultAddress as `0x${string}`,
    projectId: project.projectId,
    shares: BigInt(Math.round(project.investedAmount * 1e6)), // Convert to wei
    principalClaimed: BigInt(0), // Would need to track from events
    interestClaimed: BigInt(0), // Would need to track from events  
    claimablePrincipal: BigInt(Math.round(project.claimablePrincipal * 1e6)),
    claimableInterest: BigInt(Math.round(project.claimableInterest * 1e6)),
    totalAssets: BigInt(Math.round(project.currentValue * 1e6)),
    fundingPercentage: 0, // Would come from vault details
    isFundingClosed: !project.isActive
  }));

  // Transform pool investments to match interface
  const poolInvestments: PoolInvestment[] = poolData.details.map(pool => ({
    poolId: pool.poolId,
    shares: pool.shares,
    value: pool.value,
    poolName: `Solar Pool ${pool.poolId}`
  }));

  // Use enhanced portfolio metrics directly
  const portfolioTotals = {
    totalInvested: metrics.totalInvested,
    highValueTotal: projectInvestments.reduce((sum, p) => sum + p.investedAmount, 0),
    poolTotal: Number(poolData.totalValue || '0'),
    totalClaimable: metrics.availableWithdrawals,
    projectCount: metrics.totalProjects,
    poolCount: metrics.activePools
  };

  const isLoadingHighValue = isLoadingEnhanced;

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Investment Portfolio</h1>
        <p className="text-xl text-gray-300">Please connect your wallet to view your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-oga-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${portfolioTotals.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-400">Across all investments</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Claimable Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-oga-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oga-green">
              ${portfolioTotals.totalClaimable.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-400">Ready to claim</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Direct Projects</CardTitle>
            <Sun className="h-4 w-4 text-oga-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{portfolioTotals.projectCount}</div>
            <p className="text-xs text-zinc-400">${portfolioTotals.highValueTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} invested</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pool Investments</CardTitle>
            <Users className="h-4 w-4 text-oga-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{portfolioTotals.poolCount}</div>
            <p className="text-xs text-zinc-400">${portfolioTotals.poolTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} invested</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Details */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-black/20">
          <TabsTrigger value="projects" className="data-[state=active]:bg-oga-green/20">
            Direct Projects
          </TabsTrigger>
          <TabsTrigger value="pools" className="data-[state=active]:bg-oga-green/20">
            Pool Investments
          </TabsTrigger>
          <TabsTrigger value="claims" className="data-[state=active]:bg-oga-green/20">
            Claims & Returns
          </TabsTrigger>
        </TabsList>

        {/* High-Value Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {isLoadingHighValue ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-oga-green" />
            </div>
          ) : highValueInvestments.length === 0 ? (
            <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
              <CardContent className="py-12 text-center">
                <Sun className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                <h3 className="text-lg font-semibold text-white mb-2">No Direct Project Investments</h3>
                <p className="text-zinc-400 mb-4">
                  You haven't invested in any direct solar projects yet.
                </p>
                <Button className="bg-oga-green hover:bg-oga-green/80">
                  Explore Projects
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highValueInvestments.map((investment) => (
                <Card key={investment.vaultAddress} className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">Project #{investment.projectId}</CardTitle>
                      <Badge className={investment.isFundingClosed ? 
                        "bg-green-500/20 text-green-400 border-green-500/50" : 
                        "bg-blue-500/20 text-blue-400 border-blue-500/50"
                      }>
                        {investment.isFundingClosed ? 'Active' : 'Funding'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-400">Your Investment:</span>
                        <div className="text-white font-medium">
                          ${Number(formatUnits(investment.shares, 6)).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-400">Funding Progress:</span>
                        <div className="text-oga-green font-medium">
                          {investment.fundingPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Claimable Principal:</span>
                        <span className="text-white">
                          ${Number(formatUnits(investment.claimablePrincipal, 6)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Claimable Interest:</span>
                        <span className="text-oga-green">
                          ${Number(formatUnits(investment.claimableInterest, 6)).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-oga-green/30 text-oga-green hover:bg-oga-green/10"
                        onClick={() => window.open(`https://sepolia.basescan.org/address/${investment.vaultAddress}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Contract
                      </Button>
                      {(investment.claimablePrincipal > BigInt(0) || investment.claimableInterest > BigInt(0)) && (
                        <Button
                          size="sm"
                          className="flex-1 bg-oga-green hover:bg-oga-green/80"
                          onClick={() => setSelectedVaultForClaim(investment.vaultAddress)}
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          Claim Returns
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pool Investments Tab */}
        <TabsContent value="pools" className="space-y-4">
          {isLoadingPools ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-oga-green" />
            </div>
          ) : poolInvestments.length === 0 ? (
            <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
              <CardContent className="py-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                <h3 className="text-lg font-semibold text-white mb-2">No Pool Investments</h3>
                <p className="text-zinc-400 mb-4">
                  You haven't invested in any liquidity pools yet.
                </p>
                <Button className="bg-oga-green hover:bg-oga-green/80">
                  Explore Pools
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {poolInvestments.map((investment) => (
                <PoolInvestmentCard
                  key={investment.poolId}
                  poolId={investment.poolId}
                  shares={investment.shares}
                  value={investment.value}
                  poolName={investment.poolName}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-4">
          <ClaimsAndReturns 
            investments={highValueInvestments}
            userAddress={userAddress}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Pool Investment Card Component
interface PoolInvestmentCardProps {
  poolId: number;
  shares: bigint;
  value: bigint;
  poolName?: string;
}

function PoolInvestmentCard({ poolId, shares, value, poolName }: PoolInvestmentCardProps) {
  const { address: userAddress } = useAccount();
  const [redeemAmount, setRedeemAmount] = useState('');
  const { redeem, isLoading: isRedeeming } = useRedeemFromPool();

  const handleRedeem = () => {
    if (!redeemAmount || BigInt(redeemAmount) <= BigInt(0)) {
      toast.error('Please enter a valid amount to redeem');
      return;
    }
    
    if (BigInt(redeemAmount) > shares) {
      toast.error('Cannot redeem more shares than you own');
      return;
    }

    redeem(poolId, redeemAmount);
    setRedeemAmount('');
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-oga-green" />
          {poolName || `Pool ${poolId}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-400">Your Shares:</span>
            <div className="text-white font-medium">{Number(shares).toLocaleString()}</div>
          </div>
          <div>
            <span className="text-zinc-400">Current Value:</span>
            <div className="text-oga-green font-medium">
              ${Number(formatUnits(value, 6)).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-zinc-300 text-sm">Shares to Redeem:</label>
          <input
            type="number"
            value={redeemAmount}
            onChange={(e) => setRedeemAmount(e.target.value)}
            placeholder="Enter shares amount"
            className="w-full bg-black/20 border border-oga-green/30 rounded px-3 py-2 text-white text-sm focus:border-oga-green focus:outline-none"
            max={Number(shares)}
          />
        </div>

        <Button
          onClick={handleRedeem}
          disabled={isRedeeming || !redeemAmount || BigInt(redeemAmount) <= BigInt(0)}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
        >
          {isRedeeming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redeeming...
            </>
          ) : (
            'Redeem Shares'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Claims and Returns Component
interface ClaimsAndReturnsProps {
  investments: HighValueInvestment[];
  userAddress?: `0x${string}`;
}

function ClaimsAndReturns({ investments, userAddress }: ClaimsAndReturnsProps) {
  const totalClaimablePrincipal = investments.reduce((total, inv) => 
    total + Number(formatUnits(inv.claimablePrincipal, 6)), 0
  );
  
  const totalClaimableInterest = investments.reduce((total, inv) => 
    total + Number(formatUnits(inv.claimableInterest, 6)), 0
  );

  const hasClaimableReturns = totalClaimablePrincipal > 0 || totalClaimableInterest > 0;

  if (!hasClaimableReturns) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardContent className="py-12 text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
          <h3 className="text-lg font-semibold text-white mb-2">No Returns Available</h3>
          <p className="text-zinc-400">
            You don't have any claimable returns at the moment. Returns will become available as projects make repayments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="text-white">Available Returns Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-2xl font-bold text-white">
                ${totalClaimablePrincipal.toFixed(2)}
              </div>
              <p className="text-zinc-400">Claimable Principal</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-oga-green">
                ${totalClaimableInterest.toFixed(2)}
              </div>
              <p className="text-zinc-400">Claimable Interest</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Investment Claims */}
      <div className="space-y-3">
        {investments
          .filter(inv => inv.claimablePrincipal > BigInt(0) || inv.claimableInterest > BigInt(0))
          .map((investment) => (
            <Card key={investment.vaultAddress} className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Project #{investment.projectId}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      ${Number(formatUnits(investment.claimablePrincipal, 6)).toFixed(2)}
                    </div>
                    <p className="text-zinc-400 text-sm">Principal</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-oga-green">
                      ${Number(formatUnits(investment.claimableInterest, 6)).toFixed(2)}
                    </div>
                    <p className="text-zinc-400 text-sm">Interest</p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full bg-oga-green hover:bg-oga-green/80"
                      onClick={() => {
                        // Implement claim functionality
                        toast.success('Claim functionality will be implemented');
                      }}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Claim All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}