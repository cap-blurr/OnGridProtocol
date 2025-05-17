import { useContractRead, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { getAddresses } from '@/contracts/addresses';
import DeveloperRegistryJSON from '@/contracts/abis/DeveloperRegistry.json';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const DeveloperRegistryABI = DeveloperRegistryJSON.abi;

// Hook to get chain-appropriate addresses
export function useContractAddresses() {
  // Using Base or Base Sepolia networks
  const chainId = 84532; // Default to Base Sepolia for development
  return getAddresses(chainId);
}

// Get developer info
export function useGetDeveloperInfo(developerAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  
  return useContractRead({
    address: addresses.developerRegistryProxy as `0x${string}`,
    abi: DeveloperRegistryABI,
    functionName: 'getDeveloperInfo',
    args: developerAddress ? [developerAddress] : undefined,
    chainId: 84532,
    query: {
      enabled: !!developerAddress,
    },
  });
}

// Check if developer is verified
export function useIsVerified(developerAddress?: `0x${string}`) {
  const addresses = useContractAddresses();
  
  return useContractRead({
    address: addresses.developerRegistryProxy as `0x${string}`,
    abi: DeveloperRegistryABI,
    functionName: 'isVerified',
    args: developerAddress ? [developerAddress] : undefined,
    chainId: 84532,
    query: {
      enabled: !!developerAddress,
    },
  });
}

// Submit KYC for a developer
export function useSubmitKYC() {
  const addresses = useContractAddresses();
  
  const { writeContract, isPending, data: hash, error } = useContractWrite();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(isPending ? 'Submitting KYC...' : 'Confirming transaction...', { id: 'kycTx' });
    } else if (isSuccess) {
      toast.success('KYC submitted successfully!', { id: 'kycTx' });
    } else if (error) {
      toast.error(`Error: ${error.message}`, { id: 'kycTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    submitKYC: (developer: `0x${string}`, kycHash: `0x${string}`, kycDataLocation: string) => {
      writeContract({
        address: addresses.developerRegistryProxy as `0x${string}`,
        abi: DeveloperRegistryABI,
        functionName: 'submitKYC',
        args: [developer, kycHash, kycDataLocation]
      });
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  };
}

// Set verification status (admin only)
export function useSetVerifiedStatus() {
  const addresses = useContractAddresses();
  
  const { writeContract, isPending, data: hash, error } = useContractWrite();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });
  
  useEffect(() => {
    if (isSuccess) {
      toast.success('Verification status updated!');
    } else if (error) {
      toast.error(`Error: ${error.message}`);
    }
  }, [isSuccess, error]);
  
  return {
    setVerifiedStatus: (developer: `0x${string}`, verified: boolean) => {
      writeContract({
        address: addresses.developerRegistryProxy as `0x${string}`,
        abi: DeveloperRegistryABI,
        functionName: 'setVerifiedStatus',
        args: [developer, verified]
      });
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  };
}

// Placeholder for DeveloperRegistry contract interactions
// Functions to implement based on integration.md:
// - isVerified(developerAddress)
// - submitKYC (admin action, clarify if frontend triggers for developer)
// - getDeveloperInfo(developerAddress)
// Event listeners: KYCStatusChanged, DeveloperFundedCounterIncremented

export const useDeveloperRegistry = () => {
  // TODO: Implement hook logic using wagmi (useAccount, useReadContract, useWriteContract, etc.)
  return {};
}; 