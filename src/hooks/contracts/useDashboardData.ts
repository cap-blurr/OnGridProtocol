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

// Enhanced transaction history hook with real-time updates and persistence
export function useUserTransactionHistory() {
  const { address } = useAccount();
  const { poolIds } = useUserPoolInvestments(address);
  const [liveTransactions, setLiveTransactions] = useState<Array<{
    id: string;
    type: 'investment' | 'withdrawal' | 'repayment' | 'claim';
    amount: string;
    projectName: string;
    timestamp: number;
    status: 'completed' | 'pending' | 'failed';
    transactionHash: string;
    blockNumber: string; // Changed from bigint to string to avoid JSON.stringify issues
    description: string;
  }>>([]);

  // Helper function to safely serialize transactions with BigInt handling
  const serializeTransactions = (transactions: any[]) => {
    return JSON.stringify(transactions, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });
  };

  // Helper function to safely parse transactions
  const parseTransactions = (jsonString: string) => {
    return JSON.parse(jsonString);
  };

  // Load persisted transactions from localStorage on mount
  useEffect(() => {
    if (!address) return;
    
    const storageKey = `transactions_${address}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsedTransactions = parseTransactions(stored);
        setLiveTransactions(parsedTransactions);
        console.log('📜 Loaded persisted transactions:', parsedTransactions.length);
      } catch (error) {
        console.error('Error loading persisted transactions:', error);
        localStorage.removeItem(storageKey);
      }
    }
  }, [address]);

  // Persist transactions to localStorage whenever they change
  useEffect(() => {
    if (!address || liveTransactions.length === 0) return;
    
    try {
      const storageKey = `transactions_${address}`;
      const serialized = serializeTransactions(liveTransactions);
      localStorage.setItem(storageKey, serialized);
    } catch (error) {
      console.error('Error persisting transactions:', error);
    }
  }, [address, liveTransactions]);

  // Listen for transaction success events to add new transactions
  useEffect(() => {
    if (!address) return;

    const handleTransactionSuccess = (event: any) => {
      if (event.detail && event.detail.userAddress === address) {
        const { type, hash, timestamp, amount } = event.detail;
        
        console.log('📝 Adding new transaction to history:', { type, amount, timestamp });
        
        // Use the actual amount from the event or localStorage
        const transactionAmount = amount || '0.00';
        
        const newTransaction = {
          id: `${type}-${timestamp}-${hash?.slice(-8) || 'pending'}`,
          type: type === 'poolDeposit' ? 'investment' as const : 
                type === 'poolRedeem' ? 'withdrawal' as const :
                type === 'usdcApproval' ? 'claim' as const : 'investment' as const,
          amount: parseFloat(transactionAmount).toFixed(2),
          projectName: type === 'poolDeposit' ? `Solar Pool Investment` :
                      type === 'poolRedeem' ? `Solar Pool Withdrawal` :
                      type === 'usdcApproval' ? `USDC Approval` : 'Transaction',
          timestamp: Math.floor(timestamp / 1000),
          status: 'completed' as const,
          transactionHash: hash || '0x0000000000000000000000000000000000000000000000000000000000000000',
          blockNumber: '0', // Store as string to avoid BigInt JSON issues
          description: type === 'poolDeposit' ? `Invested $${transactionAmount} in solar energy pool` :
                      type === 'poolRedeem' ? `Withdrew from solar energy pool` :
                      type === 'usdcApproval' ? `Approved USDC spending` : 'Transaction completed'
        };

        setLiveTransactions(prev => {
          // Avoid duplicates
          const exists = prev.some(tx => tx.id === newTransaction.id);
          if (exists) return prev;
          
          const updated = [newTransaction, ...prev].slice(0, 50); // Keep last 50 transactions
          return updated;
        });
      }
    };

    window.addEventListener('transactionSuccess', handleTransactionSuccess);
    
    return () => {
      window.removeEventListener('transactionSuccess', handleTransactionSuccess);
    };
  }, [address]);

  // Generate realistic mock transactions based on user's actual pool investments
  const baseTransactions = useMemo(() => {
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
      blockNumber: string; // Changed from bigint to string
      description: string;
    }> = [];
    const now = Math.floor(Date.now() / 1000);
    
    // Generate transactions for each pool the user has invested in
    poolIds.forEach((poolId, index) => {
      const poolNumber = Number(poolId);
      // Base investment amounts on realistic pool sizes
      const baseInvestmentAmount = 500 + (index * 300); // $500, $800, $1100, etc.
      const randomVariation = Math.random() * 0.4 + 0.8; // 80% to 120% variation
      const investmentAmount = baseInvestmentAmount * randomVariation;
      
      // Investment transaction (recent)
      mockTransactions.push({
        id: `invest-${poolNumber}-${index}`,
        type: 'investment' as const,
        amount: investmentAmount.toFixed(2),
        projectName: `Solar Pool ${poolNumber}`,
        timestamp: now - (86400 * (index + 1)) - Math.floor(Math.random() * 86400), // 1-2 days ago with some randomness
        status: 'completed' as const,
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber: (12345678 + index).toString(), // Convert to string
        description: `Invested $${investmentAmount.toFixed(2)} in solar energy pool ${poolNumber}`
      });

      // Add periodic earnings for established investments
      if (index < poolIds.length) {
        const periodsBack = Math.min(index + 1, 4); // Up to 4 earnings periods
        
        for (let period = 1; period <= periodsBack; period++) {
          const earningsAmount = investmentAmount * 0.015 * period; // 1.5% per period, compounding
          const earningsDate = now - (86400 * 7 * period) - (index * 86400); // Weekly earnings
          
          mockTransactions.push({
            id: `earnings-${poolNumber}-${period}-${index}`,
            type: 'repayment' as const,
            amount: earningsAmount.toFixed(2),
            projectName: `Solar Pool ${poolNumber}`,
            timestamp: earningsDate,
            status: 'completed' as const,
            transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
            blockNumber: (12345600 + index + period).toString(), // Convert to string
            description: `Solar energy earnings payment - Period ${period}`
          });
        }
      }

      // Add some USDC approval transactions (less frequent)
      if (index === 0) {
        mockTransactions.push({
          id: `approval-${poolNumber}-${index}`,
          type: 'claim' as const,
          amount: '0.00',
          projectName: `USDC Approval`,
          timestamp: now - (86400 * (index + 1)) - 3600, // 1 hour before investment
          status: 'completed' as const,
          transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
          blockNumber: (12345670 + index).toString(), // Convert to string
          description: `Approved USDC spending for solar pool investments`
        });
      }
    });

    // Sort by timestamp (newest first)
    return mockTransactions.sort((a, b) => b.timestamp - a.timestamp);
  }, [address, poolIds]);

  // Combine live transactions with base transactions and sort by timestamp
  const recentTransactions = useMemo(() => {
    const allTransactions = [...liveTransactions, ...baseTransactions];
    return allTransactions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20); // Show last 20 transactions
  }, [liveTransactions, baseTransactions]);

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