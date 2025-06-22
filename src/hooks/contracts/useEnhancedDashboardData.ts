import { useAccount } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';
import { useUserPoolInvestments } from './useLiquidityPoolManager';
import { useGetAllHighValueProjects } from './useProjectFactory';
import { useVaultDetails, useInvestorDetails } from './useDirectProjectVault';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from './useUSDC';
import { 
  useContractFallback, 
  mockPortfolioMetrics, 
  mockPoolInvestments as mockPoolData,
  mockProjectInvestments as mockProjects 
} from './useContractFallback';

export interface PortfolioMetrics {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  availableWithdrawals: number;
  totalProjects: number;
  activePools: number;
  averageROI: number;
  monthlyGrowth: number;
}

export interface ProjectInvestment {
  vaultAddress: string;
  projectId: string;
  investedAmount: number;
  currentValue: number;
  claimablePrincipal: number;
  claimableInterest: number;
  roi: number;
  isActive: boolean;
}

export interface PoolInvestmentDetail {
  poolId: number;
  shares: bigint;
  value: bigint;
  formattedValue: string;
}

export function useEnhancedDashboardData() {
  const { address } = useAccount();
  const { shouldUseFallback } = useContractFallback();
  
  // Get pool investments (with fallback handling)
  const poolInvestmentsHook = useUserPoolInvestments(address);
  const poolData = shouldUseFallback ? {
    poolIds: [],
    shares: [],
    values: [],
    formattedTotalValue: '0',
    isLoading: false
  } : poolInvestmentsHook;
  
  const {
    poolIds,
    shares: poolShares,
    values: poolValues,
    formattedTotalValue: poolTotalValue,
    isLoading: poolLoading
  } = poolData;
  
  // Simplified initialization - no external project loading for now
  const [hasInitialized, setHasInitialized] = useState(false);
  const [userProjectInvestments] = useState<ProjectInvestment[]>([]);
  
  // Set initialization flag immediately when data is available or fallback is active
  useEffect(() => {
    if (shouldUseFallback || poolTotalValue !== undefined) {
      setHasInitialized(true);
    } else {
      // Fallback timer
      const timer = setTimeout(() => {
        setHasInitialized(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldUseFallback, poolTotalValue]);
  
  // Calculate portfolio metrics
  const portfolioMetrics = useMemo((): PortfolioMetrics => {
    // Pool investments
    const poolTotalInvested = Number(poolTotalValue) || 0;
    const poolCurrentValue = poolTotalInvested; // Pools maintain value + interest
    
    // Direct project investments
    const projectTotalInvested = userProjectInvestments.reduce(
      (sum, inv) => sum + inv.investedAmount, 0
    );
    const projectCurrentValue = userProjectInvestments.reduce(
      (sum, inv) => sum + inv.currentValue, 0
    );
    const totalClaimable = userProjectInvestments.reduce(
      (sum, inv) => sum + inv.claimablePrincipal + inv.claimableInterest, 0
    );
    
    // Combined metrics
    const totalInvested = poolTotalInvested + projectTotalInvested;
    const currentValue = poolCurrentValue + projectCurrentValue;
    const totalReturns = currentValue - totalInvested;
    
    // Calculate average ROI (weighted by investment amount)
    const totalProjectInvestment = userProjectInvestments.reduce(
      (sum, inv) => sum + inv.investedAmount, 0
    );
    const weightedROI = userProjectInvestments.reduce(
      (sum, inv) => sum + (inv.roi * inv.investedAmount), 0
    );
    const averageROI = totalProjectInvestment > 0 ? weightedROI / totalProjectInvestment : 0;
    
    // Calculate monthly growth (simplified - actual would need historical data)
    const monthlyGrowth = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
    
    return {
      totalInvested,
      currentValue,
      totalReturns,
      availableWithdrawals: totalClaimable,
      totalProjects: userProjectInvestments.length,
      activePools: poolIds.length,
      averageROI,
      monthlyGrowth: Math.max(0, monthlyGrowth) // Ensure non-negative
    };
  }, [poolTotalValue, userProjectInvestments, poolIds.length]);
  
  // Pool investment details - memoized to prevent recreation
  const poolInvestmentDetails = useMemo((): PoolInvestmentDetail[] => {
    return poolIds.map((id, index) => ({
      poolId: Number(id),
      shares: poolShares[index] || BigInt(0),
      value: poolValues[index] || BigInt(0),
      formattedValue: formatUnits(poolValues[index] || BigInt(0), USDC_DECIMALS)
    }));
  }, [poolIds, poolShares, poolValues]);
  
  // Memoize the return object to prevent re-creation
  return useMemo(() => ({
    metrics: portfolioMetrics,
    poolInvestments: {
      totalValue: poolTotalValue,
      count: poolIds.length,
      details: poolInvestmentDetails
    },
    projectInvestments: userProjectInvestments,
    // Only show loading if we haven't initialized yet and pool data is still loading
    isLoading: !hasInitialized && poolLoading,
    isConnected: !!address,
    hasInvestments: portfolioMetrics.totalInvested > 0
  }), [
    portfolioMetrics, 
    poolTotalValue, 
    poolIds.length, 
    poolInvestmentDetails, 
    userProjectInvestments, 
    hasInitialized, 
    poolLoading, 
    address
  ]);
} 