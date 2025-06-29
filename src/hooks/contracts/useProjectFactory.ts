import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { useContractAddresses, useIsVerified } from './useDeveloperRegistry';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProjectFactoryABI from '@/contracts/abis/ProjectFactory.json';
import { Log } from 'viem';
import { parseUnits, formatUnits } from 'viem';
import ConstantsABI from '@/contracts/abis/Constants.json';
import { useAccount } from 'wagmi';

// Parameter validation and conversion helpers
interface CreateProjectParams {
  loanAmountRequested: string; // USDC amount as string
  requestedTenor: string; // days as string
  fundingDeadline: string; // seconds as string
  metadataCID: string;
}

interface ContractParams {
  loanAmountRequested: bigint;
  requestedTenor: bigint;
  fundingDeadline: bigint;
  metadataCID: string;
}

function validateAndConvertParams(params: CreateProjectParams): ContractParams {
  // Validate inputs
  if (!params.loanAmountRequested || parseFloat(params.loanAmountRequested) <= 0) {
    throw new Error("Loan amount must be greater than 0");
  }
  
  if (!params.requestedTenor || parseInt(params.requestedTenor) <= 0) {
    throw new Error("Requested tenor must be greater than 0 days");
  }
  
  if (!params.fundingDeadline || parseInt(params.fundingDeadline) <= 0) {
    throw new Error("Funding deadline must be a positive number of seconds");
  }
  
  if (!params.metadataCID || params.metadataCID.trim() === "") {
    throw new Error("Metadata CID is required");
  }

  // Convert to contract-compatible format
  const loanAmountRequested = parseUnits(params.loanAmountRequested, 6); // USDC has 6 decimals
  const requestedTenor = BigInt(parseInt(params.requestedTenor));
  const fundingDeadline = BigInt(parseInt(params.fundingDeadline));
  
  // Validate ranges for Solidity types
  const MAX_UINT48 = BigInt('281474976710655');
  const MAX_UINT32 = BigInt('4294967295');
  
  if (requestedTenor > MAX_UINT48) {
    throw new Error(`Requested tenor (${requestedTenor}) exceeds maximum (${MAX_UINT48} days)`);
  }
  
  if (fundingDeadline > MAX_UINT32) {
    throw new Error(`Funding deadline duration (${fundingDeadline}) exceeds maximum (${MAX_UINT32})`);
  }
  
  // Validate that the deadline duration is reasonable
  if (Number(fundingDeadline) <= 0) {
    throw new Error(`Funding deadline duration must be positive`);
  }
  if (Number(fundingDeadline) > 365 * 24 * 60 * 60) { // Max 1 year
    throw new Error(`Funding deadline duration too long. Max 1 year allowed`);
  }

  // Ensure IPFS CID format
  let metadataCID = params.metadataCID.trim();
  if (!metadataCID.startsWith('ipfs://')) {
    metadataCID = `ipfs://${metadataCID}`;
  }

  return {
    loanAmountRequested,
    requestedTenor,
    fundingDeadline,
    metadataCID
  };
}

// Hook to get all high-value projects
export function useGetAllHighValueProjects() {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    functionName: 'getAllHighValueProjects',
    chainId: 84532,
  });
  
  return {
    projects: data as `0x${string}`[] || [],
    isLoading,
    error,
    refetch
  };
}

// Hook to get project counter
export function useProjectCounter() {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    functionName: 'projectCounter',
    chainId: 84532,
  });
  
  return {
    projectCounter: data as bigint,
    formattedCounter: data ? Number(data) : 0,
    isLoading,
    error
  };
}

// Hook to get user's projects
export function useUserProjects(userAddress?: `0x${string}`, index?: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    functionName: 'userProjects',
    args: userAddress && typeof index === 'number' ? [userAddress, BigInt(index)] : undefined,
    chainId: 84532,
    query: {
      enabled: !!userAddress && typeof index === 'number',
    },
  });
  
  return {
    projectId: data as bigint,
    formattedProjectId: data ? Number(data) : 0,
    isLoading,
    error
  };
}

// Hook to get project states
export function useProjectStates(projectId?: number) {
  const addresses = useContractAddresses();
  
  const { data, isLoading, error } = useReadContract({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    functionName: 'projectStates',
    args: typeof projectId === 'number' ? [BigInt(projectId)] : undefined,
    chainId: 84532,
    query: {
      enabled: typeof projectId === 'number',
    },
  });
  
  return {
    state: data as number,
    isLoading,
    error
  };
}

