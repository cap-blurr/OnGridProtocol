import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useGetAllHighValueProjects } from './useProjectFactory';
import { useGetAllPools, useUserPoolInvestments } from './useLiquidityPoolManager';
import { useVaultDetails, useInvestorDetails } from './useDirectProjectVault';
import { useDeveloperProjectStats } from './useDeveloperProjects';
import { useIsVerified } from './useDeveloperRegistry';
import { useUserEvents } from './useContractEvents';
import { useContractFallback } from './useContractFallback';
import { useState, useEffect, useMemo } from 'react';

// Hook for investor dashboard data
export function useInvestorDashboardData() {
  const { address } = useAccount();
  
  // Get user pool data
  const { 
    poolIds, 
    shares, 
    values, 
    formattedTotalValue, 
    isLoading: loadingUserPools 
  } = useUserPoolInvestments(address);
  
  // Get available projects and pools
  const { projects: highValueProjects, isLoading: loadingProjects } = useGetAllHighValueProjects();
  const { pools, isLoading: loadingPools } = useGetAllPools();

  // Calculate simple investment metrics
  const metrics = useMemo(() => {
    const poolTotalValue = Array.isArray(values) 
      ? values.reduce((sum, value) => sum + value, BigInt(0))
      : BigInt(0);

    const totalInvested = Number(formattedTotalValue) || 0;
    const totalProjects = 0; // Simplified - no direct projects for now
    const activePools = poolIds.length;

    // Simple mock ROI calculation
    const averageROI = 12.5;
    const monthlyGrowth = 8.5;

    return {
      totalInvested,
      totalProjects,
      activePools,
      averageROI,
      monthlyGrowth,
      poolInvestments: {
        totalValue: formattedTotalValue,
        poolCount: activePools,
        pools: poolIds.map((id, index) => ({
          poolId: Number(id),
          shares: shares[index],
          value: values[index],
        }))
      }
    };
  }, [formattedTotalValue, poolIds, shares, values]);

  return {
    metrics,
    availableProjects: highValueProjects,
    availablePools: pools,
    isLoading: loadingProjects || loadingPools || loadingUserPools,
    isConnected: !!address,
  };
}

// Hook for developer dashboard data
export function useDeveloperDashboardData() {
  const { address } = useAccount();
  const { data: isVerified, isLoading: loadingVerification } = useIsVerified(address);
  const { 
    totalProjects,
    activeProjects,
    completedProjects,
    totalRepayments,
    isLoading: loadingStats 
  } = useDeveloperProjectStats(address);

  const developerMetrics = useMemo(() => {
    return {
      isVerified: !!isVerified,
      totalProjects,
      activeProjects,
      completedProjects,
      totalRepayments,
      pendingProjects: totalProjects - activeProjects - completedProjects,
      averageProjectSize: totalProjects > 0 ? totalRepayments / totalProjects : 0,
    };
  }, [isVerified, totalProjects, activeProjects, completedProjects, totalRepayments]);

  return {
    metrics: developerMetrics,
    isLoading: loadingVerification || loadingStats,
    isConnected: !!address,
  };
}

// Hook for investment opportunities (high-value projects)
export function useInvestmentOpportunities() {
  const { projects, isLoading } = useGetAllHighValueProjects();
  const [projectsWithDetails, setProjectsWithDetails] = useState<Array<{
    vaultAddress: string;
    details: any;
    summary: any;
  }>>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!projects.length) return;

    const fetchProjectDetails = async () => {
      setLoadingDetails(true);
      try {
        // This would fetch vault details for each project
        // For now, we'll use mock data structure
        const mockDetails = projects.map((vaultAddress, index) => ({
          vaultAddress,
          details: {
            loanAmount: BigInt(500000 * (index + 1)),
            totalAssetsInvested: BigInt(320000 * (index + 1)),
            isFundingClosed: false,
            currentAprBps: 1250 + (index * 100),
            developer: `0x${Math.random().toString(16).substr(2, 40)}`,
            projectId: BigInt(index + 1),
            formattedLoanAmount: (500000 * (index + 1)).toString(),
            formattedTotalAssetsInvested: (320000 * (index + 1)).toString(),
            fundingPercentage: 64 + (index * 5),
            aprPercentage: 12.5 + (index * 0.5),
          },
          summary: {
            state: 1, // Active
            fundingProgress: 6400 + (index * 500),
            timeRemaining: BigInt(2592000), // 30 days
            totalReturn: BigInt(0),
          }
        }));
        setProjectsWithDetails(mockDetails);
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchProjectDetails();
  }, [projects]);

  return {
    opportunities: projectsWithDetails,
    isLoading: isLoading || loadingDetails,
  };
}

