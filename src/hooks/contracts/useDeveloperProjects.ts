import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useReadContract, useWatchContractEvent } from 'wagmi';
import { Abi, Log, formatUnits, parseAbiItem, GetLogsReturnType } from 'viem';
import { getAddresses, NetworkAddresses } from '@/contracts/addresses';
import ProjectFactoryABIFile from '@/contracts/abis/ProjectFactory.json';
import DirectProjectVaultABIFile from '@/contracts/abis/DirectProjectVault.json';
import { USDC_DECIMALS } from './useUSDC'; // Assuming USDC_DECIMALS is exported or accessible
import { useContractAddresses } from './useDeveloperRegistry';
import { useUserProjects, useProjectStates } from './useProjectFactory';
import { useGetProjectPaymentSummary } from './useRepaymentRouter';
import { useGetNextPaymentInfo } from './useFeeRouter';
import { useGetDeveloperInfo } from './useDeveloperRegistry';

const projectFactoryAbi = ProjectFactoryABIFile.abi as Abi;
const directProjectVaultAbi = DirectProjectVaultABIFile.abi as Abi;

// Define project types (can be moved to a separate types file)
export interface ProjectMetadata {
  name: string;
  description?: string;
  location?: string;
  image?: string;
  // Add any other fields your metadata JSON will contain
}

export interface OnChainProject {
  id: string; // projectId from event
  developer: string;
  status: string; // e.g., "Created", "Metadata Loaded", "Error"
  loanAmount: string;
  vaultAddress?: `0x${string}`;
  devEscrowAddress?: `0x${string}`;
  poolId?: string;
  isLowValue: boolean;
  lowValueSuccess?: boolean;
  metadataCID?: string;
  metadata?: ProjectMetadata | null;
  metadataError?: string | null;
  rawEventData: any;
  timestamp?: Date; // Approx. from block
}

// Define a reliable public IPFS gateway
export const IPFS_GATEWAY_PREFIX = 'https://ipfs.io/ipfs/';
// const IPFS_GATEWAY_PREFIX = 'https://gateway.pinata.cloud/ipfs/';
// const IPFS_GATEWAY_PREFIX = 'https://<your-custom-gateway>.mypinata.cloud/ipfs/';


