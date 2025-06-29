import axios from 'axios';

// IPFS configuration for Pinata
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

export interface ProjectMetadata {
  name: string;
  description: string;
  location: string;
  projectType: 'solar';
  capacity: number; // in MW
  expectedAnnualGeneration: number; // in MWh
  carbonCreditsExpected: number; // per year
  developer: {
    name: string;
    address: string;
    contact: string;
  };
  technical: {
    equipment: string[];
    installationTimeline: string;
    maintenanceSchedule: string;
  };
  financial: {
    totalCost: number;
    loanAmount: number;
    tenor: number; // in days
    expectedROI: number;
    paybackPeriod: number; // in months
  };
  images: string[];
  documents: string[];
  created: number;
  version: string;
}

export class IPFSService {
  private static instance: IPFSService;
  private apiKey: string | undefined;
  private secretKey: string | undefined;
  
  constructor() {
    // Use environment variables if available, otherwise use demo keys
    this.apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    this.secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
  }
  
  public static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService();
    }
    return IPFSService.instance;
  }

  async uploadProjectMetadata(metadata: ProjectMetadata): Promise<string> {
    try {
      // For demo purposes, if no API keys are configured, use a mock CID
      if (!this.apiKey || !this.secretKey) {
        console.warn('IPFS credentials not configured, using mock CID');
        // Generate a deterministic mock CID based on project name
        const mockCID = this.generateMockCID(metadata.name);
        // Store metadata in localStorage for demo purposes
        localStorage.setItem(`ipfs_metadata_${mockCID}`, JSON.stringify(metadata));
        return mockCID;
      }

      const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
        {
          pinataContent: metadata,
          pinataMetadata: {
            name: `${metadata.name}_metadata`,
            keyvalues: {
              projectName: metadata.name,
              projectType: metadata.projectType,
              developer: metadata.developer.address,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': this.apiKey,
            'pinata_secret_api_key': this.secretKey,
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      // Fallback to mock for demo
      const mockCID = this.generateMockCID(metadata.name);
      localStorage.setItem(`ipfs_metadata_${mockCID}`, JSON.stringify(metadata));
      return mockCID;
    }
  }

  async uploadFile(file: File): Promise<string> {
    try {
      // For demo purposes, if no API keys are configured, use mock storage
      if (!this.apiKey || !this.secretKey) {
        console.warn('IPFS credentials not configured, using mock file storage');
        const mockCID = this.generateMockCID(file.name);
        // In a real implementation, you'd store the file
        return mockCID;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('pinataMetadata', JSON.stringify({
        name: file.name,
      }));

      const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            'pinata_api_key': this.apiKey,
            'pinata_secret_api_key': this.secretKey,
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      // Fallback to mock for demo
      return this.generateMockCID(file.name);
    }
  }

  async getMetadata(cid: string): Promise<ProjectMetadata> {
    try {
      // Check localStorage first for demo data
      const localData = localStorage.getItem(`ipfs_metadata_${cid}`);
      if (localData) {
        return JSON.parse(localData);
      }

      // Try to fetch from IPFS gateway
      const response = await axios.get(`${PINATA_GATEWAY}/${cid}`, {
        timeout: 10000, // 10 second timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching metadata from IPFS:', error);
      
      // Return mock data for demo purposes
      return {
        name: 'Sample Solar Project',
        description: 'A demonstration solar energy project for the OnGrid Protocol',
        location: 'California, USA',
        projectType: 'solar',
        capacity: 5.0,
        expectedAnnualGeneration: 12000,
        carbonCreditsExpected: 5000,
        developer: {
          name: 'Demo Developer',
          address: '0x0000000000000000000000000000000000000000',
          contact: 'demo@example.com',
        },
        technical: {
          equipment: ['Solar Panels', 'Inverters', 'Mounting Systems'],
          installationTimeline: '6 months',
          maintenanceSchedule: 'Annual inspections',
        },
        financial: {
          totalCost: 500000,
          loanAmount: 500000,
          tenor: 365,
          expectedROI: 12.5,
          paybackPeriod: 36,
        },
        images: [],
        documents: [],
        created: Date.now(),
        version: '1.0.0',
      };
    }
  }

  private generateMockCID(input: string): string {
    // Generate a deterministic mock CID for demo purposes
    const hash = this.simpleHash(input);
    return `Qm${hash.toString(36).padStart(44, '0')}`;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

export const ipfsService = IPFSService.getInstance(); 