// Hook for pool investment opportunities
export function usePoolInvestmentOpportunities() {
  const { pools, isLoading } = useGetAllPools();
  
  const poolsWithMetrics = useMemo(() => {
    return pools.map((pool, index) => ({
      ...pool,
      id: index + 1,
      riskLevel: index % 3 === 0 ? 'Low' : index % 3 === 1 ? 'Medium' : 'High',
      aprRate: 10 + (index * 2),
      description: `Pool ${index + 1} for diversified renewable energy investments`,
    }));
  }, [pools]);

  return {
    pools: poolsWithMetrics,
    isLoading,
  };
}

// Enhanced transaction history hook with mock data
export function useUserTransactionHistory() {
  const { address } = useAccount();
  const { poolIds } = useUserPoolInvestments(address);

  // Generate realistic mock transactions based on user's actual pool investments
  const recentTransactions = useMemo(() => {
    if (!address || poolIds.length === 0) {
      return [];
    }

    const mockTransactions: Array<{
      id: string;
      type: 'investment' | 'withdrawal' | 'repayment' | 'claim';
      amount: string;
      projectName: string;
      timestamp: number;
      status: 'completed' | 'pending' | 'failed';
      transactionHash: string;
      blockNumber: bigint;
      description: string;
    }> = [];
    const now = Math.floor(Date.now() / 1000);
    
    // Generate transactions for each pool the user has invested in
    poolIds.forEach((poolId, index) => {
      const poolNumber = Number(poolId);
      
      // Investment transaction
      mockTransactions.push({
        id: `invest-${poolNumber}-${index}`,
        type: 'investment' as const,
        amount: (5000 + (index * 2500)).toLocaleString(),
        projectName: `Solar Investment Pool ${poolNumber}`,
        timestamp: now - (86400 * (index + 1)), // 1 day ago per pool
        status: 'completed' as const,
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber: BigInt(12345678 + index),
        description: `Invested in diversified solar energy pool`
      });

      // Add a mock repayment for older investments
      if (index < 2) {
        mockTransactions.push({
          id: `repay-${poolNumber}-${index}`,
          type: 'repayment' as const,
          amount: (125 + (index * 50)).toLocaleString(),
          projectName: `Solar Investment Pool ${poolNumber}`,
          timestamp: now - (86400 * 15) - (index * 86400 * 5), // 15+ days ago
          status: 'completed' as const,
          transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
          blockNumber: BigInt(12345600 + index),
          description: `Received solar energy project repayment`
        });
      }
    });

    // Sort by timestamp (newest first)
    return mockTransactions.sort((a, b) => b.timestamp - a.timestamp);
  }, [address, poolIds]);

  return {
    recentTransactions,
    isLoading: false,
    error: null
  };
}

// Main hook that combines all dashboard data
export function useDashboardData(userType: 'investor' | 'developer' = 'investor') {
  const investorData = useInvestorDashboardData();
  const developerData = useDeveloperDashboardData();
  const opportunities = useInvestmentOpportunities();
  const poolOpportunities = usePoolInvestmentOpportunities();
  const transactionHistory = useUserTransactionHistory();

  if (userType === 'developer') {
    return {
      type: 'developer' as const,
      ...developerData,
      transactionHistory,
    };
  }

  return {
    type: 'investor' as const,
    ...investorData,
    opportunities,
    poolOpportunities,
    transactionHistory,
  };
} 