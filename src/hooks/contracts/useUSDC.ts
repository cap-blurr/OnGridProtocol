import { useContractRead, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect } from 'react';
import { formatUnits, parseUnits } from 'ethers';
import toast from 'react-hot-toast';
import { useChainId } from 'wagmi';

// Standard ERC20 ABI (partial, only what we need)
const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// USDC has 6 decimal places
export const USDC_DECIMALS = 6;

// Get USDC balance
export function useUSDCBalance(accountAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  const chainId = useChainId(); // Get current chain ID for logging or explicit use

  console.log(`useUSDCBalance: Fetching balance for account ${accountAddress} on chain ${chainId} using USDC address ${addresses.usdc}`);

  const { data, isLoading, isError, error, refetch } = useContractRead({
    address: addresses.usdc as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: accountAddress ? [accountAddress] : undefined,
    // chainId: chainId, // Optionally pass chainId if your config requires it per call
    query: { 
        enabled: !!accountAddress && !!addresses.usdc,
        retry: 2, // Add a couple of retries
    },
  });

  useEffect(() => {
    if (isError && error) {
      console.error("useUSDCBalance - Error fetching balance:", error);
      // You could toast here too if needed, but the component using the hook usually handles UI for errors
    }
  }, [isError, error]);
  
  const formattedBalance = data 
    ? formatUnits(data as bigint, USDC_DECIMALS)
    : '0';
    
  return {
    balance: data as bigint | undefined,
    formattedBalance,
    isLoading,
    isError,
    error, 
    refetch
  };
}

// Get USDC allowance
export function useUSDCAllowance(ownerAddress?: `0x${string}`, spenderAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, isError, refetch } = useContractRead({
    address: addresses.usdc as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
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
    isError,
    refetch
  };
}

// Approve USDC for a spender
export function useUSDCApprove() {
  const addresses = useContractAddresses();
  
  const { writeContract, data: hash, isPending, error } = useContractWrite();
  
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
      toast.error(`Error: ${error.message}`, { id: 'approveTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    approve: (spender: `0x${string}`, amount: string) => {
      try {
        // For max approval, use MaxUint256 from ethers
        // Or you can just use a specific amount
        const parsedAmount = parseUnits(amount, USDC_DECIMALS);
        writeContract({ 
            address: addresses.usdc as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spender, parsedAmount] 
        });
      } catch (err) {
        console.error('Error parsing approval amount:', err);
        toast.error('Invalid amount format');
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
  } catch (err) {
    console.error('Error checking if approval is needed:', err);
    return true; // Default to needing approval on error
  }
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