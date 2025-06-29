import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sun,
  Users,
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  MapPin,
  Filter,
  Search,
  ArrowUpRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  Target,
  Calendar,
  Info
} from 'lucide-react';
import { formatUnits } from 'viem';
import toast from 'react-hot-toast';

// Import hooks following integration guide
import { useGetAllHighValueProjects } from '@/hooks/contracts/useProjectFactory';
import { useVaultDetails, useProjectSummary } from '@/hooks/contracts/useDirectProjectVault';
import { useGetAllPools, usePoolInfo } from '@/hooks/contracts/useLiquidityPoolManager';
import { InvestmentModal } from '@/components/project/investment-modal';
import InvestmentForm from '@/components/project/InvestmentForm';
import SolarProjectCard from '@/components/project/SolarProjectCard';

interface HighValueProject {
  vaultAddress: `0x${string}`;
  projectId: string;
  loanAmount: bigint;
  totalAssetsInvested: bigint;
  fundingPercentage: number;
  isFundingClosed: boolean;
  timeRemaining: number;
  projectState: number;
  metadataURI?: string;
  developer?: string;
}

interface PoolProject {
  poolId: number;
  name: string;
  totalAssets: bigint;
  totalShares: bigint;
  aprPercentage: number;
  riskLevel: number;
  exists: boolean;
}

export default function ProjectDiscovery() {
  const { isConnected } = useAccount();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high-value' | 'pools'>('all');
  const [sortBy, setSortBy] = useState<'funding' | 'apr' | 'amount'>('funding');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  // Get high-value projects
  const { projects: highValueVaults, isLoading: isLoadingHighValue } = useGetAllHighValueProjects();
  const [highValueProjects, setHighValueProjects] = useState<HighValueProject[]>([]);

  // Get pool projects
  const { pools: allPools, isLoading: isLoadingPools } = useGetAllPools();
  const [poolProjects, setPoolProjects] = useState<PoolProject[]>([]);

  // Process high-value projects
  useEffect(() => {
    const fetchHighValueProjects = async () => {
      if (!highValueVaults || highValueVaults.length === 0) return;

      const projects: HighValueProject[] = [];

      for (let i = 0; i < highValueVaults.length; i++) {
        const vaultAddress = highValueVaults[i];
        try {
          // This would use the actual vault hooks to get project details
          // For now, we'll use placeholder data structure
          const projectData: HighValueProject = {
            vaultAddress,
            projectId: `HV-${i + 1}`,
            loanAmount: BigInt(100000 * 10**6), // $100,000 in USDC
            totalAssetsInvested: BigInt(65000 * 10**6), // $65,000 invested
            fundingPercentage: 65,
            isFundingClosed: false,
            timeRemaining: 2592000, // 30 days in seconds
            projectState: 1, // PROJECT_STATE_FUNDING_OPEN
            developer: '0x...',
            metadataURI: 'ipfs://...'
          };

          projects.push(projectData);
        } catch (error) {
          console.error(`Error fetching project details for vault ${vaultAddress}:`, error);
        }
      }

      setHighValueProjects(projects);
    };

    fetchHighValueProjects();
  }, [highValueVaults]);

  // Process pool projects
  useEffect(() => {
    if (allPools && allPools.length > 0) {
      const pools: PoolProject[] = allPools.map((pool, index) => ({
        poolId: index + 1,
        name: `Solar Pool ${index + 1}`,
        totalAssets: pool.totalAssets || BigInt(0),
        totalShares: pool.totalShares || BigInt(0),
        aprPercentage: 8 + (index * 2), // Mock APR
        riskLevel: (index % 3) + 1, // Mock risk level 1-3
        exists: pool.exists || false
      })).filter(pool => pool.exists);

      setPoolProjects(pools);
    }
  }, [allPools]);

  // Filter and sort projects
  const getFilteredProjects = () => {
    let filtered: any[] = [];

    if (filterType === 'all' || filterType === 'high-value') {
      filtered = filtered.concat(highValueProjects.map(p => ({ ...p, type: 'high-value' })));
    }

    if (filterType === 'all' || filterType === 'pools') {
      filtered = filtered.concat(poolProjects.map(p => ({ ...p, type: 'pool' })));
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'funding':
          if (a.type === 'high-value' && b.type === 'high-value') {
            return b.fundingPercentage - a.fundingPercentage;
          }
          return 0;
        case 'apr':
          const aApr = a.aprPercentage || 0;
          const bApr = b.aprPercentage || 0;
          return bApr - aApr;
        case 'amount':
          const aAmount = a.loanAmount || a.totalAssets || BigInt(0);
          const bAmount = b.loanAmount || b.totalAssets || BigInt(0);
          return Number(bAmount - aAmount);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  const handleInvestClick = (project: any) => {
    setSelectedProject(project);
    setShowInvestmentModal(true);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Discover Solar Projects</h1>
        <p className="text-xl text-gray-300">Please connect your wallet to explore investment opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Solar Investment Opportunities</h1>
          <p className="text-zinc-400">
            Discover and invest in renewable energy projects across Africa
          </p>
        </div>
        <div className="flex items-center gap-2 text-oga-green">
          <Sun className="h-5 w-5" />
          <span className="text-sm font-medium">
            {filteredProjects.length} Projects Available
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[180px] bg-black/20 border-oga-green/30 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="high-value">Direct Projects</SelectItem>
                <SelectItem value="pools">Pool Projects</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px] bg-black/20 border-oga-green/30 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funding">Funding Progress</SelectItem>
                <SelectItem value="apr">APR</SelectItem>
                <SelectItem value="amount">Investment Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">{filteredProjects.length}</p>
              </div>
              <Target className="h-8 w-8 text-oga-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Direct Projects</p>
                <p className="text-2xl font-bold text-white">{highValueProjects.length}</p>
              </div>
              <Sun className="h-8 w-8 text-oga-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Pool Projects</p>
                <p className="text-2xl font-bold text-white">{poolProjects.length}</p>
              </div>
              <Users className="h-8 w-8 text-oga-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Avg. APR</p>
                <p className="text-2xl font-bold text-oga-green">
                  {poolProjects.length > 0 
                    ? (poolProjects.reduce((sum, p) => sum + p.aprPercentage, 0) / poolProjects.length).toFixed(1)
                    : '0.0'
                  }%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-oga-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {isLoadingHighValue || isLoadingPools ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-oga-green" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="py-12 text-center">
            <Search className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-zinc-400">
              Try adjusting your search terms or filters to find more projects.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            project.type === 'high-value' ? (
              <SolarProjectCard
                key={project.vaultAddress}
                vaultAddress={project.vaultAddress}
                projectId={project.projectId}
                onInvest={() => handleInvestClick(project)}
              />
            ) : (
              <ProjectCard
                key={project.poolId}
                project={project}
                onInvestClick={() => handleInvestClick(project)}
              />
            )
          ))}
        </div>
      )}

      {/* Investment Modal */}
      <InvestmentModal
        open={showInvestmentModal}
        onOpenChange={setShowInvestmentModal}
        projectData={selectedProject?.type === 'high-value' ? selectedProject : null}
        poolData={selectedProject?.type === 'pool' ? selectedProject : null}
        type={selectedProject?.type || 'project'}
      />
    </div>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: any;
  onInvestClick: () => void;
}

