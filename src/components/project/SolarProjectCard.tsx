"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Sun, 
  MapPin, 
  Zap, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Leaf,
  Eye,
  Clock,
  Users,
  Target
} from "lucide-react";
import { formatUnits } from "viem";
import { useVaultWithMetadata } from "@/hooks/contracts/useDirectProjectVault";
import Link from "next/link";

interface SolarProjectCardProps {
  vaultAddress: string;
  projectId?: string;
  onInvest?: () => void;
}

export default function SolarProjectCard({ vaultAddress, projectId, onInvest }: SolarProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Fetch combined vault data and metadata
  const { 
    loanAmount,
    totalAssetsInvested,
    isFundingClosed,
    aprPercentage,
    developer,
    fundingPercentage,
    summary,
    metadata,
    isLoading,
    error
  } = useVaultWithMetadata(vaultAddress as `0x${string}`);

  if (isLoading) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800 animate-pulse overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-40 bg-zinc-700 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
              <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !loanAmount) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800 opacity-60">
        <CardContent className="p-6 text-center">
          <div className="text-zinc-500">
            <Sun className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Unable to load project data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fundingProgress = summary?.fundingProgressPercentage || fundingPercentage || 0;
  const loanAmountFormatted = formatUnits(loanAmount, 6);
  const totalRaisedFormatted = formatUnits(totalAssetsInvested || BigInt(0), 6);
  const timeRemainingDays = summary?.timeRemainingSeconds ? Math.ceil(summary.timeRemainingSeconds / (24 * 60 * 60)) : 0;

  // Use metadata if available, otherwise fallback values
  const projectName = metadata?.name || `Solar Project #${projectId || 'Unknown'}`;
  const projectDescription = metadata?.description || 'Renewable energy project creating sustainable value';
  const projectLocation = metadata?.location || 'Location TBD';
  const projectType = metadata?.projectType || 'solar';
  const capacity = metadata?.capacity || 0;
  const expectedROI = metadata?.financial?.expectedROI || aprPercentage || 0;
  const carbonCredits = metadata?.carbonCreditsExpected || 0;

  // Get project type icon and color
  const getProjectTypeInfo = (type: string) => {
    switch (type) {
      case 'solar':
        return { icon: Sun, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' };
      default:
        return { icon: Sun, color: 'text-green-400', bgColor: 'bg-green-400/10' };
    }
  };

  const { icon: TypeIcon, color: typeColor, bgColor: typeBgColor } = getProjectTypeInfo(projectType);

  // Get status badge
  const getStatusBadge = () => {
    if (isFundingClosed) {
      return <Badge className="bg-green-600 text-white">Active</Badge>;
    } else if (fundingProgress >= 100) {
      return <Badge className="bg-green-600 text-white">Funded</Badge>;
    } else if (timeRemainingDays > 0) {
      return <Badge className="bg-blue-600 text-white">Funding Open</Badge>;
    } else {
      return <Badge className="bg-gray-600 text-white">Funding Closed</Badge>;
    }
  };

  // Mock image - in real implementation, this would come from metadata.images
  const projectImage = metadata?.images?.[0] 
    ? `https://gateway.pinata.cloud/ipfs/${metadata.images[0]}`
    : 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop';

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 hover:border-green-600/50 transition-all duration-300 group overflow-hidden">
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <img
            src={projectImage}
            alt={projectName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-900/20 to-green-700/20 flex items-center justify-center">
            <TypeIcon className={`h-16 w-16 ${typeColor}`} />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
        
        {/* Project Type Badge */}
        <div className={`absolute top-3 left-3 ${typeBgColor} rounded-full p-2`}>
          <TypeIcon className={`h-4 w-4 ${typeColor}`} />
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-white mb-1 line-clamp-1">
              {projectName}
            </CardTitle>
            <div className="flex items-center text-zinc-400 text-sm mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {projectLocation}
            </div>
          </div>
        </div>
        
        <p className="text-zinc-400 text-sm line-clamp-2">
          {projectDescription}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        {capacity > 0 && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-zinc-400">Capacity:</span>
              <span className="text-white font-medium">{capacity} MW</span>
            </div>
            {carbonCredits > 0 && (
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-400" />
                <span className="text-zinc-400">CO₂/year:</span>
                <span className="text-white font-medium">{carbonCredits.toLocaleString()}t</span>
              </div>
            )}
          </div>
        )}

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Funding Progress</span>
            <span className="text-white font-medium">{fundingProgress.toFixed(1)}%</span>
          </div>
          <Progress 
            value={Math.min(fundingProgress, 100)} 
            className="h-2 bg-zinc-800"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>${Number(totalRaisedFormatted).toLocaleString()} raised</span>
            <span>${Number(loanAmountFormatted).toLocaleString()} goal</span>
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-zinc-400">Expected ROI:</span>
            <span className="text-green-400 font-medium">{expectedROI.toFixed(1)}%</span>
          </div>
          {timeRemainingDays > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-zinc-400">Time left:</span>
              <span className="text-white font-medium">{timeRemainingDays}d</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link 
            href={`/projects/${projectId || vaultAddress}`}
            className="flex-1"
          >
            <Button 
              variant="outline" 
              className="w-full border-zinc-700 text-zinc-300 hover:border-green-600 hover:text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          
          {!isFundingClosed && fundingProgress < 100 && timeRemainingDays > 0 && (
            <Button 
              onClick={onInvest}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Invest
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 