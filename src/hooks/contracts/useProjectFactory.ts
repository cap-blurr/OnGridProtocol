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
      toast.error(`Error: ${error.message}`, { id: 'createProjectTx' });
    }
  }, [isLoading, isConfirming, isSuccess, error]);
  
  return {
    createProject: (params: {
      loanAmountRequested: bigint;
      requestedTenor: bigint;
      metadataCID: string;
    }) => {
      writeContract({
        address: addresses.projectFactoryProxy as `0x${string}`,
        abi: ProjectFactoryABI.abi,
        functionName: 'createProject',
        args: [params.loanAmountRequested, params.requestedTenor, params.metadataCID]
      });
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