export interface TeamMember {
    name: string;
    role: string;
    image: string;
  }

export interface TokenomicsItem {
    category: string;
    percentage: number;
  }
  
  export interface RoadmapPhase {
    phase: string;
    title: string;
    status: "completed" | "in-progress" | "upcoming";
    items: string[];
  }
  
  export interface ProjectData {
    id: number;
    name: string;
    description: string;
    image: string;
    status: string;
    participants: number;
    timeLeft: string;
    raised: number;
    target: number;
    progress: number;
    tokenPrice: number;
    priceChange: number;
    volume24h: number;
    marketCap: number;
    totalSupply: string;
    circulatingSupply: string;
    minAllocation: number;
    maxAllocation: number;
    access: string;
    chain: string;
    socials: {
      website: string;
      twitter: string;
      github: string;
      discord: string;
    };
    tags: string[];
    tokenomics: {
      distribution: TokenomicsItem[];
    };
    team: TeamMember[];
    roadmap: RoadmapPhase[];
  }
  