export function useDeveloperProjects() {
  const { address: developerAddress, chainId } = useAccount();
  const publicClient = usePublicClient();
  const [projects, setProjects] = useState<OnChainProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAddresses, setCurrentAddresses] = useState<NetworkAddresses | undefined>(undefined);

  useEffect(() => {
    if (chainId) {
      try {
        setCurrentAddresses(getAddresses(chainId));
      } catch (err) {
        console.error("Failed to get contract addresses for chain ID:", chainId, err);
        setError(`Unsupported network (Chain ID: ${chainId}). Please ensure it's configured in addresses.ts.`);
        setCurrentAddresses(undefined);
      }
    } else {
      setCurrentAddresses(undefined);
    }
  }, [chainId]);

  const fetchProjects = useCallback(async () => {
    if (!developerAddress || !publicClient || !currentAddresses?.projectFactoryProxy) {
      setIsLoading(false);
      setProjects([]);
      return;
    }

    console.log("useDeveloperProjects: Starting project fetch...");
    setIsLoading(true);
    setError(null);
    setProjects([]); 

    const BLOCK_RANGE_LIMIT = BigInt(499);
    
    try {
      const latestBlockNumber = await publicClient.getBlockNumber();
      let effectiveInitialFromBlock = BigInt(process.env.NEXT_PUBLIC_PROJECT_FACTORY_DEPLOYMENT_BLOCK || -1); // Use -1 to distinguish from actual 0

      if (effectiveInitialFromBlock < BigInt(0)) { // Check if env var was not set or invalid
        // If no deployment block is set, fetch a limited recent range for faster loading in dev/test.
        // Adjust defaultScanRange as needed. 50,000 blocks is a reasonable recent history for a testnet.
        const defaultScanRange = BigInt(50000); 
        effectiveInitialFromBlock = latestBlockNumber > defaultScanRange ? latestBlockNumber - defaultScanRange : BigInt(0);
        console.warn(`useDeveloperProjects: NEXT_PUBLIC_PROJECT_FACTORY_DEPLOYMENT_BLOCK not set. Defaulting to scan from block ${effectiveInitialFromBlock}. For production or full history, set this to your contract's deployment block.`);
      } else {
        console.log(`useDeveloperProjects: Using configured deployment block: ${effectiveInitialFromBlock}`);
      }
      
      console.log(`useDeveloperProjects: Fetching logs from block ${effectiveInitialFromBlock} to ${latestBlockNumber}`);

      const projectCreatedEvent = parseAbiItem('event ProjectCreated(uint256 indexed projectId, address indexed developer, address vaultAddress, address devEscrowAddress, uint256 loanAmount, string metadataCID)');
      const lowValueProjectSubmittedEvent = parseAbiItem('event LowValueProjectSubmitted(uint256 indexed projectId, address indexed developer, uint256 poolId, uint256 loanAmount, bool success, string metadataCID)');

      type ProjectCreatedLog = GetLogsReturnType<typeof projectCreatedEvent>[0];
      type LowValueProjectSubmittedLog = GetLogsReturnType<typeof lowValueProjectSubmittedEvent>[0];

      let allProjectCreatedLogs: ProjectCreatedLog[] = [];
      let allLowValueProjectSubmittedLogs: LowValueProjectSubmittedLog[] = [];

      for (let currentFromBlock = effectiveInitialFromBlock; currentFromBlock <= latestBlockNumber; currentFromBlock += (BLOCK_RANGE_LIMIT + BigInt(1))) {
        const currentToBlock = (currentFromBlock + BLOCK_RANGE_LIMIT > latestBlockNumber) ? latestBlockNumber : currentFromBlock + BLOCK_RANGE_LIMIT;
        
        if (currentFromBlock > currentToBlock) break; 

        // console.log(`Fetching logs chunk from block ${currentFromBlock} to ${currentToBlock}`);

        try {
            const projectCreatedChunk = await publicClient.getLogs({
                address: currentAddresses.projectFactoryProxy,
                event: projectCreatedEvent,
                args: {
                    developer: developerAddress,
                },
                fromBlock: currentFromBlock,
                toBlock: currentToBlock,
            });
            allProjectCreatedLogs = allProjectCreatedLogs.concat(projectCreatedChunk);
        } catch (chunkError) {
            console.error(`Error fetching ProjectCreated logs chunk (${currentFromBlock}-${currentToBlock}):`, chunkError);
        }
        
        try {
            const lowValueProjectSubmittedChunk = await publicClient.getLogs({
                address: currentAddresses.projectFactoryProxy,
                event: lowValueProjectSubmittedEvent,
                args: {
                    developer: developerAddress,
                },
                fromBlock: currentFromBlock,
                toBlock: currentToBlock,
            });
            allLowValueProjectSubmittedLogs = allLowValueProjectSubmittedLogs.concat(lowValueProjectSubmittedChunk);
        } catch (chunkError) {
            console.error(`Error fetching LowValueProjectSubmitted logs chunk (${currentFromBlock}-${currentToBlock}):`, chunkError);
        }
      }
      
      console.log(`useDeveloperProjects: Found ${allProjectCreatedLogs.length} ProjectCreated events and ${allLowValueProjectSubmittedLogs.length} LowValueProjectSubmitted events.`);

      const combinedLogs: Array<(ProjectCreatedLog | LowValueProjectSubmittedLog) & { type: string }> = [
        ...allProjectCreatedLogs.map(log => ({ ...log, type: 'ProjectCreated' as const })),
        ...allLowValueProjectSubmittedLogs.map(log => ({ ...log, type: 'LowValueProjectSubmitted' as const }))
      ];

      combinedLogs.sort((a, b) => {
        if (a.blockNumber === null || b.blockNumber === null) return 0;
        if (a.blockNumber !== b.blockNumber) {
          return Number(a.blockNumber - b.blockNumber);
        }
        if (a.logIndex === null || b.logIndex === null) return 0;
        return a.logIndex - b.logIndex;
      });

      console.log("useDeveloperProjects: Processing metadata for combined logs...");
      const fetchedProjectsPromises = combinedLogs.map(async (log) => {
        // log.args is now correctly typed based on whether it's ProjectCreatedLog or LowValueProjectSubmittedLog
        // However, since it's a union type in combinedLogs, we still need to access common properties
        // or type guard to access specific ones.
        const args = log.args as any; // Keep as any for simplicity here given the union, or use type guards
        
        let project: Partial<OnChainProject> = {
          id: args.projectId.toString(),
          developer: args.developer,
          loanAmount: formatUnits(args.loanAmount, USDC_DECIMALS),
          rawEventData: args,
          isLowValue: log.type === 'LowValueProjectSubmitted',
        };

        try {
            if (log.blockNumber) {
                const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                project.timestamp = new Date(Number(block.timestamp) * 1000);
            }
        } catch (blockError) {
            console.warn(`Failed to fetch block for project ${project.id}:`, blockError);
        }
        
        const eventMetadataCID = args.metadataCID;

        if (log.type === 'ProjectCreated') {
          project.vaultAddress = args.vaultAddress;
          project.devEscrowAddress = args.devEscrowAddress;
          project.metadataCID = eventMetadataCID; 
        } else if (log.type === 'LowValueProjectSubmitted') {
          project.poolId = args.poolId.toString();
          project.lowValueSuccess = args.success;
          project.metadataCID = eventMetadataCID;
        }
        
        if (project.metadataCID) {
          project.status = "Fetching Metadata";
          try {
            const response = await fetch(`${IPFS_GATEWAY_PREFIX}${project.metadataCID}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch metadata from IPFS: ${response.statusText} (CID: ${project.metadataCID})`);
            }
            const metadata = await response.json() as ProjectMetadata;
            project.metadata = metadata;
            project.status = "Metadata Loaded";
          } catch (metaError: any) {
            console.error(`Error fetching metadata for project ${project.id} (CID: ${project.metadataCID}):`, metaError);
            project.metadataError = metaError.message || "Failed to load metadata";
            project.status = "Metadata Error";
          }
        } else {
          project.status = "Metadata CID Missing in Event";
        }
        return project as OnChainProject;
      });

      const resolvedProjects = await Promise.all(fetchedProjectsPromises);
      setProjects(resolvedProjects.sort((a,b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))); 
      console.log(`useDeveloperProjects: Processed ${resolvedProjects.length} projects successfully.`);

    } catch (err: any) {
      console.error("useDeveloperProjects: Error fetching projects:", err);
      setError(err.message || "An unknown error occurred while fetching projects.");
      setProjects([]);
    } finally {
      setIsLoading(false);
      console.log("useDeveloperProjects: Finished project fetch (isLoading set to false).");
    }
  }, [developerAddress, publicClient, currentAddresses]); // Keep dependencies minimal and stable

  // Auto-refresh when new ProjectCreated events are detected
  useWatchContractEvent({
    address: currentAddresses?.projectFactoryProxy,
    abi: projectFactoryAbi,
    eventName: 'ProjectCreated',
    args: developerAddress ? { developer: developerAddress } : undefined,
    onLogs: (logs) => {
      console.log("🔄 New ProjectCreated event detected, refreshing projects...");
      // Small delay to ensure the transaction is fully processed
      setTimeout(() => {
        fetchProjects();
      }, 2000);
    },
    enabled: !!developerAddress && !!currentAddresses?.projectFactoryProxy,
  });

  // Auto-refresh when new LowValueProjectSubmitted events are detected
  useWatchContractEvent({
    address: currentAddresses?.projectFactoryProxy,
    abi: projectFactoryAbi,
    eventName: 'LowValueProjectSubmitted',
    args: developerAddress ? { developer: developerAddress } : undefined,
    onLogs: (logs) => {
      console.log("🔄 New LowValueProjectSubmitted event detected, refreshing projects...");
      // Small delay to ensure the transaction is fully processed
      setTimeout(() => {
        fetchProjects();
      }, 2000);
    },
    enabled: !!developerAddress && !!currentAddresses?.projectFactoryProxy,
  });

  useEffect(() => {
    if (developerAddress && publicClient && currentAddresses) {
      fetchProjects();
    } else if (!developerAddress || !currentAddresses) {
        setIsLoading(false); 
        setProjects([]); 
    }
    // fetchProjects is memoized with useCallback, its identity changes when its deps change.
    // Adding it here ensures re-fetch if, for instance, currentAddresses changes due to network switch.
  }, [developerAddress, publicClient, currentAddresses, fetchProjects]); 

  return { projects, isLoading, error, refetchProjects: fetchProjects };
} 

