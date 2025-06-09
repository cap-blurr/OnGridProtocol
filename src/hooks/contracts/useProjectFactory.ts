import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProjectFactoryABI from '@/contracts/abis/ProjectFactory.json';
import { Log } from 'viem';

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
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
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
        setProjectEvents(prev => [...prev, { type: 'high-value', data: eventData }]);
        toast.success(`High-value project created! Project ID: ${eventData.projectId}`);
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
        const eventData = (logs[0] as any).args;
        setProjectEvents(prev => [...prev, { type: 'low-value', data: eventData }]);
        const statusText = eventData.success ? 'approved and funded' : 'submitted (pending liquidity)';
        toast.success(`Low-value project ${statusText}! Project ID: ${eventData.projectId}`);
      }
    },
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
    } else if (error) {
      // Enhanced error logging
      console.error("useCreateProject - Transaction Error Object:", error);
      console.error("useCreateProject - Transaction Error Stringified:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      const shortMessage = (error as any)?.shortMessage || error.message;
      toast.error(`Error creating project: ${shortMessage}`, { id: 'createProjectTx' });
    }
  }, [isLoading, isConfirming, isSuccess, error]);
  
  return {
    createProject: (params: {
      loanAmountRequested: bigint;
      requestedTenor: bigint;
      metadataCID: string;
    }) => {
      try {
        if (!addresses.projectFactoryProxy) {
          toast.error("Project Factory address not found. Ensure network is supported.");
          console.error("Project Factory address is undefined in useCreateProject.");
          return;
        }
        
        console.log("Sending to contract:", {
          address: addresses.projectFactoryProxy,
          method: 'createProject',
          args: [params]
        });
        
        writeContract({
          address: addresses.projectFactoryProxy as `0x${string}`,
          abi: ProjectFactoryABI.abi,
          functionName: 'createProject',
          args: [params] 
        });
      } catch (err) {
        console.error("Error initiating contract transaction:", err);
        toast.error(`Transaction initiation failed: ${(err as Error).message}`);
      }
    },
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    hash,
    projectEvents
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