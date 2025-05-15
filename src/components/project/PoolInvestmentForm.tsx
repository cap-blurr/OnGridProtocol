"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove } from "@/hooks/contracts/useUSDC";
import { useDepositToPool, useUserShares } from "@/hooks/contracts/useLiquidityPoolManager";
import { DollarSign, AlertCircle, Check, Loader2, ArrowRight, Shield, Percent } from "lucide-react";
import toast from "react-hot-toast";
import { useContractAddresses } from "@/hooks/contracts/useDeveloperRegistry";

enum PoolInvestmentStep {
  AMOUNT = 0,
  APPROVE = 1,
  INVEST = 2,
  COMPLETE = 3
}

interface PoolInvestmentFormProps {
  poolId: number;
  poolName: string;
  riskLevel: string;
  aprPercentage: number;
  totalAssets: string;
  onInvestmentComplete?: () => void;
}

export default function PoolInvestmentForm({
  poolId,
  poolName,
  riskLevel,
  aprPercentage,
  totalAssets,
  onInvestmentComplete
}: PoolInvestmentFormProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<PoolInvestmentStep>(PoolInvestmentStep.AMOUNT);
  
  const { address: investorAddress } = useAccount();
  const addresses = useContractAddresses();
  
  // Get investor's USDC balance
  const { balance: usdcBalance, formattedBalance: formattedUsdcBalance, refetch: refetchBalance } = 
    useUSDCBalance(investorAddress);
  
  // Get USDC allowance for the LiquidityPoolManager
  const { allowance: usdcAllowance, formattedAllowance, refetch: refetchAllowance } = 
    useUSDCAllowance(investorAddress, addresses.liquidityPoolManagerProxy as `0x${string}`);
  
  // USDC approve function
  const { approve, isLoading: isApproving, isSuccess: isApproveSuccess } = useUSDCApprove();
  
  // Deposit to pool function
  const { deposit, isLoading: isDepositing, isSuccess: isDepositSuccess } = useDepositToPool(poolId);

  // User's current shares in this pool
  const { shares: currentShares } = useUserShares(poolId, investorAddress);

  // Move to next step when approval succeeds
  useEffect(() => {
    if (isApproveSuccess && currentStep === PoolInvestmentStep.APPROVE) {
      refetchAllowance();
      setCurrentStep(PoolInvestmentStep.INVEST);
    }
  }, [isApproveSuccess, currentStep, refetchAllowance]);

  // Move to completion step when deposit succeeds
  useEffect(() => {
    if (isDepositSuccess && currentStep === PoolInvestmentStep.INVEST) {
      setCurrentStep(PoolInvestmentStep.COMPLETE);
      if (onInvestmentComplete) {
        onInvestmentComplete();
      }
    }
  }, [isDepositSuccess, currentStep, onInvestmentComplete]);

  // Handle form submission - validate amount
  const handleAmountSubmit = () => {
    try {
      // Basic validation
      if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
        toast.error("Please enter a valid investment amount");
        return;
      }
      
      // Check if USDC balance is sufficient
      if (usdcBalance && parseFloat(investmentAmount) > parseFloat(formattedUsdcBalance)) {
        toast.error(`Insufficient USDC balance. You have ${formattedUsdcBalance} USDC.`);
        return;
      }
      
      // Check if approval is needed
      if (usdcAllowance && parseFloat(investmentAmount) > parseFloat(formattedAllowance)) {
        // Need to approve
        setCurrentStep(PoolInvestmentStep.APPROVE);
      } else {
        // Already approved, proceed to invest
        setCurrentStep(PoolInvestmentStep.INVEST);
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      toast.error("Invalid input values. Please check and try again.");
    }
  };

  // Handle USDC approval
  const handleApprove = () => {
    if (!investorAddress) {
      toast.error("Wallet not connected");
      return;
    }
    
    // Approve exact amount
    approve(
      addresses.liquidityPoolManagerProxy as `0x${string}`, 
      investmentAmount
    );
  };

  // Handle deposit to pool
  const handleDeposit = () => {
    if (!investorAddress) {
      toast.error("Wallet not connected");
      return;
    }
    
    deposit(investmentAmount);
  };

  // Reset the form to start over
  const handleReset = () => {
    setInvestmentAmount("");
    setCurrentStep(PoolInvestmentStep.AMOUNT);
  };

  // Get risk level badge color
  const getRiskLevelColor = () => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return "border-green-600 text-green-500 bg-green-900/20";
      case 'medium-low':
        return "border-emerald-600 text-emerald-500 bg-emerald-900/20";
      case 'medium':
        return "border-yellow-600 text-yellow-500 bg-yellow-900/20";
      case 'high':
        return "border-red-600 text-red-500 bg-red-900/20";
      default:
        return "border-blue-600 text-blue-500 bg-blue-900/20";
    }
  };

  // Content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case PoolInvestmentStep.AMOUNT:
        return (
          <>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investmentAmount" className="text-zinc-300">Investment Amount (USDC)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="investmentAmount" 
                    value={investmentAmount} 
                    onChange={(e) => setInvestmentAmount(e.target.value)} 
                    type="number"
                    step="0.000001"
                    min="0"
                    placeholder="Enter amount to invest" 
                    className="h-10 pl-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Your USDC Balance:</span>
                <span className="text-white">{formattedUsdcBalance} USDC</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Pool Total Assets:</span>
                <span className="text-white">{totalAssets} USDC</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Your Current Pool Shares:</span>
                <span className="text-white">{currentShares?.toString() || '0'}</span>
              </div>
              
              <Alert className="bg-blue-900/30 border-blue-700 text-blue-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  This pool supports low-value projects and has a risk level of {riskLevel}. Expected APR: {aprPercentage.toFixed(2)}%.
                </AlertDescription>
              </Alert>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-4">
              <Button 
                onClick={handleAmountSubmit} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Continue
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardFooter>
          </>
        );
        
      case PoolInvestmentStep.APPROVE:
        return (
          <>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-900/30 border-yellow-700 text-yellow-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertTitle>USDC Approval Required</AlertTitle>
                <AlertDescription>
                  You need to approve the LiquidityPoolManager contract to spend your USDC.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 border border-zinc-800 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Amount to Approve:</span>
                  <span className="text-white">{investmentAmount} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Contract to Approve:</span>
                  <span className="text-white truncate max-w-[200px]">{addresses.liquidityPoolManagerProxy}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    Approve USDC
                  </>
                )}
              </Button>
            </CardContent>
          </>
        );
        
      case PoolInvestmentStep.INVEST:
        return (
          <>
            <CardContent className="space-y-4">
              <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300">
                <Check className="h-4 w-4 mr-2" />
                <AlertTitle>Ready to Invest</AlertTitle>
                <AlertDescription>
                  Your USDC is approved. You can now invest in this liquidity pool.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 border border-zinc-800 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Pool Name:</span>
                  <span className="text-white">{poolName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Risk Level:</span>
                  <span className="text-white">{riskLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">APR:</span>
                  <span className="text-white">{aprPercentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Investment Amount:</span>
                  <span className="text-white">{investmentAmount} USDC</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleDeposit}
                disabled={isDepositing}
              >
                {isDepositing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Depositing...
                  </>
                ) : (
                  <>
                    Confirm Deposit
                  </>
                )}
              </Button>
            </CardContent>
          </>
        );
        
      case PoolInvestmentStep.COMPLETE:
        return (
          <>
            <CardContent className="space-y-4">
              <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300">
                <Check className="h-4 w-4 mr-2" />
                <AlertTitle>Investment Successful!</AlertTitle>
                <AlertDescription>
                  You have successfully invested {investmentAmount} USDC in {poolName}.
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-4">
                <p className="text-zinc-300 mb-4">
                  Your funds are now part of the liquidity pool and will generate returns as they are used to fund low-value renewable energy projects.
                </p>
                <Button 
                  onClick={handleReset}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Make Another Investment
                </Button>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <Card className="bg-gradient-to-br from-zinc-950 via-emerald-950/30 to-black backdrop-blur-sm border-emerald-900/20">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" />
          Invest in Pool
        </CardTitle>
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-emerald-500" />
          <span className="text-emerald-500 font-medium">{aprPercentage.toFixed(2)}% APR</span>
        </div>
      </CardHeader>
      {renderStepContent()}
    </Card>
  );
} 