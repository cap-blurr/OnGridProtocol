import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';
import RepaymentRouterABI from '@/contracts/abis/RepaymentRouter.json';
import { Log } from 'viem';

// Constants
const USDC_DECIMALS = 6;

// Hook to get funding source for a project
export function useGetFundingSource(projectId?: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.repaymentRouter as `0x${string}`,
    abi: RepaymentRouterABI.abi,
    functionName: 'getFundingSource',
    args: typeof projectId === 'number' ? [BigInt(projectId)] : undefined,
    chainId: 84532,
    query: {
      enabled: typeof projectId === 'number',
    },
  });
  
  return {
    fundingSource: data as `0x${string}`,
    isLoading,
    error
  };
}

// Hook to get pool ID for a project
export function useGetPoolId(projectId?: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.repaymentRouter as `0x${string}`,
    abi: RepaymentRouterABI.abi,
    functionName: 'getPoolId',
    args: typeof projectId === 'number' ? [BigInt(projectId)] : undefined,
    chainId: 84532,
    query: {
      enabled: typeof projectId === 'number',
    },
  });
  
  return {
    poolId: data as bigint,
    formattedPoolId: data ? Number(data) : 0,
    isLoading,
    error
  };
}

// Hook to get project payment summary
export function useGetProjectPaymentSummary(projectId?: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.repaymentRouter as `0x${string}`,
    abi: RepaymentRouterABI.abi,
    functionName: 'getProjectPaymentSummary',
    args: typeof projectId === 'number' ? [BigInt(projectId)] : undefined,
    chainId: 84532,
    query: {
      enabled: typeof projectId === 'number',
    },
  });
  
  const summary = data as {
    totalRepaid: bigint;
    lastPayment: bigint;
    paymentCount: bigint;
  } | undefined;
  
  return {
    totalRepaid: summary?.totalRepaid || BigInt(0),
    lastPayment: summary?.lastPayment || BigInt(0),
    paymentCount: summary?.paymentCount || BigInt(0),
    formattedTotalRepaid: summary?.totalRepaid ? formatUnits(summary.totalRepaid, USDC_DECIMALS) : '0',
    lastPaymentTimestamp: summary?.lastPayment ? Number(summary.lastPayment) * 1000 : 0, // Convert to milliseconds
    formattedPaymentCount: summary?.paymentCount ? Number(summary.paymentCount) : 0,
    isLoading,
    error
  };
}

// Hook to make a repayment
export function useRepay() {
  const addresses = useContractAddresses();
  const [repaymentEvents, setRepaymentEvents] = useState<Array<{
    projectId: bigint;
    payer: string;
    totalAmountRepaid: bigint;
    feeAmount: bigint;
    principalAmount: bigint;
    interestAmount: bigint;
    fundingSource: string;
  }>>([]);
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Listen for RepaymentRouted events
  useWatchContractEvent({
    address: addresses.repaymentRouter as `0x${string}`,
    abi: RepaymentRouterABI.abi,
    eventName: 'RepaymentRouted',
    onLogs(logs: Log[]) {
      if (logs.length > 0) {
        const eventData = (logs[0] as any).args;
        setRepaymentEvents(prev => [...prev, eventData]);
        toast.success(`Repayment processed! Amount: ${formatUnits(eventData.totalAmountRepaid, USDC_DECIMALS)} USDC`);
      }
    },
  });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Processing repayment...' : 'Confirming transaction...',
        { id: 'repaymentTx' }
      );
    } else if (isSuccess) {
      toast.success('Repayment transaction confirmed!', { id: 'repaymentTx' });
    } else if (error) {
      console.error("Repayment Error:", error);
      const shortMessage = (error as any)?.shortMessage || error.message;
      toast.error(`Error processing repayment: ${shortMessage}`, { id: 'repaymentTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    repay: (projectId: number, amount: string) => {
      try {
        if (!addresses.repaymentRouter) {
          toast.error("Repayment Router address not found.");
          return;
        }
        
        const parsedAmount = parseUnits(amount, USDC_DECIMALS);
        writeContract({
          address: addresses.repaymentRouter as `0x${string}`,
          abi: RepaymentRouterABI.abi,
          functionName: 'repay',
          args: [BigInt(projectId), parsedAmount]
        });
      } catch (err) {
        console.error('Error parsing repayment amount:', err);
        toast.error('Invalid amount format');
      }
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    repaymentEvents
  };
}

// Comprehensive hook for repayment router functionality
export function useRepaymentRouter() {
  return {
    useGetFundingSource,
    useGetPoolId,
    useGetProjectPaymentSummary,
    useRepay
  };
} 