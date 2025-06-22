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
  const { projects: highValueProjects, isLoading: loadingProjects } = useGetAllHighValueProjects();
  const { pools, isLoading: loadingPools } = useGetAllPools();
  const { 
    poolIds, 
    shares, 
    values, 
    formattedTotalValue, 
    isLoading: loadingUserPools 
  } = useUserPoolInvestments(address);

  // Get details for each high-value project the user has invested in
  const [userProjectInvestments, setUserProjectInvestments] = useState<Array<{
    vaultAddress: string;
    details: any;
    investorDetails: any;
  }>>([]);
  const [loadingUserProjects, setLoadingUserProjects] = useState(false);

  useEffect(() => {
    if (!address || !highValueProjects.length) return;

    const fetchUserProjectData = async () => {
      setLoadingUserProjects(true);
      try {
        // This would need to be implemented with proper data fetching
        // For now, we'll return an empty array
        setUserProjectInvestments([]);
      } catch (error) {
        console.error('Error fetching user project data:', error);
      } finally {
        setLoadingUserProjects(false);
      }
    };

    fetchUserProjectData();
  }, [address, highValueProjects]);

  // Calculate investment metrics
  const metrics = useMemo(() => {
    const poolTotalValue = Array.isArray(values) 
      ? values.reduce((sum, value) => sum + value, BigInt(0))
      : BigInt(0);
    const projectTotalValue = userProjectInvestments.reduce((sum, investment) => {
      return sum + (Number(investment.investorDetails?.formattedShares) || 0);
    }, 0);

    const totalInvested = Number(formattedTotalValue) + projectTotalValue;
    const totalProjects = userProjectInvestments.length;
    const activePools = poolIds.length;

    // Mock ROI calculation - this would come from actual returns data
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
      },
      projectInvestments: {
        totalValue: projectTotalValue,
        projectCount: totalProjects,
        projects: userProjectInvestments
      }
    };
  }, [formattedTotalValue, userProjectInvestments, poolIds, shares, values]);

  return {
    metrics,
    availableProjects: highValueProjects,
    availablePools: pools,
    isLoading: loadingProjects || loadingPools || loadingUserPools || loadingUserProjects,
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

// Hook for user's transaction history - Enhanced with real contract events
export function useUserTransactionHistory() {
  const { address } = useAccount();
  const { shouldUseFallback } = useContractFallback();
  const eventsHook = useUserEvents(address);
  const events = shouldUseFallback ? [] : eventsHook.events;
  
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    type: 'investment' | 'withdrawal' | 'repayment' | 'claim';
    amount: string;
    projectName: string;
    timestamp: number;
    status: 'completed' | 'pending' | 'failed';
    transactionHash: string;
    blockNumber: bigint;
    description: string;
  }>>([]);
  
  useEffect(() => {
    if (!events.length) {
      setTransactions([]);
      return;
    }
    
    const processedTransactions = events.map(event => {
      let transaction: any = {
        id: event.id,
        timestamp: event.timestamp,
        status: 'completed',
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
      };
      
      switch (event.type) {
        case 'Invested':
          transaction = {
            ...transaction,
            type: 'investment',
            amount: formatUnits(event.data.amount || BigInt(0), 6),
            projectName: `Solar Project #${event.data.projectId || 'Unknown'}`,
            description: `Invested in solar energy project`
          };
          break;
          
        case 'PoolDeposit':
          transaction = {
            ...transaction,
            type: 'investment',
            amount: formatUnits(event.data.amount || BigInt(0), 6),
            projectName: `Investment Pool #${event.data.poolId || 'Unknown'}`,
            description: `Deposited to liquidity pool`
          };
          break;
          
        case 'PoolRedeem':
          transaction = {
            ...transaction,
            type: 'withdrawal',
            amount: formatUnits(event.data.amount || BigInt(0), 6),
            projectName: `Investment Pool #${event.data.poolId || 'Unknown'}`,
            description: `Redeemed from liquidity pool`
          };
          break;
          
        case 'PrincipalClaimed':
        case 'YieldClaimed':
          transaction = {
            ...transaction,
            type: 'claim',
            amount: formatUnits(event.data.amount || BigInt(0), 6),
            projectName: `Solar Project #${event.data.projectId || 'Unknown'}`,
            description: `Claimed ${event.type === 'PrincipalClaimed' ? 'principal' : 'yield'} payment`
          };
          break;
          
        case 'RepaymentRouted':
          transaction = {
            ...transaction,
            type: 'repayment',
            amount: formatUnits(event.data.amount || BigInt(0), 6),
            projectName: `Solar Project #${event.data.projectId || 'Unknown'}`,
            description: `Received project repayment`
          };
          break;
          
        default:
          return null;
      }
      
      return transaction;
    }).filter(Boolean);
    
    // Sort by timestamp (newest first)
    const sortedTransactions = processedTransactions.sort((a, b) => b.timestamp - a.timestamp);
    
    setTransactions(sortedTransactions);
  }, [events]);
  
  // Memoized helper calculations to prevent re-renders
  const transactionAnalysis = useMemo(() => {
    const getTransactionsByType = (type: string) => {
      return transactions.filter(tx => tx.type === type);
    };
    
    const getTotalByType = (type: string) => {
      return getTransactionsByType(type).reduce((sum, tx) => sum + Number(tx.amount), 0);
    };
    
    return {
      recentTransactions: transactions.slice(0, 5),
      investmentTransactions: getTransactionsByType('investment'),
      withdrawalTransactions: getTransactionsByType('withdrawal'),
      claimTransactions: getTransactionsByType('claim'),
      repaymentTransactions: getTransactionsByType('repayment'),
      totalInvested: getTotalByType('investment'),
      totalWithdrawn: getTotalByType('withdrawal'),
      totalClaimed: getTotalByType('claim'),
      totalRepayments: getTotalByType('repayment'),
    };
  }, [transactions]);
  
  return {
    transactions,
    ...transactionAnalysis,
    isLoading: false // Events are already loaded
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