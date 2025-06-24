import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { formatUnits, parseUnits } from 'viem';
import LiquidityPoolManagerABI from '@/contracts/abis/LiquidityPoolManager.json';
import { useAccount } from 'wagmi';

// Constants
const USDC_DECIMALS = 6;

// Hook to get all pools
export function useGetAllPools() {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'getAllPools',
    chainId: 84532,
  });
  
  return {
    pools: data as Array<{
      exists: boolean;
      name: string;
      totalAssets: bigint;
      totalShares: bigint;
    }> || [],
    isLoading,
    error,
    refetch
  };
}

// Hook to get user's pool investments
export function useUserPoolInvestments(userAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'getUserPoolInvestments',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!addresses.liquidityPoolManagerProxy,
      retry: 3,
      retryDelay: 2000,
      // More aggressive refresh for investment data
      refetchInterval: 20000, // 20 seconds
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  });

  // Listen for transaction events to refresh investment data
  useEffect(() => {
    if (!userAddress) return;

    const handleTransactionSuccess = (event: any) => {
      if (event.detail && event.detail.userAddress === userAddress) {
        const { type } = event.detail;
        if (type === 'poolDeposit' || type === 'poolRedeem') {
          console.log('📊 Pool investment data update triggered by:', type);
          // Aggressive refresh pattern for investment updates
          setTimeout(() => refetch(), 1000);  // 1 second
          setTimeout(() => refetch(), 3000);  // 3 seconds  
          setTimeout(() => refetch(), 7000);  // 7 seconds
          setTimeout(() => refetch(), 15000); // 15 seconds
          setTimeout(() => refetch(), 30000); // 30 seconds (final refresh)
        }
      }
    };

    window.addEventListener('transactionSuccess', handleTransactionSuccess);
    
    return () => {
      window.removeEventListener('transactionSuccess', handleTransactionSuccess);
    };
  }, [userAddress, refetch]);
  
  const result = data as [bigint[], bigint[], bigint[]] | undefined;
  
  if (!result) {
    return {
      poolIds: [],
      shares: [],
      values: [],
      formattedTotalValue: '0.00',
      isLoading,
      error,
      refetch
    };
  }
  
  const [poolIds, shares, values] = result;
  const totalValue = values.reduce((acc, value) => acc + value, BigInt(0));
  
  return {
    poolIds,
    shares,
    values,
    formattedTotalValue: formatUnits(totalValue, USDC_DECIMALS),
    isLoading,
    error,
    refetch
  };
}

// Hook to get pool loans
export function usePoolLoans(poolId: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'getPoolLoans',
    args: [BigInt(poolId)],
    chainId: 84532,
    query: {
      enabled: poolId > 0,
    },
  });
  
  const poolLoans = data as {
    projectIds: bigint[];
    loanAmounts: bigint[];
    outstandingAmounts: bigint[];
    states: number[];
  } | undefined;
  
  return {
    projectIds: poolLoans?.projectIds || [],
    loanAmounts: poolLoans?.loanAmounts || [],
    outstandingAmounts: poolLoans?.outstandingAmounts || [],
    states: poolLoans?.states || [],
    formattedLoanAmounts: poolLoans?.loanAmounts?.map(amount => formatUnits(amount, USDC_DECIMALS)) || [],
    formattedOutstandingAmounts: poolLoans?.outstandingAmounts?.map(amount => formatUnits(amount, USDC_DECIMALS)) || [],
    isLoading,
    error
  };
}

// Hook to get the number of pools
export function usePoolCount() {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'poolCount',
    chainId: 84532,
  });
  
  return {
    poolCount: data as bigint,
    formattedPoolCount: data ? Number(data) : 0,
    isLoading,
    error
  };
}