// Hook to get all developer's projects with comprehensive data
export function useGetDeveloperProjects(developerAddress?: `0x${string}`) {
  const { data: developerInfo } = useGetDeveloperInfo(developerAddress);
  const [projects, setProjects] = useState<Array<{
    projectId: number;
    state: number;
    paymentSummary: any;
    nextPayment: any;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!developerInfo || !developerAddress) return;

    const fetchAllProjects = async () => {
      setIsLoading(true);
      // Note: Developer info structure may vary based on actual contract
      // For now, using a fallback approach
      const projectCount = Number((developerInfo as any)?.timesFunded) || 0;
      const projectPromises = [];

      for (let i = 0; i < projectCount; i++) {
        projectPromises.push(fetchProjectData(developerAddress, i));
      }

      try {
        const projectsData = await Promise.all(projectPromises);
        setProjects(projectsData.filter(p => p !== null));
      } catch (error) {
        console.error('Error fetching developer projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProjects();
  }, [developerInfo, developerAddress]);

  return {
    projects,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.state === 1).length, // Assuming state 1 is active
    completedProjects: projects.filter(p => p.state === 2).length, // Assuming state 2 is completed
    isLoading,
  };
}

// Helper function to fetch individual project data
async function fetchProjectData(developerAddress: `0x${string}`, index: number) {
  try {
    // This would need to be implemented with proper async contract calls
    // For now, returning a placeholder structure
    return {
      projectId: index,
      state: 1, // Placeholder
      paymentSummary: null,
      nextPayment: null,
    };
  } catch (error) {
    console.error(`Error fetching project ${index}:`, error);
    return null;
  }
}

