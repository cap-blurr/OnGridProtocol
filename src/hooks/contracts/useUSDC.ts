import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';
import { useChainId } from 'wagmi';

// Import MockUSDC ABI for testnet
import MockUSDCABI from '@/contracts/abis/MockUSDC.json';

// Use MockUSDC ABI for contract interactions
const USDC_ABI = MockUSDCABI.abi;

// USDC has 6 decimal places
export const USDC_DECIMALS = 6;

// Get USDC balance
export function useUSDCBalance(accountAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  const chainId = useChainId();

  console.log(`useUSDCBalance: Fetching balance for account ${accountAddress} on chain ${chainId} using USDC address ${addresses.usdc}`);

  const { data, isLoading, error, refetch } = useReadContract({
    address: addresses.usdc as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: accountAddress ? [accountAddress] : undefined,
    chainId: 84532, // Base Sepolia
    query: { 
        enabled: !!accountAddress && !!addresses.usdc,
      retry: 2,
    },
  });

  useEffect(() => {
    if (error) {
      console.error("useUSDCBalance - Error fetching balance:", error);
    }
  }, [error]);
  
  const formattedBalance = data 
    ? formatUnits(data as bigint, USDC_DECIMALS)
    : '0';
    
  return {
    balance: data as bigint | undefined,
    formattedBalance,
    isLoading,
    error, 
    refetch
  };
}

// Get USDC allowance
export function useUSDCAllowance(ownerAddress?: `0x${string}`, spenderAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: addresses.usdc as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    chainId: 84532, // Base Sepolia
    query: {
        enabled: !!ownerAddress && !!spenderAddress
    }
  });
  
  const formattedAllowance = data 
    ? formatUnits(data as bigint, USDC_DECIMALS)
    : '0';
    
  return {
    allowance: data as bigint | undefined,
    formattedAllowance,
    isLoading,
    error,
    refetch
  };
}

// Approve USDC for a spender
export function useUSDCApprove() {
  const addresses = useContractAddresses();
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Approving USDC...' : 'Confirming transaction...',
        { id: 'approveTx' }
      );
    } else if (isSuccess) {
      toast.success('USDC approved successfully!', { id: 'approveTx' });
    } else if (error) {
      toast.error(`Approval Error: ${error.message}`, { id: 'approveTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    approve: (spender: `0x${string}`, amount: string) => {
      try {
        const parsedAmount = parseUnits(amount, USDC_DECIMALS);
        console.log(`Approving ${amount} USDC (${parsedAmount.toString()}) for spender: ${spender}`);
        writeContract({ 
            address: addresses.usdc as `0x${string}`,
          abi: USDC_ABI,
            functionName: 'approve',
            args: [spender, parsedAmount] 
        });
      } catch (err) {
        console.error('Error parsing approval amount:', err);
        toast.error('Invalid amount format');
      }
    },
    approveMax: (spender: `0x${string}`) => {
      try {
        // Use maximum uint256 for unlimited approval
        const maxAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        console.log(`Approving MAX USDC for spender: ${spender}`);
        writeContract({ 
          address: addresses.usdc as `0x${string}`,
          abi: USDC_ABI,
          functionName: 'approve',
          args: [spender, maxAmount] 
        });
      } catch (err) {
        console.error('Error with max approval:', err);
        toast.error('Error with approval transaction');
      }
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash
  };
}

// Helper to check if approval is needed
export function isApprovalNeeded(
  currentAllowance: bigint | undefined, 
  requiredAmount: string
): boolean {
  if (!currentAllowance) return true;
  
  try {
    const requiredAmountBigInt = parseUnits(requiredAmount, USDC_DECIMALS);
    return currentAllowance < requiredAmountBigInt;
  } catch (error) {
    console.error('Error checking approval:', error);
    return true; // Default to needing approval if we can't parse
  }
}

// Helper to format USDC amount
export function formatUSDCAmount(amount: bigint | undefined): string {
  if (!amount) return '0.00';
  return formatUnits(amount, USDC_DECIMALS);
}

// Helper to parse USDC amount
export function parseUSDCAmount(amount: string): bigint {
  return parseUnits(amount, USDC_DECIMALS);
}

// Comprehensive USDC hook that combines all functionality
export function useUSDC(userAddress?: `0x${string}`, spenderAddress?: `0x${string}`) {
  const balance = useUSDCBalance(userAddress);
  const allowance = useUSDCAllowance(userAddress, spenderAddress);
  const approve = useUSDCApprove();
  
  return {
    ...balance,
    ...allowance,
    ...approve,
    isApprovalNeeded: (amount: string) => 
      isApprovalNeeded(allowance.allowance, amount),
    formatAmount: formatUSDCAmount,
    parseAmount: parseUSDCAmount,
  };
}

// Placeholder for USDC token contract interactions
// Functions to implement based on integration.md:
// - approve(spenderAddress, amount)
// - getAllowance(ownerAddress, spenderAddress)
// - getBalance(address)

export const useUsdc = () => {
  // TODO: Implement hook logic using wagmi
  return {};
}; 