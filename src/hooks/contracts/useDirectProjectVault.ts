import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';
import DirectProjectVaultABI from '@/contracts/abis/DirectProjectVault.json';
import { USDC_DECIMALS } from './useUSDC';

// Hook to get vault details
export function useVaultDetails(vaultAddress?: `0x${string}`) {
  const { data: loanAmount, isLoading: isLoadingLoanAmount, error: loanAmountError } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'getLoanAmount',
    query: {
      enabled: !!vaultAddress,
    },
  });
  
  const { data: totalAssetsInvested, isLoading: isLoadingTotalAssets, error: totalAssetsError } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'getTotalAssetsInvested',
    query: {
      enabled: !!vaultAddress,
    },
  });
  
  const { data: isFundingClosed, isLoading: isLoadingFundingClosed, error: fundingClosedError } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'isFundingClosed',
    query: {
      enabled: !!vaultAddress,
    },
  });
  
  const { data: currentAprBps, isLoading: isLoadingApr, error: aprError } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'getCurrentAprBps',
    query: {
      enabled: !!vaultAddress,
    },
  });
  
  const { data: developer, isLoading: isLoadingDeveloper, error: developerError } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'developer',
    query: {
      enabled: !!vaultAddress,
    },
  });
  
  const { data: projectId, isLoading: isLoadingProjectId, error: projectIdError } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'projectId',
    query: {
      enabled: !!vaultAddress,
    },
  });
  
  const { data: loanTenor, isLoading: isLoadingLoanTenor, error: loanTenorError } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'loanTenor',
    query: {
      enabled: !!vaultAddress,
    },
  });
  
  const { data: loanStartTime, isLoading: isLoadingLoanStart, error: loanStartError } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'loanStartTime',
    query: {
      enabled: !!vaultAddress,
    },
  });

  // Check if any of the calls are loading or have errors
  const isLoading = isLoadingLoanAmount || isLoadingTotalAssets || isLoadingFundingClosed || 
                   isLoadingApr || isLoadingDeveloper || isLoadingProjectId || 
                   isLoadingLoanTenor || isLoadingLoanStart;
  
  // Return the first error encountered
  const error = loanAmountError || totalAssetsError || fundingClosedError || 
               aprError || developerError || projectIdError || 
               loanTenorError || loanStartError;

  return {
    loanAmount: loanAmount as bigint,
    totalAssetsInvested: totalAssetsInvested as bigint,
    isFundingClosed: isFundingClosed as boolean,
    currentAprBps: currentAprBps as number,
    developer: developer as string,
    projectId: projectId as bigint,
    loanTenor: loanTenor as bigint,
    loanStartTime: loanStartTime as bigint,
    fundingPercentage: totalAssetsInvested && loanAmount 
      ? Number((totalAssetsInvested as bigint) * BigInt(100) / (loanAmount as bigint))
      : 0,
    formattedLoanAmount: loanAmount ? formatUnits(loanAmount as bigint, USDC_DECIMALS) : '0',
    formattedTotalAssetsInvested: totalAssetsInvested ? formatUnits(totalAssetsInvested as bigint, USDC_DECIMALS) : '0',
    aprPercentage: currentAprBps ? (currentAprBps as number) / 100 : 0, // BPS is basis points, 1 BPS = 0.01%
    tenorDays: loanTenor ? Number(loanTenor as bigint) : 0,
    startTimestamp: loanStartTime ? Number(loanStartTime as bigint) * 1000 : 0, // Convert to milliseconds
    isLoading,
    error
  };
}

// Hook to get investor's shares in the vault
export function useInvestorShares(vaultAddress?: `0x${string}`, investorAddress?: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'investorShares',
    args: investorAddress ? [investorAddress] : undefined,
    query: {
      enabled: !!vaultAddress && !!investorAddress,
    },
  });
  
  return {
    shares: data as bigint,
    isLoading,
    error
  };
}

// Hook to get investor's claimable amounts
export function useClaimableAmounts(vaultAddress?: `0x${string}`, investorAddress?: `0x${string}`) {
  const { data: claimablePrincipal, isLoading: isLoadingPrincipal, refetch: refetchPrincipal } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'claimablePrincipal',
    args: investorAddress ? [investorAddress] : undefined,
    query: {
      enabled: !!vaultAddress && !!investorAddress,
    },
  });
  
  const { data: claimableYield, isLoading: isLoadingYield, refetch: refetchYield } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'claimableYield',
    args: investorAddress ? [investorAddress] : undefined,
    query: {
      enabled: !!vaultAddress && !!investorAddress,
    },
  });
  
  const refetch = () => {
    refetchPrincipal();
    refetchYield();
  };
  
  return {
    claimablePrincipal: claimablePrincipal as bigint,
    claimableYield: claimableYield as bigint,
    formattedClaimablePrincipal: claimablePrincipal ? formatUnits(claimablePrincipal as bigint, USDC_DECIMALS) : '0',
    formattedClaimableYield: claimableYield ? formatUnits(claimableYield as bigint, USDC_DECIMALS) : '0',
    isLoading: isLoadingPrincipal || isLoadingYield,
    refetch
  };
}

