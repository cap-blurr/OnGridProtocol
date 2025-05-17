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
        setError(`Unsupported network (Chain ID: ${chainId}).`);
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

    setIsLoading(true);
    setError(null);

    try {
      const projectCreatedEvent = parseAbiItem('event ProjectCreated(uint256 indexed projectId, address indexed developer, address vaultAddress, address devEscrowAddress, uint256 loanAmount, string metadataCID)');
      const lowValueProjectSubmittedEvent = parseAbiItem('event LowValueProjectSubmitted(uint256 indexed projectId, address indexed developer, uint256 poolId, uint256 loanAmount, bool success, string metadataCID)');

      type ProjectCreatedLog = GetLogsReturnType<typeof projectCreatedEvent>[0];
      type LowValueProjectSubmittedLog = GetLogsReturnType<typeof lowValueProjectSubmittedEvent>[0];


      // Fetch ProjectCreated events
      const projectCreatedLogs: ProjectCreatedLog[] = await publicClient.getLogs({
        address: currentAddresses.projectFactoryProxy,
        event: projectCreatedEvent,
        args: {
          developer: developerAddress,
        },
        fromBlock: BigInt(0), // Adjust as needed, e.g., contract deployment block
        toBlock: 'latest',
      });

      // Fetch LowValueProjectSubmitted events
      const lowValueProjectSubmittedLogs: LowValueProjectSubmittedLog[] = await publicClient.getLogs({
        address: currentAddresses.projectFactoryProxy,
        event: lowValueProjectSubmittedEvent,
        args: {
          developer: developerAddress,
        },
        fromBlock: BigInt(0), // Adjust as needed
        toBlock: 'latest',
      });
      
      const combinedLogs: Array<(ProjectCreatedLog | LowValueProjectSubmittedLog) & { type: string }> = [
        ...projectCreatedLogs.map(log => ({ ...log, type: 'ProjectCreated' as const })),
        ...lowValueProjectSubmittedLogs.map(log => ({ ...log, type: 'LowValueProjectSubmitted' as const }))
      ];

      // Sort by block number and log index to maintain chronological order
      combinedLogs.sort((a, b) => {
        if (a.blockNumber === null || b.blockNumber === null) return 0;
        if (a.blockNumber !== b.blockNumber) {
          return Number(a.blockNumber - b.blockNumber);
        }
        if (a.logIndex === null || b.logIndex === null) return 0;
        return a.logIndex - b.logIndex;
      });


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
              throw new Error(`Failed to fetch metadata from IPFS: ${response.statusText}`);
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
      setProjects(resolvedProjects.sort((a,b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))); // Sort by newest first

    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message || "An unknown error occurred while fetching projects.");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [developerAddress, publicClient, currentAddresses]);

  useEffect(() => {
    if (developerAddress && publicClient && currentAddresses) {
      fetchProjects();
    } else if (!developerAddress || !currentAddresses) {
        setIsLoading(false);
        setProjects([]); // Clear projects if wallet disconnects or network is unsupported
    }
  }, [developerAddress, publicClient, fetchProjects, currentAddresses]);

  return { projects, isLoading, error, refetchProjects: fetchProjects };
} 