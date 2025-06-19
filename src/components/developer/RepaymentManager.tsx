'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Calendar,
  Clock,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  CreditCard,
  History,
  Calculator,
  ExternalLink,
  Loader2,
  ArrowRight,
  Target,
  Receipt,
  Info
} from 'lucide-react';
import { formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';

// Import hooks following integration guide
import { useRepay, useGetProjectPaymentSummary } from '@/hooks/contracts/useRepaymentRouter';
import { useGetNextPaymentInfo as useFeeRouterNextPayment } from '@/hooks/contracts/useFeeRouter';
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove } from '@/hooks/contracts/useUSDC';
import { useContractAddresses } from '@/hooks/contracts/useDeveloperRegistry';
import { useRepaymentEvents } from '@/hooks/contracts/useContractEvents';

interface ProjectRepaymentData {
  projectId: number;
  totalRepaid: bigint;
  lastPayment: bigint;
  paymentCount: number;
  nextPaymentDue: bigint;
  nextPaymentAmount: bigint;
  outstandingBalance: bigint;
  loanAmount: bigint;
  interestRate: number;
  projectState: number;
}

interface RepaymentManagerProps {
  developerAddress?: `0x${string}`;
  projectIds?: number[];
}

export default function RepaymentManager({ developerAddress, projectIds }: RepaymentManagerProps) {
  const { address: userAddress, isConnected } = useAccount();
  const addresses = useContractAddresses();
  
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [isCalculatingPayment, setIsCalculatingPayment] = useState(false);
  const [projectRepaymentData, setProjectRepaymentData] = useState<ProjectRepaymentData[]>([]);

  // Get USDC balance and allowance
  const { formattedBalance: usdcBalance, refetch: refetchBalance } = useUSDCBalance(userAddress);
  const { allowance: usdcAllowance, refetch: refetchAllowance } = useUSDCAllowance(
    userAddress, 
    addresses.repaymentRouter as `0x${string}`
  );

  // USDC approval and repayment hooks
  const { approve, isLoading: isApproving, isSuccess: isApproveSuccess } = useUSDCApprove();
  const { repay, isLoading: isRepaying, isSuccess: isRepaySuccess } = useRepay();

  // Get repayment events for this developer
  const { events: repaymentEvents } = useRepaymentEvents();

  // Update allowance after approval
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
      toast.success('USDC approval successful!');
    }
  }, [isApproveSuccess, refetchAllowance]);

  // Handle successful repayment
  useEffect(() => {
    if (isRepaySuccess) {
      refetchBalance();
      setRepaymentAmount('');
      toast.success('Loan repayment successful!');
      // Refresh project data
      fetchProjectData();
    }
  }, [isRepaySuccess, refetchBalance]);

  // Fetch project repayment data
  const fetchProjectData = async () => {
    if (!projectIds || projectIds.length === 0) return;

    const projectData: ProjectRepaymentData[] = [];

    for (const projectId of projectIds) {
      try {
        // This would use actual contract hooks to get repayment data
        // For now, we'll use placeholder data structure
        const repaymentData: ProjectRepaymentData = {
          projectId,
          totalRepaid: BigInt(25000 * 10**6), // $25,000 repaid
          lastPayment: BigInt(5000 * 10**6), // Last payment $5,000
          paymentCount: 5,
          nextPaymentDue: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          nextPaymentAmount: BigInt(5000 * 10**6), // $5,000 due
          outstandingBalance: BigInt(75000 * 10**6), // $75,000 remaining
          loanAmount: BigInt(100000 * 10**6), // $100,000 total loan
          interestRate: 12, // 12% APR
          projectState: 2 // Active state
        };

        projectData.push(repaymentData);
      } catch (error) {
        console.error(`Error fetching repayment data for project ${projectId}:`, error);
      }
    }

    setProjectRepaymentData(projectData);
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectIds]);

  // Check if approval is needed
  const needsApproval = () => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) return false;
    const amount = parseUnits(repaymentAmount, 6);
    return !usdcAllowance || amount > usdcAllowance;
  };

  // Handle USDC approval
  const handleApprove = () => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      toast.error('Please enter a valid repayment amount');
      return;
    }
    
    approve(addresses.repaymentRouter as `0x${string}`, repaymentAmount);
  };

  // Handle loan repayment
  const handleRepayment = () => {
    if (!selectedProjectId) {
      toast.error('Please select a project to repay');
      return;
    }

    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      toast.error('Please enter a valid repayment amount');
      return;
    }

    repay(selectedProjectId, repaymentAmount);
  };

  // Calculate payment breakdown
  const calculatePaymentBreakdown = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return null;

    const total = parseFloat(amount);
    // Mock fee calculation - in reality this would come from FeeRouter
    const feePercentage = 2.5; // 2.5% fee
    const feeAmount = total * (feePercentage / 100);
    const principalAmount = total - feeAmount;
    const interestAmount = total * 0.1; // Mock interest calculation

    return {
      total,
      feeAmount,
      principalAmount,
      interestAmount,
      feePercentage
    };
  };

  const paymentBreakdown = calculatePaymentBreakdown(repaymentAmount);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Loan Repayment Manager</h1>
        <p className="text-xl text-gray-300">Please connect your wallet to manage loan repayments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Loan Repayment Manager</h1>
          <p className="text-zinc-400">
            Manage your solar project loan repayments and track payment history
          </p>
        </div>
        <div className="flex items-center gap-2 text-oga-green">
          <CreditCard className="h-5 w-5" />
          <span className="text-sm font-medium">USDC Balance: {usdcBalance}</span>
        </div>
      </div>

      {/* Project Overview Cards */}
      {projectRepaymentData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectRepaymentData.map((project) => (
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
                    project.projectState === 2 ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                    project.projectState === 3 ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                  }>
                    {project.projectState === 2 ? 'Active' : 
                     project.projectState === 3 ? 'Completed' : 'Pending'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Repayment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Repayment Progress</span>
                    <span className="text-white">
                      {((Number(formatUnits(project.totalRepaid, 6)) / Number(formatUnits(project.loanAmount, 6))) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(Number(formatUnits(project.totalRepaid, 6)) / Number(formatUnits(project.loanAmount, 6))) * 100} 
                    className="h-2 bg-zinc-800"
                  />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-zinc-400">Total Repaid:</span>
                    <div className="text-oga-green font-medium">
                      ${Number(formatUnits(project.totalRepaid, 6)).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Outstanding:</span>
                    <div className="text-white font-medium">
                      ${Number(formatUnits(project.outstandingBalance, 6)).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Next Payment:</span>
                    <div className="text-oga-yellow font-medium">
                      ${Number(formatUnits(project.nextPaymentAmount, 6)).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Due Date:</span>
                    <div className="text-white font-medium">
                      {new Date(Number(project.nextPaymentDue)).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Urgency Indicator */}
                {Number(project.nextPaymentDue) < Date.now() + 7 * 24 * 60 * 60 * 1000 && (
                  <Alert className="bg-oga-yellow/20 border-oga-yellow/50 text-oga-yellow">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>Payment due within 7 days</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Repayment Interface */}
      <Tabs defaultValue="repay" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-black/20">
          <TabsTrigger value="repay" className="data-[state=active]:bg-oga-green/20">
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-oga-green/20">
            <History className="h-4 w-4 mr-2" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="calculator" className="data-[state=active]:bg-oga-green/20">
            <Calculator className="h-4 w-4 mr-2" />
            Payment Calculator
          </TabsTrigger>
        </TabsList>

        {/* Make Payment Tab */}
        <TabsContent value="repay" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
            <CardHeader>
              <CardTitle className="text-white">Make Loan Repayment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Selection */}
              {!selectedProjectId && (
                <Alert className="bg-blue-500/20 border-blue-500/50 text-blue-400">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Please select a project from the cards above to make a repayment.
                  </AlertDescription>
                </Alert>
              )}

              {selectedProjectId && (
                <>
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="repaymentAmount" className="text-zinc-300">
                      Repayment Amount (USDC)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="repaymentAmount"
                        type="number"
                        step="0.000001"
                        value={repaymentAmount}
                        onChange={(e) => setRepaymentAmount(e.target.value)}
                        placeholder="Enter repayment amount"
                        className="pl-10 bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-zinc-400">
                      <span>Available: {usdcBalance} USDC</span>
                      <span>
                        Suggested: ${Number(formatUnits(
                          projectRepaymentData.find(p => p.projectId === selectedProjectId)?.nextPaymentAmount || BigInt(0), 
                          6
                        )).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  {paymentBreakdown && (
                    <Card className="bg-black/20 border border-oga-green/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">Payment Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Total Payment:</span>
                            <span className="text-white font-medium">${paymentBreakdown.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Principal:</span>
                            <span className="text-oga-green font-medium">${paymentBreakdown.principalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Protocol Fee ({paymentBreakdown.feePercentage}%):</span>
                            <span className="text-oga-yellow font-medium">${paymentBreakdown.feeAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Interest:</span>
                            <span className="text-blue-400 font-medium">${paymentBreakdown.interestAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {needsApproval() && (
                      <Button
                        onClick={handleApprove}
                        disabled={isApproving || !repaymentAmount || parseFloat(repaymentAmount) <= 0}
                        className="flex-1 bg-gradient-to-r from-oga-yellow to-oga-yellow-light hover:from-oga-yellow-dark hover:to-oga-yellow text-black font-semibold"
                      >
                        {isApproving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            Approve USDC
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleRepayment}
                      disabled={
                        isRepaying || 
                        needsApproval() || 
                        !repaymentAmount || 
                        parseFloat(repaymentAmount) <= 0 ||
                        !selectedProjectId
                      }
                      className="flex-1 bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white font-semibold"
                    >
                      {isRepaying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Make Payment
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-4">
          <PaymentHistory 
            repaymentEvents={repaymentEvents}
            developerAddress={developerAddress}
          />
        </TabsContent>

        {/* Payment Calculator Tab */}
        <TabsContent value="calculator" className="space-y-4">
          <PaymentCalculator
            projectData={projectRepaymentData.find(p => p.projectId === selectedProjectId)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Payment History Component
interface PaymentHistoryProps {
  repaymentEvents: any[];
  developerAddress?: `0x${string}`;
}

function PaymentHistory({ repaymentEvents, developerAddress }: PaymentHistoryProps) {
  const developerEvents = repaymentEvents.filter(event => 
    event.data?.payer?.toLowerCase() === developerAddress?.toLowerCase()
  );

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
      <CardHeader>
        <CardTitle className="text-white">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {developerEvents.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-semibold text-white mb-2">No Payment History</h3>
            <p className="text-zinc-400">Your loan repayments will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {developerEvents.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-oga-green/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-oga-green" />
                  <div>
                    <div className="text-white font-medium">
                      Project #{event.data?.projectId || 'Unknown'}
                    </div>
                    <div className="text-zinc-400 text-sm">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-oga-green font-medium">
                    ${Number(formatUnits(event.data?.totalAmountRepaid || BigInt(0), 6)).toLocaleString()}
                  </div>
                  <button
                    onClick={() => window.open(`https://sepolia.basescan.org/tx/${event.transactionHash}`, '_blank')}
                    className="text-zinc-400 hover:text-oga-green text-sm flex items-center gap-1"
                  >
                    View Tx <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Payment Calculator Component
interface PaymentCalculatorProps {
  projectData?: ProjectRepaymentData;
}

function PaymentCalculator({ projectData }: PaymentCalculatorProps) {
  const [calculatorAmount, setCalculatorAmount] = useState('');

  if (!projectData) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardContent className="py-12 text-center">
          <Calculator className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
          <h3 className="text-lg font-semibold text-white mb-2">Payment Calculator</h3>
          <p className="text-zinc-400">Select a project to calculate payment details.</p>
        </CardContent>
      </Card>
    );
  }

  const monthlyPayment = Number(formatUnits(projectData.nextPaymentAmount, 6));
  const outstandingBalance = Number(formatUnits(projectData.outstandingBalance, 6));
  const remainingPayments = Math.ceil(outstandingBalance / monthlyPayment);

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
      <CardHeader>
        <CardTitle className="text-white">Payment Calculator - Project #{projectData.projectId}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Loan Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-zinc-400 text-sm">Outstanding Balance</span>
            <div className="text-2xl font-bold text-white">
              ${outstandingBalance.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-zinc-400 text-sm">Monthly Payment</span>
            <div className="text-2xl font-bold text-oga-green">
              ${monthlyPayment.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-zinc-400 text-sm">Interest Rate</span>
            <div className="text-xl font-bold text-blue-400">
              {projectData.interestRate}% APR
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-zinc-400 text-sm">Remaining Payments</span>
            <div className="text-xl font-bold text-oga-yellow">
              ~{remainingPayments} months
            </div>
          </div>
        </div>

        {/* Payment Scenarios */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Payment Scenarios</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-black/20 border border-oga-green/20">
              <CardContent className="p-4">
                <h5 className="text-oga-green font-medium mb-2">Minimum Payment</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <span className="text-white">${monthlyPayment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Time to payoff:</span>
                    <span className="text-white">{remainingPayments} months</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border border-oga-green/20">
              <CardContent className="p-4">
                <h5 className="text-oga-green font-medium mb-2">Double Payment</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount:</span>
                    <span className="text-white">${(monthlyPayment * 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Time to payoff:</span>
                    <span className="text-white">{Math.ceil(remainingPayments / 2)} months</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 