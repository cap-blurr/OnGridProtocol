import { useContractWrite, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProjectFactoryABI from '@/contracts/abis/ProjectFactory.json';
import { Log } from 'viem';

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
  } = useContractWrite();
  
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
        setProjectEvents(prev => [...prev, { type: 'high-value', data: (logs[0] as any).args }]);
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
        setProjectEvents(prev => [...prev, { type: 'low-value', data: (logs[0]as any).args }]);
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
      toast.success('Project submitted successfully!', { id: 'createProjectTx' });
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

// Placeholder for ProjectFactory contract interactions
// Functions to implement based on integration.md:
// - createProject(params)
// Event listeners: ProjectCreated, LowValueProjectSubmitted

export const useProjectFactory = () => {
  // Export individual hooks for better code organization
  return {
    useCreateProject
  };
}; 