// Hook to get information about a specific pool
export function usePoolInfo(poolId: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'getPoolInfo',
    args: [BigInt(poolId)],
    query: {
      enabled: poolId > 0,
    }
  });
  
  // Get pool risk levels
  const { data: riskLevel } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'poolRiskLevels',
    args: [BigInt(poolId)],
    query: {
      enabled: poolId > 0,
    }
  });
  
  // Get pool APR rates
  const { data: aprRate } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'poolAprRates',
    args: [BigInt(poolId)],
    query: {
      enabled: poolId > 0,
    }
  });
  
  const poolInfo = data as { exists: boolean; name: string; totalAssets: bigint; totalShares: bigint } | undefined;
  
  return {
    exists: poolInfo?.exists || false,
    name: poolInfo?.name || '',
    totalAssets: poolInfo?.totalAssets || BigInt(0),
    totalShares: poolInfo?.totalShares || BigInt(0),
    formattedTotalAssets: poolInfo?.totalAssets ? formatUnits(poolInfo.totalAssets, USDC_DECIMALS) : '0',
    riskLevel: riskLevel as number,
    aprRate: aprRate as number,
    aprPercentage: aprRate ? Number(aprRate) / 100 : 0, // BPS is basis points, 1 BPS = 0.01%
    isLoading,
    error
  };
}

// Hook to get user's shares in a specific pool
export function useUserShares(poolId: number, userAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'getUserShares',
    args: [BigInt(poolId), userAddress],
    query: {
      enabled: poolId > 0 && !!userAddress,
    }
  });
  
  return {
    shares: data as bigint,
    isLoading,
    error
  };
}

