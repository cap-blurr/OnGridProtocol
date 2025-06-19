import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sun, 
  ArrowRight, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Check, 
  Loader2,
  CreditCard,
  ExternalLink,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { formatUnits } from 'viem';
import toast from 'react-hot-toast';

// Import hooks
import { OnChainProject } from '@/hooks/contracts/useDeveloperProjects';
import { useGetProjectPaymentSummary, useRepay } from '@/hooks/contracts/useRepaymentRouter';
import { useGetNextPaymentInfo } from '@/hooks/contracts/useFeeRouter';
import { useVaultDetails } from '@/hooks/contracts/useDirectProjectVault';
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove } from '@/hooks/contracts/useUSDC';
import { useContractAddresses } from '@/hooks/contracts/useDeveloperRegistry';

interface ProjectDetailsCardProps {
  project: OnChainProject;
  onRefresh?: () => void;
}

export default function ProjectDetailsCard({ project, onRefresh }: ProjectDetailsCardProps) {
  const { address: userAddress } = useAccount();
  const addresses = useContractAddresses();
  const [repaymentAmount, setRepaymentAmount] = useState('');

  // Get project payment summary
  const { 
    formattedTotalRepaid, 
    lastPaymentTimestamp, 
    formattedPaymentCount,
    isLoading: isLoadingPayments 
  } = useGetProjectPaymentSummary(parseInt(project.id));

  // Get next payment info
  const { 
    dueDate, 
    amount: nextPaymentAmount, 
    formattedAmount: formattedNextPayment,
    isLoading: isLoadingNextPayment 
  } = useGetNextPaymentInfo(parseInt(project.id));

  // Get vault details for high-value projects
  const { 
    totalAssetsInvested, 
    isFundingClosed, 
    fundingPercentage,
    formattedTotalAssetsInvested,
    formattedLoanAmount 
  } = useVaultDetails(project.vaultAddress || '0x0');

  // USDC related hooks for repayment
  const { formattedBalance: usdcBalance } = useUSDCBalance(userAddress);
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance(
    userAddress, 
    addresses.repaymentRouter as `0x${string}`
  );
  const { approve, isLoading: isApproving } = useUSDCApprove();
  const { repay, isLoading: isRepaying } = useRepay();

  // Check if approval is needed for repayment
  const needsApproval = repaymentAmount && parseFloat(repaymentAmount) > 0 && 
    allowance && parseFloat(repaymentAmount) > parseFloat(formatUnits(allowance, 6));

  const handleApprove = () => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      toast.error('Please enter a valid repayment amount');
      return;
    }
    approve(addresses.repaymentRouter as `0x${string}`, repaymentAmount);
  };

  const handleRepay = () => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      toast.error('Please enter a valid repayment amount');
      return;
    }
    repay(parseInt(project.id), repaymentAmount);
    setRepaymentAmount('');
  };

  // Calculate project state based on integration guide
  const getProjectState = () => {
    if (project.isLowValue) {
      return project.lowValueSuccess ? 'Active (Pool Funded)' : 'Pending Pool Funding';
    } else {
      if (isFundingClosed) {
        return 'Active (Fully Funded)';
      }
      return fundingPercentage >= 100 ? 'Funding Complete' : 'Funding Open';
    }
  };

  const getStateColor = () => {
    const state = getProjectState();
    if (state.includes('Active')) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (state.includes('Pending')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    if (state.includes('Funding')) return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  return (
    <div className="space-y-6">
      {/* Project Overview Card */}
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Sun className="w-6 h-6 text-oga-yellow" />
              {project.metadata?.name || `Project #${project.id}`}
            </CardTitle>
            <Badge className={getStateColor()}>
              {getProjectState()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-400">
            {project.metadata?.description || 'No description available.'}
          </p>
          
          {/* Project Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 border border-oga-green/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-oga-green" />
                <span className="text-sm text-zinc-400">Loan Amount</span>
              </div>
              <div className="text-lg font-semibold text-white">
                ${project.isLowValue ? Number(project.loanAmount).toLocaleString() : formattedLoanAmount}
              </div>
            </div>
            
            {!project.isLowValue && (
              <div className="bg-black/20 border border-oga-green/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-oga-green" />
                  <span className="text-sm text-zinc-400">Funding Progress</span>
                </div>
                <div className="text-lg font-semibold text-oga-green">
                  {fundingPercentage.toFixed(1)}%
                </div>
                <Progress value={fundingPercentage} className="h-2 mt-2" />
              </div>
            )}
            
            <div className="bg-black/20 border border-oga-green/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-oga-green" />
                <span className="text-sm text-zinc-400">Total Repaid</span>
              </div>
              <div className="text-lg font-semibold text-white">
                ${formattedTotalRepaid}
              </div>
            </div>
            
            <div className="bg-black/20 border border-oga-green/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-oga-green" />
                <span className="text-sm text-zinc-400">Payments Made</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {formattedPaymentCount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repayment Management */}
      <Tabs defaultValue="repayment" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/20">
          <TabsTrigger value="repayment" className="data-[state=active]:bg-oga-green/20">
            Make Repayment
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-oga-green/20">
            Payment History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="repayment" className="mt-4">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-oga-green" />
                Loan Repayment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Next Payment Info */}
              {!isLoadingNextPayment && formattedNextPayment && (
                <Alert className="bg-oga-yellow/20 border-oga-yellow/50 text-oga-yellow">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Next Payment Due</AlertTitle>
                  <AlertDescription>
                    Amount: ${formattedNextPayment} USDC
                    {dueDate && (
                      <span className="block">
                        Due: {new Date(Number(dueDate) * 1000).toLocaleDateString()}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Repayment Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="repayment-amount" className="text-zinc-300">
                    Repayment Amount (USDC)
                  </Label>
                  <Input
                    id="repayment-amount"
                    type="number"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(e.target.value)}
                    placeholder="Enter amount to repay"
                    className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                    step="0.000001"
                    min="0"
                  />
                  <p className="text-sm text-zinc-400 mt-1">
                    Available Balance: {usdcBalance} USDC
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {needsApproval && (
                    <Button
                      onClick={handleApprove}
                      disabled={isApproving || !repaymentAmount}
                      className="bg-gradient-to-r from-oga-yellow to-oga-yellow-light hover:from-oga-yellow-dark hover:to-oga-yellow text-black font-semibold"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        'Approve USDC'
                      )}
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleRepay}
                    disabled={isRepaying || needsApproval || !repaymentAmount}
                    className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white font-semibold"
                  >
                    {isRepaying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Make Repayment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader>
              <CardTitle className="text-white">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPayments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-oga-green" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-400">Total Repaid:</span>
                      <div className="text-white font-medium">${formattedTotalRepaid}</div>
                    </div>
                    <div>
                      <span className="text-zinc-400">Payment Count:</span>
                      <div className="text-white font-medium">{formattedPaymentCount}</div>
                    </div>
                  </div>
                  
                  {lastPaymentTimestamp > 0 && (
                    <div>
                      <span className="text-zinc-400 text-sm">Last Payment:</span>
                      <div className="text-white">
                        {new Date(lastPaymentTimestamp).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {project.vaultAddress && (
              <Button
                variant="outline"
                className="border-oga-green/30 text-oga-green hover:bg-oga-green/10"
                onClick={() => window.open(`https://sepolia.basescan.org/address/${project.vaultAddress}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Vault Contract
              </Button>
            )}
            
            {project.poolId && (
              <Button
                variant="outline"
                className="border-oga-green/30 text-oga-green hover:bg-oga-green/10"
              >
                <Zap className="w-4 h-4 mr-2" />
                Pool ID: {project.poolId}
              </Button>
            )}
            
            <Button
              variant="outline"
              className="border-oga-green/30 text-oga-green hover:bg-oga-green/10"
              onClick={onRefresh}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}