// Hook to create a new project
export function useCreateProject() {
  const addresses = useContractAddresses();
  const { address: developerAddress } = useAccount();
  const { data: isKycVerified, isLoading: isCheckingKyc } = useIsVerified(developerAddress);
  
  const [projectEvents, setProjectEvents] = useState<Array<{
    type: string;
    data: any;
  }>>([]);
  
  const { 
    writeContract, 
    data: hash, 
    isPending: isLoading, 
    error 
  } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ 
    hash 
  });
  
  // Listen for ProjectCreated event
  useWatchContractEvent({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    eventName: 'ProjectCreated',
    onLogs(logs: Log[]) {
      if (logs.length > 0) {
        const eventData = (logs[0] as any).args;
        toast.success(`High-value project #${eventData.projectId} created!`);
        setProjectEvents(prev => [...prev, { type: 'high-value', data: eventData }]);
      }
    },
  });
  
  // Listen for LowValueProjectSubmitted event
  useWatchContractEvent({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    eventName: 'LowValueProjectSubmitted',
    onLogs(logs: Log[]) {
      if (logs.length > 0) {
        logs.forEach(log => {
          const { projectId, developer, poolId, loanAmount, success } = (log as any).args;
          const eventData = { projectId, developer, poolId, loanAmount, success };
          toast.success(`Low-value project #${eventData.projectId} submitted`);
          setProjectEvents(prev => [...prev, { type: 'low-value', data: eventData }]);
        });
      }
    }
  });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isLoading || isConfirming) {
      toast.loading(
        isLoading ? 'Creating project...' : 'Confirming transaction...',
        { id: 'createProjectTx' }
      );
    } else if (isSuccess) {
      toast.success('Project creation transaction confirmed!', { id: 'createProjectTx' });
    } else if (error || receiptError) {
      const txError = receiptError || error;
      
      if (txError) {
        // Enhanced error message decoding for common contract errors
        let errorMessage = "Error creating project";
        const errorStr = txError.message.toLowerCase();
        
        if (errorStr.includes('insufficient funds') || errorStr.includes('insufficient balance')) {
          errorMessage = "Insufficient USDC balance for transaction";
        } else if (errorStr.includes('allowance') || errorStr.includes('approve')) {
          errorMessage = "USDC approval required or insufficient allowance";
        } else if (errorStr.includes('kyc') || errorStr.includes('not verified')) {
          errorMessage = "Developer KYC verification required";
        } else if (errorStr.includes('threshold') || errorStr.includes('minimum')) {
          errorMessage = "Loan amount below minimum threshold";
        } else if (errorStr.includes('deadline') || errorStr.includes('timestamp')) {
          errorMessage = "Invalid funding deadline";
        } else if (errorStr.includes('metadata') || errorStr.includes('cid')) {
          errorMessage = "Invalid or missing metadata CID";
        } else if ((txError as any)?.shortMessage) {
          errorMessage = (txError as any).shortMessage;
        } else if (txError.message) {
          errorMessage = txError.message;
        }
        
        const prefix = receiptError ? "Transaction reverted" : "Transaction failed";
        toast.error(`${prefix}: ${errorMessage}`, { id: 'createProjectTx' });
      }
    }
  }, [isLoading, isConfirming, isSuccess, error, receiptError]);
  
  const createProject = async (params: CreateProjectParams) => {
    try {
      // Check KYC verification status
      if (!isKycVerified) {
        const kycError = "KYC verification required. Please complete KYC verification before creating a project.";
        toast.error(kycError);
        return;
      }

      const validatedParams = validateAndConvertParams(params);
      
      writeContract({
        address: addresses.projectFactoryProxy as `0x${string}`,
        abi: ProjectFactoryABI.abi,
        functionName: 'createProject',
        args: [validatedParams],
        chainId: 84532,
      });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      toast.error(`Transaction failed: ${errorMessage}`);
    }
  };
  
  return {
    createProject,
    isLoading: isLoading || isConfirming,
    isSuccess,
    projectEvents,
    error: error || receiptError,
    hash,
    isKycVerified,
    isCheckingKyc
  };
}

// Hook for comprehensive project factory data
export function useProjectFactory() {
  const getAllHighValueProjects = useGetAllHighValueProjects;
  const getProjectCounter = useProjectCounter;
  const createProject = useCreateProject;
  
  return {
    getAllHighValueProjects,
    getProjectCounter,
    useUserProjects,
    useProjectStates,
    createProject,
    useCreateProject // Export individual hook for direct use
  };
}

// Hook to get HIGH_VALUE_THRESHOLD from Constants contract
// Note: For now, we'll use a placeholder until Constants contract address is available
export function useHighValueThreshold() {
  // Placeholder - assume 50,000 USDC threshold based on typical DeFi standards
  const PLACEHOLDER_THRESHOLD = 50000;
  
  return {
    threshold: BigInt(PLACEHOLDER_THRESHOLD * 1e6), // Convert to wei-like format
    formattedThreshold: PLACEHOLDER_THRESHOLD.toString(),
    thresholdUSDC: PLACEHOLDER_THRESHOLD,
    isLoading: false,
    error: null
  };
} 