// Hook to invest in a vault
export function useInvestInVault(vaultAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Processing investment...' : 'Confirming transaction...',
        { id: 'investTx' }
      );
    } else if (isSuccess) {
      toast.success('Investment successful!', { id: 'investTx' });
    } else if (error) {
      toast.error(`Error: ${error.message}`, { id: 'investTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    invest: (amount: string) => {
      if (!vaultAddress) {
        toast.error('Vault address not available.');
        console.error('useInvestInVault: vaultAddress is undefined');
        return;
      }
      try {
        const parsedAmount = parseUnits(amount, USDC_DECIMALS);
        writeContract({
          address: vaultAddress,
          abi: DirectProjectVaultABI.abi,
          functionName: 'invest',
          args: [parsedAmount]
        });
      } catch (err) {
        console.error('Error parsing investment amount:', err);
        toast.error('Invalid amount format');
      }
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  };
}

// Hook to claim principal from a vault
export function useClaimPrincipal(vaultAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Claiming principal...' : 'Confirming transaction...',
        { id: 'claimPrincipalTx' }
      );
    } else if (isSuccess) {
      toast.success('Principal claimed successfully!', { id: 'claimPrincipalTx' });
    } else if (error) {
      toast.error(`Error: ${error.message}`, { id: 'claimPrincipalTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    claimPrincipal: () => {
      if (!vaultAddress) {
        toast.error('Vault address not available.');
        console.error('useClaimPrincipal: vaultAddress is undefined');
        return;
      }
      writeContract({
        address: vaultAddress,
        abi: DirectProjectVaultABI.abi,
        functionName: 'claimPrincipal',
      });
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  };
}

// Hook to claim yield from a vault
export function useClaimYield(vaultAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Claiming yield...' : 'Confirming transaction...',
        { id: 'claimYieldTx' }
      );
    } else if (isSuccess) {
      toast.success('Yield claimed successfully!', { id: 'claimYieldTx' });
    } else if (error) {
      toast.error(`Error: ${error.message}`, { id: 'claimYieldTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    claimYield: () => {
      if (!vaultAddress) {
        toast.error('Vault address not available.');
        console.error('useClaimYield: vaultAddress is undefined');
        return;
      }
      writeContract({
        address: vaultAddress,
        abi: DirectProjectVaultABI.abi,
        functionName: 'claimYield',
      });
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  };
}

// Hook to redeem (claim both principal and yield) from a vault
export function useRedeem(vaultAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Redeeming investment...' : 'Confirming transaction...',
        { id: 'redeemTx' }
      );
    } else if (isSuccess) {
      toast.success('Investment redeemed successfully!', { id: 'redeemTx' });
    } else if (error) {
      toast.error(`Error: ${error.message}`, { id: 'redeemTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    redeem: () => {
      if (!vaultAddress) {
        toast.error('Vault address not available.');
        console.error('useRedeem: vaultAddress is undefined');
        return;
      }
      writeContract({
        address: vaultAddress,
        abi: DirectProjectVaultABI.abi,
        functionName: 'redeem',
      });
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  };
}

// Hook to get project summary
export function useProjectSummary(vaultAddress?: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'getProjectSummary',
    chainId: 84532,
    query: {
      enabled: !!vaultAddress,
    },
  });
  
  const summary = data as {
    state: number;
    fundingProgress: number;
    timeRemaining: bigint;
    totalReturn: bigint;
  } | undefined;
  
  return {
    state: summary?.state || 0,
    fundingProgress: summary?.fundingProgress || 0,
    fundingProgressPercentage: summary?.fundingProgress ? Number(summary.fundingProgress) / 100 : 0,
    timeRemaining: summary?.timeRemaining || BigInt(0),
    timeRemainingSeconds: summary?.timeRemaining ? Number(summary.timeRemaining) : 0,
    totalReturn: summary?.totalReturn || BigInt(0),
    formattedTotalReturn: summary?.totalReturn ? formatUnits(summary.totalReturn, USDC_DECIMALS) : '0',
    isLoading,
    error
  };
}

// Hook to get investor details
export function useInvestorDetails(vaultAddress?: `0x${string}`, investorAddress?: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    functionName: 'getInvestorDetails',
    args: investorAddress ? [investorAddress] : undefined,
    chainId: 84532,
    query: {
      enabled: !!vaultAddress && !!investorAddress,
    },
  });
  
  const details = data as {
    shares: bigint;
    principalClaimed: bigint;
    interestClaimed: bigint;
    claimablePrincipalAmount: bigint;
    claimableInterestAmount: bigint;
  } | undefined;
  
  return {
    shares: details?.shares || BigInt(0),
    principalClaimed: details?.principalClaimed || BigInt(0),
    interestClaimed: details?.interestClaimed || BigInt(0),
    claimablePrincipalAmount: details?.claimablePrincipalAmount || BigInt(0),
    claimableInterestAmount: details?.claimableInterestAmount || BigInt(0),
    formattedShares: details?.shares ? formatUnits(details.shares, USDC_DECIMALS) : '0',
    formattedPrincipalClaimed: details?.principalClaimed ? formatUnits(details.principalClaimed, USDC_DECIMALS) : '0',
    formattedInterestClaimed: details?.interestClaimed ? formatUnits(details.interestClaimed, USDC_DECIMALS) : '0',
    formattedClaimablePrincipal: details?.claimablePrincipalAmount ? formatUnits(details.claimablePrincipalAmount, USDC_DECIMALS) : '0',
    formattedClaimableInterest: details?.claimableInterestAmount ? formatUnits(details.claimableInterestAmount, USDC_DECIMALS) : '0',
    totalClaimed: details ? details.principalClaimed + details.interestClaimed : BigInt(0),
    totalClaimable: details ? details.claimablePrincipalAmount + details.claimableInterestAmount : BigInt(0),
    isLoading,
    error
  };
} 