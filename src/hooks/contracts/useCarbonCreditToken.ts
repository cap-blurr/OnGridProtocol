'use client';

import { useAccount, useBalance } from 'wagmi';
import { useContractRead, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry'; // Assuming this provides all contract addresses
import CarbonCreditTokenABI from '@/contracts/abis/CarbonCreditToken.json';
import { formatUnits, parseUnits } from 'ethers';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const OGCC_DECIMALS = 3; // As per integration.md

// Hook to get general CarbonCreditToken information
export function useOGCCTokenInfo() {
  const addresses = useContractAddresses();
  const tokenAddress = addresses.carbonCreditToken as `0x${string}` | undefined;

  const { data: name, isLoading: isLoadingName } = useContractRead({
    address: tokenAddress,
    abi: CarbonCreditTokenABI.abi,
    functionName: 'name',
    query: { enabled: !!tokenAddress }
  });

  const { data: symbol, isLoading: isLoadingSymbol } = useContractRead({
    address: tokenAddress,
    abi: CarbonCreditTokenABI.abi,
    functionName: 'symbol',
    query: { enabled: !!tokenAddress }
  });

  const { data: decimals, isLoading: isLoadingDecimals } = useContractRead({
    address: tokenAddress,
    abi: CarbonCreditTokenABI.abi,
    functionName: 'decimals',
    query: { enabled: !!tokenAddress }
  });

  const { data: totalSupply, isLoading: isLoadingTotalSupply } = useContractRead({
    address: tokenAddress,
    abi: CarbonCreditTokenABI.abi,
    functionName: 'totalSupply',
    query: { enabled: !!tokenAddress }
  });

  const { data: protocolTreasury, isLoading: isLoadingProtocolTreasury } = useContractRead({
    address: tokenAddress,
    abi: CarbonCreditTokenABI.abi,
    functionName: 'protocolTreasury',
    query: { enabled: !!tokenAddress }
  });

  // Fetch treasury balance separately as it depends on protocolTreasury address
  const { data: treasuryBalanceData, isLoading: isLoadingTreasuryBalance } = useContractRead({
    address: tokenAddress,
    abi: CarbonCreditTokenABI.abi,
    functionName: 'balanceOf',
    args: [protocolTreasury as `0x${string}`],
    query: { enabled: !!tokenAddress && !!protocolTreasury }
  });

  const { data: isPaused, isLoading: isLoadingPaused } = useContractRead({
    address: tokenAddress,
    abi: CarbonCreditTokenABI.abi,
    functionName: 'paused',
    query: { enabled: !!tokenAddress }
  });

  return {
    name: name as string | undefined,
    symbol: symbol as string | undefined,
    decimals: decimals as number | undefined ?? OGCC_DECIMALS, // Fallback to constant if not loaded
    totalSupply: totalSupply as bigint | undefined,
    formattedTotalSupply: totalSupply ? formatUnits(totalSupply as bigint, decimals as number ?? OGCC_DECIMALS) : '0',
    protocolTreasury: protocolTreasury as `0x${string}` | undefined,
    treasuryBalance: treasuryBalanceData as bigint | undefined,
    formattedTreasuryBalance: treasuryBalanceData ? formatUnits(treasuryBalanceData as bigint, decimals as number ?? OGCC_DECIMALS) : '0',
    isPaused: isPaused as boolean | undefined,
    isLoading: isLoadingName || isLoadingSymbol || isLoadingDecimals || isLoadingTotalSupply || isLoadingProtocolTreasury || isLoadingTreasuryBalance || isLoadingPaused,
    tokenAddress
  };
}

// Hook to get user's OGCC balance
export function useOGCCBalance(userAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  const tokenAddress = addresses.carbonCreditToken as `0x${string}` | undefined;
  const { decimals } = useOGCCTokenInfo(); // To get actual decimals for formatting

  // Using wagmi's useBalance for ERC20 is often simpler if decimals are known
  const { data, isLoading, isError, refetch } = useBalance({
    address: userAddress,
    token: tokenAddress,
    query: { enabled: !!userAddress && !!tokenAddress },
  });

  return {
    balance: data?.value,
    formattedBalance: data?.formatted ?? '0',
    decimals: data?.decimals ?? decimals ?? OGCC_DECIMALS,
    symbol: data?.symbol,
    isLoading,
    isError,
    refetch
  };
}

// Hook to approve OGCC for a spender
export function useOGCCApprove() {
  const addresses = useContractAddresses();
  const tokenAddress = addresses.carbonCreditToken as `0x${string}` | undefined;

  const { writeContract, data: hash, isPending, error, status } = useContractWrite();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(isPending ? 'Processing OGCC approval...' : 'Confirming transaction...', { id: 'ogccApproveTx' });
    } else if (isSuccess) {
      toast.success('OGCC Approved Successfully!', { id: 'ogccApproveTx' });
    } else if (error) {
      toast.error(`Approval Error: ${error.message}`, { id: 'ogccApproveTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);

  const approve = (spender: `0x${string}`, amount: string) => {
    if (!tokenAddress) {
        toast.error("Carbon Credit Token address not found.");
        return;
    }
    try {
      const parsedAmount = parseUnits(amount, OGCC_DECIMALS);
      writeContract({
        address: tokenAddress,
        abi: CarbonCreditTokenABI.abi,
        functionName: 'approve',
        args: [spender, parsedAmount]
      });
    } catch (e: any) {
      console.error("Error parsing approval amount:", e);
      toast.error("Invalid amount for approval.");
    }
  };

  return { approve, isLoading: isPending || isConfirming, isSuccess, error, hash };
}

// Hook to get OGCC allowance
export function useOGCCAllowance(ownerAddress?: `0x${string}`, spenderAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  const tokenAddress = addresses.carbonCreditToken as `0x${string}` | undefined;
  const { decimals } = useOGCCTokenInfo();

  const { data, isLoading, isError, refetch } = useContractRead({
    address: tokenAddress,
    abi: CarbonCreditTokenABI.abi,
    functionName: 'allowance',
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    query: { enabled: !!tokenAddress && !!ownerAddress && !!spenderAddress }
  });

  return {
    allowance: data as bigint | undefined,
    formattedAllowance: data ? formatUnits(data as bigint, decimals ?? OGCC_DECIMALS) : '0',
    isLoading,
    isError,
    refetch
  };
} 