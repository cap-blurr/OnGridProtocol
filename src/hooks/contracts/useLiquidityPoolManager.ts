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
    chainId: 84532,
    query: {
      enabled: !!userAddress,
    },
  });
  
  const poolInvestments = data as {
    poolIds: bigint[];
    shares: bigint[];
    values: bigint[];
  } | undefined;
  
  // Ensure arrays are properly defined before mapping
  const poolIds = poolInvestments?.poolIds || [];
  const shares = poolInvestments?.shares || [];
  const values = poolInvestments?.values || [];

  return {
    poolIds,
    shares,
    values,
    formattedValues: Array.isArray(values) ? values.map(value => formatUnits(value, USDC_DECIMALS)) : [],
    totalValue: Array.isArray(values) ? values.reduce((sum, value) => sum + value, BigInt(0)) : BigInt(0),
    formattedTotalValue: Array.isArray(values) && values.length > 0 ? 
      formatUnits(values.reduce((sum, value) => sum + value, BigInt(0)), USDC_DECIMALS) : '0',
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

// Hook to deposit to a pool - Enhanced with connection validation
export function useDepositToPool(poolId?: number) {
  const addresses = useContractAddresses();
  const { isConnected, address: userAddress } = useAccount();
  
  const { writeContract, data: hash, isPending, error, status } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Processing deposit...' : 'Confirming transaction...',
        { id: 'depositTx' }
      );
    } else if (isSuccess) {
      toast.success('Deposit successful!', { id: 'depositTx' });
    } else if (error) {
      console.error('Pool Deposit Error Details:', error);
      const errorMessage = error.message.includes('Connector not connected') 
        ? 'Wallet connection lost. Please reconnect your wallet and try again.'
        : `Error: ${error.message}`;
      toast.error(errorMessage, { id: 'depositTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
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

// Hook to redeem from a pool
export function useRedeemFromPool() {
  const addresses = useContractAddresses();
  
  const { writeContract, data: hash, isPending, error, status } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Processing redemption...' : 'Confirming transaction...',
        { id: 'redeemTx' }
      );
    } else if (isSuccess) {
      toast.success('Redemption successful!', { id: 'redeemTx' });
    } else if (error) {
      toast.error(`Error: ${error.message}`, { id: 'redeemTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
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