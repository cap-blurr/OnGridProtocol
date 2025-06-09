import { useReadContract } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { formatUnits } from 'viem';
import FeeRouterABI from '@/contracts/abis/FeeRouter.json';

// Constants
const USDC_DECIMALS = 6;

// Hook to get next payment info for a project
export function useGetNextPaymentInfo(projectId?: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.feeRouterProxy as `0x${string}`,
    abi: FeeRouterABI.abi,
    functionName: 'getNextPaymentInfo',
    args: typeof projectId === 'number' ? [BigInt(projectId)] : undefined,
    chainId: 84532,
    query: {
      enabled: typeof projectId === 'number',
    },
  });
  
  const paymentInfo = data as {
    dueDate: bigint;
    amount: bigint;
  } | undefined;
  
  return {
    dueDate: paymentInfo?.dueDate || BigInt(0),
    amount: paymentInfo?.amount || BigInt(0),
    dueDateTimestamp: paymentInfo?.dueDate ? Number(paymentInfo.dueDate) * 1000 : 0, // Convert to milliseconds
    formattedAmount: paymentInfo?.amount ? formatUnits(paymentInfo.amount, USDC_DECIMALS) : '0',
    isDue: paymentInfo?.dueDate ? Date.now() >= Number(paymentInfo.dueDate) * 1000 : false,
    daysUntilDue: paymentInfo?.dueDate ? Math.max(0, Math.ceil((Number(paymentInfo.dueDate) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : 0,
    isLoading,
    error
  };
}

// Hook to get fee rate for a project
export function useGetFeeRate(projectId?: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.feeRouterProxy as `0x${string}`,
    abi: FeeRouterABI.abi,
    functionName: 'getFeeRate',
    args: typeof projectId === 'number' ? [BigInt(projectId)] : undefined,
    chainId: 84532,
    query: {
      enabled: typeof projectId === 'number',
    },
  });
  
  return {
    feeRate: data as bigint,
    feeRateBps: data ? Number(data) : 0,
    feeRatePercentage: data ? Number(data) / 100 : 0, // Convert from basis points to percentage
    isLoading,
    error
  };
}

// Hook to get total fees collected for a project
export function useGetTotalFeesCollected(projectId?: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.feeRouterProxy as `0x${string}`,
    abi: FeeRouterABI.abi,
    functionName: 'getTotalFeesCollected',
    args: typeof projectId === 'number' ? [BigInt(projectId)] : undefined,
    chainId: 84532,
    query: {
      enabled: typeof projectId === 'number',
    },
  });
  
  return {
    totalFeesCollected: data as bigint,
    formattedTotalFeesCollected: data ? formatUnits(data as bigint, USDC_DECIMALS) : '0',
    isLoading,
    error
  };
}

// Hook to get fee breakdown for an amount
export function useCalculateFeeBreakdown(projectId?: number, amount?: string) {
  const { feeRatePercentage } = useGetFeeRate(projectId);
  
  if (!amount || !feeRatePercentage) {
    return {
      grossAmount: '0',
      feeAmount: '0',
      netAmount: '0',
      feePercentage: 0
    };
  }
  
  const grossAmount = parseFloat(amount);
  const feeAmount = grossAmount * (feeRatePercentage / 100);
  const netAmount = grossAmount - feeAmount;
  
  return {
    grossAmount: grossAmount.toFixed(6),
    feeAmount: feeAmount.toFixed(6),
    netAmount: netAmount.toFixed(6),
    feePercentage: feeRatePercentage
  };
}

// Comprehensive hook for fee router functionality
export function useFeeRouter() {
  return {
    useGetNextPaymentInfo,
    useGetFeeRate,
    useGetTotalFeesCollected,
    useCalculateFeeBreakdown
  };
} 