'use client';

import { useVaultDetails } from '@/hooks/contracts/useDirectProjectVault';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useUserType } from '@/providers/userType';
import { Sun, Wind, Droplet, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  title: string;
  type: 'solar' | 'wind' | 'hydro' | 'biomass';
  loanAmount: string;
  vaultAddress: `0x${string}`;
  developer: string;
  imageUrl: string;
}

// Map project types to their icons
const typeIcons = {
  solar: Sun,
  wind: Wind,
  hydro: Droplet,
  biomass: Leaf
};

export function ProjectCard({
  id,
  title,
  type,
  loanAmount,
  vaultAddress,
  developer,
  imageUrl
}: ProjectCardProps) {
  const { userType } = useUserType();
  
  // Get vault information
  const {
    totalAssetsInvested,
    isFundingClosed,
    fundingPercentage
  } = useVaultDetails(vaultAddress);
  
  // Get appropriate icon
  const TypeIcon = typeIcons[type];
  
  return (
    <Card className="relative bg-black/40 backdrop-blur-sm border border-emerald-800/30 overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
      
      {/* Project image */}
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={imageUrl}
          alt={title} 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <Badge 
          variant="outline" 
          className="absolute top-2 right-2 bg-emerald-900/30 text-emerald-300 border-emerald-700"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      </div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <TypeIcon className="h-5 w-5 text-emerald-500" />
        </div>
        
        {/* Status badge */}
        <Badge 
          variant={isFundingClosed ? "destructive" : "outline"} 
          className={isFundingClosed 
            ? "bg-amber-900/30 text-amber-300 border-amber-700" 
            : "bg-emerald-900/30 text-emerald-300 border-emerald-700"
          }
        >
          {isFundingClosed ? "Funding Closed" : "Funding Open"}
        </Badge>
        
        <div className="space-y-4 my-4">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-zinc-400">Funding Progress</span>
              <span className="text-sm text-white">{fundingPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={fundingPercentage} className="h-2 bg-emerald-950" />
          </div>
          
          {/* Project details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Target</span>
              <span className="text-sm text-white font-medium">${loanAmount} USDC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Raised</span>
              <span className="text-sm text-white font-medium">${totalAssetsInvested} USDC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Developer</span>
              <span className="text-xs text-zinc-300 font-mono truncate w-24">
                {developer.substring(0, 6)}...{developer.substring(developer.length - 4)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-emerald-900/30 pt-4">
        <Link href={`/projects/${id}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full border border-emerald-800/50 text-emerald-400 hover:bg-emerald-700 hover:text-white hover:border-emerald-500 transition-colors"
          >
            {userType === 'developer' ? 'Manage Project' : 'View Project'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 