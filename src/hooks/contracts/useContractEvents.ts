import { useWatchContractEvent } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatUnits } from 'viem';

// ABIs
import ProjectFactoryABI from '@/contracts/abis/ProjectFactory.json';
import LiquidityPoolManagerABI from '@/contracts/abis/LiquidityPoolManager.json';
import DirectProjectVaultABI from '@/contracts/abis/DirectProjectVault.json';
import RepaymentRouterABI from '@/contracts/abis/RepaymentRouter.json';
import DeveloperRegistryABI from '@/contracts/abis/DeveloperRegistry.json';

// Event types
export interface ContractEvent {
  id: string;
  type: string;
  contractName: string;
  blockNumber: bigint;
  transactionHash: string;
  timestamp: number;
  data: any;
}

// Hook to monitor ProjectFactory events
export function useProjectFactoryEvents() {
  const addresses = useContractAddresses();
  const [events, setEvents] = useState<ContractEvent[]>([]);

  // Watch for ProjectCreated events
  useWatchContractEvent({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    eventName: 'ProjectCreated',
    poll: true,
    enabled: !!addresses.projectFactoryProxy,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'ProjectCreated',
          contractName: 'ProjectFactory',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
        
        toast.success(
          `New high-value project created! Project ID: ${log.args?.projectId ?? ''}`,
          { duration: 5000 }
        );
      });
    },
  });

  // Watch for LowValueProjectSubmitted events
  useWatchContractEvent({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    eventName: 'LowValueProjectSubmitted',
    poll: true,
    enabled: !!addresses.projectFactoryProxy,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'LowValueProjectSubmitted',
          contractName: 'ProjectFactory',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
        
        if (log.args?.success) {
          toast.success(
            `Low-value project funded! Project ID: ${log.args?.projectId ?? ''}`,
            { duration: 5000 }
          );
        } else {
          toast(
            `Project submitted to pool but funding pending. Project ID: ${log.args?.projectId ?? ''}`,
            { duration: 5000, icon: '🔔' }
          );
        }
      });
    },
  });

  return { events };
}

// Hook to monitor LiquidityPoolManager events
export function useLiquidityPoolEvents() {
  const addresses = useContractAddresses();
  const [events, setEvents] = useState<ContractEvent[]>([]);

  // Watch for PoolDeposit events
  useWatchContractEvent({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    eventName: 'PoolDeposit',
    poll: true,
    enabled: !!addresses.liquidityPoolManagerProxy,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'PoolDeposit',
          contractName: 'LiquidityPoolManager',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
      });
    },
  });

  // Watch for PoolRedeem events
  useWatchContractEvent({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    eventName: 'PoolRedeem',
    poll: true,
    enabled: !!addresses.liquidityPoolManagerProxy,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'PoolRedeem',
          contractName: 'LiquidityPoolManager',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
      });
    },
  });

  return { events };
}

// Hook to monitor RepaymentRouter events
export function useRepaymentEvents() {
  const addresses = useContractAddresses();
  const [events, setEvents] = useState<ContractEvent[]>([]);

  // Watch for RepaymentRouted events
  useWatchContractEvent({
    address: addresses.repaymentRouter as `0x${string}`,
    abi: RepaymentRouterABI.abi,
    eventName: 'RepaymentRouted',
    poll: true,
    enabled: !!addresses.repaymentRouter,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'RepaymentRouted',
          contractName: 'RepaymentRouter',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
        
        toast.success(
          `Repayment processed for Project ${log.args?.projectId ?? ''}!`,
          { duration: 5000 }
        );
      });
    },
  });

  return { events };
}

// Hook to monitor DeveloperRegistry events
export function useDeveloperRegistryEvents() {
  const addresses = useContractAddresses();
  const [events, setEvents] = useState<ContractEvent[]>([]);

  // Watch for KYCStatusChanged events
  useWatchContractEvent({
    address: addresses.developerRegistryProxy as `0x${string}`,
    abi: DeveloperRegistryABI.abi,
    eventName: 'KYCStatusChanged',
    poll: true,
    enabled: !!addresses.developerRegistryProxy,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'KYCStatusChanged',
          contractName: 'DeveloperRegistry',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
        
        if (log.args?.isVerified) {
          toast.success(
            `KYC verification approved for developer!`,
            { duration: 5000 }
          );
        } else {
          toast(
            `KYC verification status updated`,
            { duration: 3000, icon: 'ℹ️' }
          );
        }
      });
    },
  });

  return { events };
}