function ProjectCard({ project, onInvestClick }: ProjectCardProps) {
  const isHighValue = project.type === 'high-value';
  
  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-white">
            {isHighValue ? `Solar Project #${project.projectId}` : project.name}
          </CardTitle>
          <Badge className={isHighValue ? 
            "bg-blue-500/20 text-blue-400 border-blue-500/50" : 
            "bg-green-500/20 text-green-400 border-green-500/50"
          }>
            {isHighValue ? 'Direct' : 'Pool'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <MapPin className="h-4 w-4" />
          <span>Africa</span>
          <Sun className="h-4 w-4 text-oga-yellow" />
          <span>Solar Energy</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Funding Progress (High Value Projects) */}
        {isHighValue && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Funding Progress</span>
              <span className="text-white">{project.fundingPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={project.fundingPercentage} className="h-2 bg-zinc-800" />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>${Number(formatUnits(project.totalAssetsInvested, 6)).toLocaleString()}</span>
              <span>${Number(formatUnits(project.loanAmount, 6)).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Pool Information */}
        {!isHighValue && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Total Pool Assets</span>
              <span className="text-white">${Number(formatUnits(project.totalAssets, 6)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">APR</span>
              <span className="text-oga-green font-medium">{project.aprPercentage}%</span>
            </div>
          </div>
        )}

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {isHighValue ? (
            <>
              <div>
                <p className="text-zinc-400">Target Amount</p>
                <p className="text-white font-medium">
                  ${Number(formatUnits(project.loanAmount, 6)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Time Remaining</p>
                <p className="text-white font-medium">
                  {Math.ceil(project.timeRemaining / 86400)} days
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-zinc-400">Risk Level</p>
                <Badge className={
                  project.riskLevel === 1 ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                  project.riskLevel === 2 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                  'bg-red-500/20 text-red-400 border-red-500/50'
                }>
                  {project.riskLevel === 1 ? 'Low' : project.riskLevel === 2 ? 'Medium' : 'High'}
                </Badge>
              </div>
              <div>
                <p className="text-zinc-400">Total Shares</p>
                <p className="text-white font-medium">{Number(project.totalShares).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-oga-green/30 text-oga-green hover:bg-oga-green/10"
            onClick={() => {
              if (isHighValue) {
                window.open(`https://sepolia.basescan.org/address/${project.vaultAddress}`, '_blank');
              }
            }}
          >
            <Info className="w-4 h-4 mr-2" />
            Details
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-oga-green hover:bg-oga-green/80 text-white"
            onClick={onInvestClick}
            disabled={isHighValue && project.isFundingClosed}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            {isHighValue && project.isFundingClosed ? 'Funding Closed' : 'Invest'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}