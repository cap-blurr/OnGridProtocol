import { useContractRead, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { formatUnits, parseUnits } from 'ethers';
import LiquidityPoolManagerABI from '@/contracts/abis/LiquidityPoolManager.json';
import { USDC_DECIMALS } from './useUSDC';

// Hook to get the number of pools
export function usePoolCount() {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useContractRead({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'poolCount',
  });
  
  return {
    poolCount: data as bigint,
    isLoading,
    error
  };
}

// Hook to get information about a specific pool
export function usePoolInfo(poolId: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useContractRead({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'getPoolInfo',
    args: [BigInt(poolId)],
    query: {
      enabled: poolId > 0,
    }
  });
  
  // Get pool risk levels
  const { data: riskLevel } = useContractRead({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'poolRiskLevels',
    args: [BigInt(poolId)],
    query: {
      enabled: poolId > 0,
    }
  });
  
  // Get pool APR rates
  const { data: aprRate } = useContractRead({
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
  
  const { data, isLoading, error } = useContractRead({
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

// Hook to deposit to a pool
export function useDepositToPool(poolId: number) {
  const addresses = useContractAddresses();
  
  const { writeContract, data: hash, isPending, error, status } = useContractWrite();
  
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
      toast.error(`Error: ${error.message}`, { id: 'depositTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    deposit: (amount: string) => {
      try {
        const parsedAmount = parseUnits(amount, USDC_DECIMALS);
        writeContract({
          address: addresses.liquidityPoolManagerProxy as `0x${string}`,
          abi: LiquidityPoolManagerABI.abi,
          functionName: 'depositToPool',
          args: [BigInt(poolId), parsedAmount]
        });
      } catch (err) {
        console.error('Error parsing deposit amount:', err);
        toast.error('Invalid amount format');
      }
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  };
}

// Hook to redeem from a pool
export function useRedeemFromPool(poolId: number) {
  const addresses = useContractAddresses();
  
  const { writeContract, data: hash, isPending, error, status } = useContractWrite();
  
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
    redeem: (shares: string) => {
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
  
  const { data, isLoading, error } = useContractRead({
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