// Hook to monitor specific DirectProjectVault events
export function useDirectProjectVaultEvents(vaultAddress?: `0x${string}`) {
  const [events, setEvents] = useState<ContractEvent[]>([]);

  // Watch for Invested events
  useWatchContractEvent({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    eventName: 'Invested',
    poll: true,
    enabled: !!vaultAddress,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'Invested',
          contractName: 'DirectProjectVault',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
      });
    },
  });

  // Watch for FundingClosed events
  useWatchContractEvent({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    eventName: 'FundingClosed',
    poll: true,
    enabled: !!vaultAddress,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'FundingClosed',
          contractName: 'DirectProjectVault',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
        
        const amount = log.args?.totalAssetsInvested ? formatUnits(log.args.totalAssetsInvested as bigint, 6) : '0.00';
        toast.success(
          `Project funding completed! Total raised: $${amount}`,
          { duration: 5000 }
        );
      });
    },
  });

  // Watch for PrincipalClaimed events
  useWatchContractEvent({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    eventName: 'PrincipalClaimed',
    poll: true,
    enabled: !!vaultAddress,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'PrincipalClaimed',
          contractName: 'DirectProjectVault',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
      });
    },
  });

  // Watch for YieldClaimed events
  useWatchContractEvent({
    address: vaultAddress,
    abi: DirectProjectVaultABI.abi,
    eventName: 'YieldClaimed',
    poll: true,
    enabled: !!vaultAddress,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (!log.args) return;
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'YieldClaimed',
          contractName: 'DirectProjectVault',
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: Date.now(),
          data: log.args,
        };
        
        setEvents(prev => [event, ...prev.slice(0, 49)]);
      });
    },
  });

  return { events };
}

// Main hook that combines all events
export function useAllContractEvents() {
  const projectFactoryEvents = useProjectFactoryEvents();
  const liquidityPoolEvents = useLiquidityPoolEvents();
  const repaymentEvents = useRepaymentEvents();
  const developerRegistryEvents = useDeveloperRegistryEvents();

  const allEvents = [
    ...projectFactoryEvents.events,
    ...liquidityPoolEvents.events,
    ...repaymentEvents.events,
    ...developerRegistryEvents.events,
  ].sort((a, b) => b.timestamp - a.timestamp);

  return {
    events: allEvents,
    projectFactoryEvents: projectFactoryEvents.events,
    liquidityPoolEvents: liquidityPoolEvents.events,
    repaymentEvents: repaymentEvents.events,
    developerRegistryEvents: developerRegistryEvents.events,
  };
}

// Hook for user-specific event filtering
export function useUserEvents(userAddress?: `0x${string}`) {
  const { events } = useAllContractEvents();
  
  const userEvents = events.filter(event => {
    if (!userAddress) return false;
    
    // Filter events that are relevant to the user
    switch (event.type) {
      case 'Invested':
      case 'PrincipalClaimed':
      case 'YieldClaimed':
        return event.data?.investor?.toLowerCase() === userAddress.toLowerCase();
      
      case 'PoolDeposit':
        return event.data?.investor?.toLowerCase() === userAddress.toLowerCase();
      
      case 'PoolRedeem':
        return event.data?.redeemer?.toLowerCase() === userAddress.toLowerCase();
      
      case 'ProjectCreated':
      case 'LowValueProjectSubmitted':
        return event.data?.developer?.toLowerCase() === userAddress.toLowerCase();
      
      case 'RepaymentRouted':
        return event.data?.payer?.toLowerCase() === userAddress.toLowerCase();
      
      case 'KYCStatusChanged':
        return event.data?.developer?.toLowerCase() === userAddress.toLowerCase();
      
      default:
        return false;
    }
  });

  return { events: userEvents };
} 