import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { Abi, Log, formatUnits, parseAbiItem, GetLogsReturnType } from 'viem';
import { getAddresses, NetworkAddresses } from '@/contracts/addresses';
import ProjectFactoryABIFile from '@/contracts/abis/ProjectFactory.json';
import DirectProjectVaultABIFile from '@/contracts/abis/DirectProjectVault.json';
import { USDC_DECIMALS } from './useUSDC'; // Assuming USDC_DECIMALS is exported or accessible

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