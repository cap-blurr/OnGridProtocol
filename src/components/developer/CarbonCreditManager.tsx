'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Leaf,
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  BarChart3,
  Coins,
  Shield,
  Info,
  ExternalLink,
  Loader2,
  Upload,
  FileText
} from 'lucide-react';
import { formatUnits } from 'viem';
import toast from 'react-hot-toast';

interface CarbonCreditData {
  projectId: number;
  totalCreditsGenerated: number;
  creditsTokenized: number;
  creditsAvailableToTokenize: number;
  currentCreditPrice: number;
  totalRevenue: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  lastVerificationDate: Date;
  energyGenerated: number;
  co2Offset: number;
  verificationDocuments: string[];
}

interface CarbonCreditManagerProps {
  projectIds?: number[];
  developerAddress?: `0x${string}`;
}

export default function CarbonCreditManager({ projectIds, developerAddress }: CarbonCreditManagerProps) {
  const { address: userAddress, isConnected } = useAccount();
  
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [creditData, setCreditData] = useState<CarbonCreditData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenizeAmount, setTokenizeAmount] = useState('');
  const [uploadingDocument, setUploadingDocument] = useState(false);

  // Fetch carbon credit data for projects
  const fetchCreditData = async () => {
    if (!projectIds || projectIds.length === 0) return;

    setIsLoading(true);
    const mockData: CarbonCreditData[] = [];

    for (const projectId of projectIds) {
      // Mock data - in reality this would come from contract calls and IPFS
      const creditData: CarbonCreditData = {
        projectId,
        totalCreditsGenerated: 1250.5,
        creditsTokenized: 800.0,
        creditsAvailableToTokenize: 450.5,
        currentCreditPrice: 45.50,
        totalRevenue: 56875.00,
        verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending',
        lastVerificationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        energyGenerated: 125000, // 125 MWh
        co2Offset: 87.5, // tonnes
        verificationDocuments: [
          'QmXYZ123...verification-report.pdf',
          'QmABC456...energy-data.json',
          'QmDEF789...audit-results.pdf'
        ]
      };

      mockData.push(creditData);
    }

    setCreditData(mockData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCreditData();
  }, [projectIds]);

  // Handle carbon credit tokenization
  const handleTokenizeCredits = async () => {
    if (!selectedProjectId || !tokenizeAmount) {
      toast.error('Please select a project and enter amount to tokenize');
      return;
    }

    const amount = parseFloat(tokenizeAmount);
    const projectData = creditData.find(p => p.projectId === selectedProjectId);
    
    if (!projectData) {
      toast.error('Project data not found');
      return;
    }

    if (amount > projectData.creditsAvailableToTokenize) {
      toast.error(`Cannot tokenize more than ${projectData.creditsAvailableToTokenize} available credits`);
      return;
    }

    try {
      setIsLoading(true);
      
      // In reality, this would call the CarbonCreditToken contract
      // tokenize(projectId, amount, metadataURI)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully tokenized ${amount} carbon credits!`);
      setTokenizeAmount('');
      await fetchCreditData(); // Refresh data
      
    } catch (error) {
      console.error('Tokenization error:', error);
      toast.error('Failed to tokenize carbon credits');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Carbon Credit Management</h1>
        <p className="text-xl text-zinc-400">Please connect your wallet to manage carbon credits.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Carbon Credit Management</h1>
          <p className="text-zinc-400">
            Monitor, verify, and tokenize your renewable energy carbon credits
          </p>
        </div>
        <div className="flex items-center gap-2 text-oga-green">
          <Leaf className="h-5 w-5" />
          <span className="text-sm font-medium">Total Credits: {creditData.reduce((sum, p) => sum + p.totalCreditsGenerated, 0).toFixed(1)} tCO₂</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-oga-green/20 rounded-lg">
                <Leaf className="h-5 w-5 text-oga-green" />
              </div>
              <div>
                <div className="text-sm text-zinc-400">Total Credits Generated</div>
                <div className="text-lg font-semibold text-white">
                  {creditData.reduce((sum, p) => sum + p.totalCreditsGenerated, 0).toFixed(1)} tCO₂
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Coins className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-zinc-400">Credits Tokenized</div>
                <div className="text-lg font-semibold text-white">
                  {creditData.reduce((sum, p) => sum + p.creditsTokenized, 0).toFixed(1)} tCO₂
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-oga-yellow/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-oga-yellow" />
              </div>
              <div>
                <div className="text-sm text-zinc-400">Total Revenue</div>
                <div className="text-lg font-semibold text-white">
                  ${creditData.reduce((sum, p) => sum + p.totalRevenue, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm text-zinc-400">Energy Generated</div>
                <div className="text-lg font-semibold text-white">
                  {(creditData.reduce((sum, p) => sum + p.energyGenerated, 0) / 1000).toFixed(1)} MWh
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Selection Cards */}
      {creditData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditData.map((project) => (
            <Card 
              key={project.projectId} 
              className={`bg-black/40 backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                selectedProjectId === project.projectId 
                  ? 'border-oga-green/60 ring-2 ring-oga-green/30' 
                  : 'border-oga-green/30 hover:border-oga-green/50'
              }`}
              onClick={() => setSelectedProjectId(project.projectId)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Project #{project.projectId}</span>
                  <Badge className={
                    project.verificationStatus === 'verified' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                    project.verificationStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                    'bg-red-500/20 text-red-400 border-red-500/50'
                  }>
                    {project.verificationStatus === 'verified' ? (
                      <><Shield className="h-3 w-3 mr-1" />Verified</>
                    ) : project.verificationStatus === 'pending' ? (
                      <><Clock className="h-3 w-3 mr-1" />Pending</>
                    ) : (
                      'Rejected'
                    )}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Credit Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Tokenization Progress</span>
                    <span className="text-white">
                      {((project.creditsTokenized / project.totalCreditsGenerated) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(project.creditsTokenized / project.totalCreditsGenerated) * 100} 
                    className="h-2 bg-zinc-800"
                  />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-zinc-400">Generated:</span>
                    <div className="text-oga-green font-medium">
                      {project.totalCreditsGenerated.toFixed(1)} tCO₂
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Available:</span>
                    <div className="text-white font-medium">
                      {project.creditsAvailableToTokenize.toFixed(1)} tCO₂
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Price:</span>
                    <div className="text-oga-yellow font-medium">
                      ${project.currentCreditPrice}/tCO₂
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Revenue:</span>
                    <div className="text-white font-medium">
                      ${project.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Energy and Impact */}
                <div className="p-2 bg-black/20 rounded border border-oga-green/20">
                  <div className="text-xs text-zinc-400 mb-1">Environmental Impact</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">{(project.energyGenerated / 1000).toFixed(1)} MWh</span>
                    <span className="text-oga-green">{project.co2Offset.toFixed(1)} tCO₂ offset</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Carbon Credit Interface */}
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="text-white">
            {selectedProjectId ? `Tokenize Credits - Project #${selectedProjectId}` : 'Select a Project'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedProjectId ? (
            <div className="text-center py-8">
              <Coins className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-lg font-semibold text-white mb-2">Credit Tokenization</h3>
              <p className="text-zinc-400">Select a project above to tokenize carbon credits.</p>
            </div>
          ) : (
            <>
              {creditData.find(p => p.projectId === selectedProjectId)?.verificationStatus !== 'verified' && (
                <Alert className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Credits must be verified before tokenization. Complete verification process first.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-zinc-400 text-sm">Available to Tokenize</span>
                  <div className="text-2xl font-bold text-oga-green">
                    {creditData.find(p => p.projectId === selectedProjectId)?.creditsAvailableToTokenize.toFixed(1)} tCO₂
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-zinc-400 text-sm">Current Price</span>
                  <div className="text-2xl font-bold text-oga-yellow">
                    ${creditData.find(p => p.projectId === selectedProjectId)?.currentCreditPrice}/tCO₂
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenizeAmount" className="text-zinc-300">
                  Amount to Tokenize (tCO₂)
                </Label>
                <div className="relative">
                  <Leaf className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="tokenizeAmount"
                    type="number"
                    step="0.1"
                    value={tokenizeAmount}
                    onChange={(e) => setTokenizeAmount(e.target.value)}
                    placeholder="Enter amount to tokenize"
                    className="pl-10 bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                    max={creditData.find(p => p.projectId === selectedProjectId)?.creditsAvailableToTokenize}
                  />
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Max: {creditData.find(p => p.projectId === selectedProjectId)?.creditsAvailableToTokenize.toFixed(1)} tCO₂</span>
                  {tokenizeAmount && (
                    <span>Estimated Revenue: ${(parseFloat(tokenizeAmount) * (creditData.find(p => p.projectId === selectedProjectId)?.currentCreditPrice || 0)).toFixed(2)}</span>
                  )}
                </div>
              </div>

              <Button
                onClick={handleTokenizeCredits}
                disabled={
                  isLoading || 
                  !tokenizeAmount || 
                  parseFloat(tokenizeAmount) <= 0 ||
                  parseFloat(tokenizeAmount) > (creditData.find(p => p.projectId === selectedProjectId)?.creditsAvailableToTokenize || 0) ||
                  creditData.find(p => p.projectId === selectedProjectId)?.verificationStatus !== 'verified'
                }
                className="w-full bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tokenizing Credits...
                  </>
                ) : (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Tokenize {tokenizeAmount || '0'} tCO₂
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 