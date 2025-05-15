'use client';

import { useAccount } from 'wagmi';
import { useContractRead, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry'; // Assuming this provides all contract addresses
import CarbonCreditExchangeABI from '@/contracts/abis/CarbonCreditExchange.json';
import { formatUnits, parseUnits } from 'ethers';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { OGCC_DECIMALS } from './useCarbonCreditToken'; // For OGCC amounts
import { USDC_DECIMALS } from './useUSDC'; // For USDC amounts

// Hook to get CarbonCreditExchange parameters and stats
export function useExchangeInfo() {
  const addresses = useContractAddresses();
  const exchangeAddress = addresses.carbonCreditExchange as `0x${string}` | undefined;

  const { data: exchangeRate, isLoading: isLoadingRate } = useContractRead({
    address: exchangeAddress,
    abi: CarbonCreditExchangeABI.abi,
    functionName: 'exchangeRate',
    query: { enabled: !!exchangeAddress }
  });

  const { data: protocolFeePercentage, isLoading: isLoadingFee } = useContractRead({
    address: exchangeAddress,
    abi: CarbonCreditExchangeABI.abi,
    functionName: 'protocolFeePercentage',
    query: { enabled: !!exchangeAddress }
  });

  const { data: rewardDistributorPercentage, isLoading: isLoadingRewardFee } = useContractRead({
    address: exchangeAddress,
    abi: CarbonCreditExchangeABI.abi,
    functionName: 'rewardDistributorPercentage',
    query: { enabled: !!exchangeAddress }
  });

  const { data: usdcTokenAddress, isLoading: isLoadingUsdc } = useContractRead({
    address: exchangeAddress,
    abi: CarbonCreditExchangeABI.abi,
    functionName: 'usdcToken',
    query: { enabled: !!exchangeAddress }
  });

  const { data: isExchangeEnabled, isLoading: isLoadingEnabled } = useContractRead({
    address: exchangeAddress,
    abi: CarbonCreditExchangeABI.abi,
    functionName: 'exchangeEnabled',
    query: { enabled: !!exchangeAddress }
  });

  const { data: isPaused, isLoading: isLoadingPaused } = useContractRead({
    address: exchangeAddress,
    abi: CarbonCreditExchangeABI.abi,
    functionName: 'paused',
    query: { enabled: !!exchangeAddress }
  });

  // Statistics
  const { data: totalCreditsExchanged, isLoading: isLoadingCreditsExchanged } = useContractRead({
    address: exchangeAddress, abi: CarbonCreditExchangeABI.abi, functionName: 'totalCreditsExchanged', query: { enabled: !!exchangeAddress }
  });
  const { data: totalUsdcCollected, isLoading: isLoadingUsdcCollected } = useContractRead({
    address: exchangeAddress, abi: CarbonCreditExchangeABI.abi, functionName: 'totalUsdcCollected', query: { enabled: !!exchangeAddress }
  });
  const { data: totalProtocolFees, isLoading: isLoadingTotalFees } = useContractRead({
    address: exchangeAddress, abi: CarbonCreditExchangeABI.abi, functionName: 'totalProtocolFees', query: { enabled: !!exchangeAddress }
  });
  const { data: totalRewardsFunded, isLoading: isLoadingRewardsFunded } = useContractRead({
    address: exchangeAddress, abi: CarbonCreditExchangeABI.abi, functionName: 'totalRewardsFunded', query: { enabled: !!exchangeAddress }
  });

  return {
    exchangeAddress,
    exchangeRate: exchangeRate as bigint | undefined, // OGCC per 1 USDC (or other unit based on contract)
    // Assuming exchangeRate might represent USDC per smallest unit of OGCC, or vice-versa.
    // UI will need to interpret this carefully for display.
    protocolFeeBps: protocolFeePercentage as bigint | undefined, // Basis points (divide by 10000 for percentage)
    rewardDistributorFeeBps: rewardDistributorPercentage as bigint | undefined, // Basis points
    usdcTokenAddress: usdcTokenAddress as `0x${string}` | undefined,
    isExchangeEnabled: isExchangeEnabled as boolean | undefined,
    isPaused: isPaused as boolean | undefined,
    // Stats (formatted)
    formattedTotalCreditsExchanged: totalCreditsExchanged ? formatUnits(totalCreditsExchanged as bigint, OGCC_DECIMALS) : '0',
    formattedTotalUsdcCollected: totalUsdcCollected ? formatUnits(totalUsdcCollected as bigint, USDC_DECIMALS) : '0',
    formattedTotalProtocolFees: totalProtocolFees ? formatUnits(totalProtocolFees as bigint, USDC_DECIMALS) : '0',
    formattedTotalRewardsFunded: totalRewardsFunded ? formatUnits(totalRewardsFunded as bigint, USDC_DECIMALS) : '0',
    isLoading: isLoadingRate || isLoadingFee || isLoadingRewardFee || isLoadingUsdc || isLoadingEnabled || isLoadingPaused || isLoadingCreditsExchanged || isLoadingUsdcCollected || isLoadingTotalFees || isLoadingRewardsFunded,
  };
}

// Hook to exchange OGCC for USDC
export function useExchangeOGCCToUSDC() {
  const addresses = useContractAddresses();
  const exchangeAddress = addresses.carbonCreditExchange as `0x${string}` | undefined;

  const { writeContract, data: hash, isPending, error, status } = useContractWrite();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(isPending ? 'Processing OGCC exchange...' : 'Confirming transaction...', { id: 'ogccExchangeTx' });
    } else if (isSuccess) {
      toast.success('OGCC Exchanged for USDC Successfully!', { id: 'ogccExchangeTx' });
    } else if (error) {
      toast.error(`Exchange Error: ${error.message}`, { id: 'ogccExchangeTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);

  const exchangeCredits = (ogccAmount: string) => {
    if (!exchangeAddress) {
        toast.error("Carbon Credit Exchange address not found.");
        return;
    }
    try {
      const parsedAmount = parseUnits(ogccAmount, OGCC_DECIMALS);
      writeContract({
        address: exchangeAddress,
        abi: CarbonCreditExchangeABI.abi,
        functionName: 'exchangeCreditsForUSDC',
        args: [parsedAmount]
      });
    } catch (e: any) {
      console.error("Error parsing OGCC amount for exchange:", e);
      toast.error("Invalid OGCC amount for exchange.");
    }
  };

  return { exchangeCredits, isLoading: isPending || isConfirming, isSuccess, error, hash };
} 