// Hook to get developer's project statistics
export function useDeveloperProjectStats(developerAddress?: `0x${string}`) {
  const { projects, isLoading } = useGetDeveloperProjects(developerAddress);

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.state === 1).length,
    completedProjects: projects.filter(p => p.state === 2).length,
    pendingProjects: projects.filter(p => p.state === 0).length,
    totalRepayments: projects.reduce((sum, p) => {
      return sum + (Number(p.paymentSummary?.formattedTotalRepaid) || 0);
    }, 0),
    averageProjectSize: projects.length > 0 ? 
      projects.reduce((sum, p) => sum + (p.paymentSummary?.loanAmount || 0), 0) / projects.length : 0,
  };

  return {
    ...stats,
    isLoading,
  };
}

// Hook to get developer's upcoming payments
export function useDeveloperUpcomingPayments(developerAddress?: `0x${string}`) {
  const { projects, isLoading } = useGetDeveloperProjects(developerAddress);

  const upcomingPayments = projects
    .filter(p => p.nextPayment && p.nextPayment.amount > 0)
    .map(p => ({
      projectId: p.projectId,
      dueDate: p.nextPayment.dueDateTimestamp,
      amount: p.nextPayment.formattedAmount,
      isDue: p.nextPayment.isDue,
      daysUntilDue: p.nextPayment.daysUntilDue,
    }))
    .sort((a, b) => a.dueDate - b.dueDate);

  const totalUpcoming = upcomingPayments.reduce((sum, payment) => 
    sum + parseFloat(payment.amount), 0
  );

  const overdue = upcomingPayments.filter(p => p.isDue);

  return {
    upcomingPayments,
    totalUpcoming: totalUpcoming.toFixed(6),
    overduePayments: overdue,
    totalOverdue: overdue.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(6),
    nextPaymentDue: upcomingPayments[0] || null,
    isLoading,
  };
}

// Hook to get developer's repayment history
export function useDeveloperRepaymentHistory(developerAddress?: `0x${string}`) {
  const { projects, isLoading } = useGetDeveloperProjects(developerAddress);

  const repaymentHistory = projects
    .filter(p => p.paymentSummary && p.paymentSummary.paymentCount > 0)
    .map(p => ({
      projectId: p.projectId,
      totalRepaid: p.paymentSummary.formattedTotalRepaid,
      lastPayment: p.paymentSummary.lastPaymentTimestamp,
      paymentCount: p.paymentSummary.formattedPaymentCount,
    }))
    .sort((a, b) => b.lastPayment - a.lastPayment);

  const totalRepaid = repaymentHistory.reduce((sum, history) => 
    sum + parseFloat(history.totalRepaid), 0
  );

  return {
    repaymentHistory,
    totalRepaid: totalRepaid.toFixed(6),
    totalPayments: repaymentHistory.reduce((sum, h) => sum + h.paymentCount, 0),
    lastPaymentDate: repaymentHistory[0]?.lastPayment || 0,
    isLoading,
  };
}

// Comprehensive hook collection for developer project management
export function useDeveloperProjectsCollection() {
  return {
    useGetDeveloperProjects,
    useDeveloperProjectStats,
    useDeveloperUpcomingPayments,
    useDeveloperRepaymentHistory,
  };
} 