// Hook to deposit to a pool - Enhanced with connection validation and event firing
export function useDepositToPool(poolId?: number) {
  const addresses = useContractAddresses();
  const { isConnected, address: userAddress } = useAccount();
  
  const { writeContract, data: hash, isPending, error, status } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states and fire events
  useEffect(() => {
    if (isPending) {
      toast.loading('Processing deposit...', { id: 'depositTx' });
    } else if (isConfirming) {
      toast.loading('Confirming transaction...', { id: 'depositTx' });
    } else if (isSuccess && hash) {
      // Clear the loading toast and show success
      toast.dismiss('depositTx');
      toast.success('Deposit successful! Dashboard will update automatically.', { 
        duration: 4000,
        id: 'depositSuccess'
      });
      
      // Fire custom event for dashboard refresh
      if (userAddress) {
        try {
          const depositAmount = localStorage.getItem(`pending_deposit_amount`) || '0.00';
          localStorage.removeItem(`pending_deposit_amount`); // Clean up
          
          const event = new CustomEvent('transactionSuccess', {
            detail: {
              type: 'poolDeposit',
              userAddress,
              hash,
              timestamp: Date.now(),
              amount: depositAmount
            }
          });
          window.dispatchEvent(event);
          console.log('🎉 Pool deposit success event fired for:', userAddress, 'amount:', depositAmount);
        } catch (error) {
          console.error('Error firing deposit success event:', error);
        }
      }
    } else if (error) {
      // Clear any loading toast and show error
      toast.dismiss('depositTx');
      console.error('Pool Deposit Error Details:', error);
      const errorMessage = error.message.includes('Connector not connected') 
        ? 'Wallet connection lost. Please reconnect your wallet and try again.'
        : `Error: ${error.message}`;
      toast.error(errorMessage, { 
        duration: 5000,
        id: 'depositError'
      });
    }
  }, [isPending, isConfirming, isSuccess, error, userAddress, hash]);
  
  return {
    deposit: (depositPoolId: number, amount: string) => {
      // Enhanced connection validation
      if (!isConnected) {
        toast.error('Please connect your wallet first');
        return;
      }
      
      if (!userAddress) {
        toast.error('Wallet address not available. Please reconnect your wallet.');
        return;
      }
      
      if (!addresses.liquidityPoolManagerProxy) {
        toast.error('Pool Manager contract address not found');
        return;
      }
      
      try {
        const targetPoolId = depositPoolId || poolId;
        if (!targetPoolId) {
          toast.error('Pool ID is required');
          return;
        }
        const parsedAmount = parseUnits(amount, USDC_DECIMALS);
        console.log('Pool deposit details:', { 
          poolId: targetPoolId, 
          amount, 
          parsedAmount: parsedAmount.toString(),
          isConnected, 
          userAddress 
        });
        
        writeContract({
          address: addresses.liquidityPoolManagerProxy as `0x${string}`,
          abi: LiquidityPoolManagerABI.abi,
          functionName: 'depositToPool',
          args: [BigInt(targetPoolId), parsedAmount]
        });
      } catch (err) {
        console.error('Error parsing deposit amount:', err);
        toast.error('Invalid amount format');
      }
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    // Add connection state for components to check
    isConnected,
    userAddress
  };
}

// Hook to redeem from a pool - Enhanced with event firing
export function useRedeemFromPool() {
  const addresses = useContractAddresses();
  const { address: userAddress } = useAccount();
  
  const { writeContract, data: hash, isPending, error, status } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states and fire events
  useEffect(() => {
    if (isPending) {
      toast.loading('Processing redemption...', { id: 'redeemTx' });
    } else if (isConfirming) {
      toast.loading('Confirming transaction...', { id: 'redeemTx' });
    } else if (isSuccess && hash) {
      // Clear the loading toast and show success
      toast.dismiss('redeemTx');
      toast.success('Redemption successful! Dashboard will update automatically.', { 
        duration: 4000,
        id: 'redeemSuccess'
      });
      
      // Fire custom event for dashboard refresh
      if (userAddress) {
        try {
          const redeemAmount = localStorage.getItem(`pending_redeem_amount`) || '0.00';
          localStorage.removeItem(`pending_redeem_amount`); // Clean up
          
          const event = new CustomEvent('transactionSuccess', {
            detail: {
              type: 'poolRedeem',
              userAddress,
              hash,
              timestamp: Date.now(),
              amount: redeemAmount
            }
          });
          window.dispatchEvent(event);
          console.log('🎉 Pool redemption success event fired for:', userAddress, 'amount:', redeemAmount);
        } catch (error) {
          console.error('Error firing redeem success event:', error);
        }
      }
    } else if (error) {
      // Clear any loading toast and show error
      toast.dismiss('redeemTx');
      toast.error(`Error: ${error.message}`, { 
        duration: 5000,
        id: 'redeemError'
      });
    }
  }, [isPending, isConfirming, isSuccess, error, userAddress, hash]);
  
  return {
    redeem: (poolId: number, shares: string) => {
      try {
        const parsedShares = BigInt(shares);
        
        writeContract({
          address: addresses.liquidityPoolManagerProxy as `0x${string}`,
          abi: LiquidityPoolManagerABI.abi,
          functionName: 'redeem',
          args: [BigInt(poolId), parsedShares]
        });
      } catch (err) {
        console.error('Error parsing shares amount:', err);
        toast.error('Invalid shares format');
      }
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  };
}

// Hook to get a pool loan record
export function usePoolLoanRecord(poolId: number, projectId: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'getPoolLoanRecord',
    args: [BigInt(poolId), BigInt(projectId)],
    query: {
      enabled: poolId > 0 && projectId > 0,
    }
  });
  
  const loanRecord = data as { 
    projectId: bigint; 
    loanAmount: bigint; 
    isActive: boolean; 
    principalRepaid: bigint;
  } | undefined;
  
  return {
    projectId: loanRecord?.projectId || BigInt(0),
    loanAmount: loanRecord?.loanAmount || BigInt(0),
    isActive: loanRecord?.isActive || false,
    principalRepaid: loanRecord?.principalRepaid || BigInt(0),
    formattedLoanAmount: loanRecord?.loanAmount ? formatUnits(loanRecord.loanAmount, USDC_DECIMALS) : '0',
    formattedPrincipalRepaid: loanRecord?.principalRepaid ? formatUnits(loanRecord.principalRepaid, USDC_DECIMALS) : '0',
    repaymentPercentage: loanRecord?.loanAmount && loanRecord.principalRepaid 
      ? Number(loanRecord.principalRepaid * BigInt(100) / loanRecord.loanAmount) 
      : 0,
    isLoading,
    error
  };
} 