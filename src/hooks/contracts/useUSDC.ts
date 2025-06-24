import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';
import { useChainId, useAccount } from 'wagmi';

// Import MockUSDC ABI for testnet
import MockUSDCABI from '@/contracts/abis/MockUSDC.json';

// Use MockUSDC ABI for contract interactions
const USDC_ABI = MockUSDCABI.abi;

// USDC has 6 decimal places
export const USDC_DECIMALS = 6;

// Get USDC balance with automatic refresh on transaction events
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
      enabled: !!accountAddress,
      // More aggressive polling for balance updates
      refetchInterval: 15000, // 15 seconds
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  });

  useEffect(() => {
    if (error) {
      console.error("useUSDCBalance - Error fetching balance:", error);
    }
  }, [error]);

  // Listen for transaction success events to refresh balance
  useEffect(() => {
    if (!accountAddress) return;

    const handleTransactionSuccess = (event: any) => {
      if (event.detail && event.detail.userAddress === accountAddress) {
        console.log('💰 USDC balance update triggered by transaction');
        // Multiple refresh attempts with different delays
        setTimeout(() => refetch(), 500);   // Quick refresh
        setTimeout(() => refetch(), 2000);  // Medium delay
        setTimeout(() => refetch(), 5000);  // Longer delay
        setTimeout(() => refetch(), 10000); // Final refresh
      }
    };

    window.addEventListener('transactionSuccess', handleTransactionSuccess);
    
    return () => {
      window.removeEventListener('transactionSuccess', handleTransactionSuccess);
    };
  }, [accountAddress, refetch]);
  
  const formattedBalance = data 
    ? formatUnits(data as bigint, USDC_DECIMALS)
    : '0.00';
    
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

// Approve USDC for a spender - Enhanced with connection validation
export function useUSDCApprove() {
  const addresses = useContractAddresses();
  const { isConnected, address: userAddress } = useAccount();
  
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
      
      // Fire custom event for dashboard refresh
      if (userAddress) {
        const event = new CustomEvent('transactionSuccess', {
          detail: {
            type: 'usdcApproval',
            userAddress,
            hash,
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(event);
        console.log('🎉 USDC approval success event fired for:', userAddress);
      }
    } else if (error) {
      console.error('USDC Approval Error Details:', error);
      const errorMessage = error.message.includes('Connector not connected') 
        ? 'Wallet connection lost. Please reconnect your wallet and try again.'
        : `Approval Error: ${error.message}`;
      toast.error(errorMessage, { id: 'approveTx' });
    }
  }, [isPending, isConfirming, isSuccess, error, userAddress, hash]);
  
  return {
    approve: (spender: `0x${string}`, amount: string) => {
      // Enhanced connection validation
      if (!isConnected) {
        toast.error('Please connect your wallet first');
        return;
      }
      
      if (!userAddress) {
        toast.error('Wallet address not available. Please reconnect your wallet.');
        return;
      }
      
      if (!addresses.usdc) {
        toast.error('USDC contract address not found');
        return;
      }
      
      try {
        const parsedAmount = parseUnits(amount, USDC_DECIMALS);
        console.log(`Approving ${amount} USDC (${parsedAmount.toString()}) for spender: ${spender}`);
        console.log('Current connection state:', { isConnected, userAddress });
        
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
      // Enhanced connection validation
      if (!isConnected) {
        toast.error('Please connect your wallet first');
        return;
      }
      
      if (!userAddress) {
        toast.error('Wallet address not available. Please reconnect your wallet.');
        return;
      }
      
      try {
        // Use maximum uint256 for unlimited approval
        const maxAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        console.log(`Approving MAX USDC for spender: ${spender}`);
        console.log('Current connection state:', { isConnected, userAddress });
        
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
    hash,
    // Add connection state for components to check
    isConnected,
    userAddress
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