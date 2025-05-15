"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove } from "@/hooks/contracts/useUSDC";
import { useInvestInVault } from "@/hooks/contracts/useDirectProjectVault";
import { DollarSign, AlertCircle, Check, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

enum InvestmentStep {
  AMOUNT = 0,
  APPROVE = 1,
  INVEST = 2,
  COMPLETE = 3
}

interface InvestmentFormProps {
  vaultAddress: string;
  projectName: string;
  totalFunding: string;
  currentFunding: string;
  fundingPercentage: number;
  isFundingClosed: boolean;
  onInvestmentComplete?: () => void;
}

export default function InvestmentForm({
  vaultAddress,
  projectName,
  totalFunding,
  currentFunding,
  fundingPercentage,
  isFundingClosed,
  onInvestmentComplete
}: InvestmentFormProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<InvestmentStep>(InvestmentStep.AMOUNT);
  
  const { address: investorAddress } = useAccount();
  
  // Get investor's USDC balance
  const { balance: usdcBalance, formattedBalance: formattedUsdcBalance, refetch: refetchBalance } = 
    useUSDCBalance(investorAddress);
  
  // Get USDC allowance for the vault
  const { allowance: usdcAllowance, formattedAllowance, refetch: refetchAllowance } = 
    useUSDCAllowance(investorAddress, vaultAddress as `0x${string}`);
  
  // USDC approve function
  const { approve, isLoading: isApproving, isSuccess: isApproveSuccess } = useUSDCApprove();
  
  // Invest function
  const { invest, isLoading: isInvesting, isSuccess: isInvestSuccess } = useInvestInVault(vaultAddress as `0x${string}`);

  // Move to next step when approval succeeds
  useEffect(() => {
    if (isApproveSuccess && currentStep === InvestmentStep.APPROVE) {
      refetchAllowance();
      setCurrentStep(InvestmentStep.INVEST);
    }
  }, [isApproveSuccess, currentStep, refetchAllowance]);

  // Move to completion step when investment succeeds
  useEffect(() => {
    if (isInvestSuccess && currentStep === InvestmentStep.INVEST) {
      setCurrentStep(InvestmentStep.COMPLETE);
      if (onInvestmentComplete) {
        onInvestmentComplete();
      }
    }
  }, [isInvestSuccess, currentStep, onInvestmentComplete]);

  // Handle form submission - validate amount
  const handleAmountSubmit = () => {
    try {
      // Basic validation
      if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
        toast.error("Please enter a valid investment amount");
        return;
      }
      
      // Check if amount exceeds remaining funding needed
      const remainingFunding = parseFloat(totalFunding) - parseFloat(currentFunding);
      if (parseFloat(investmentAmount) > remainingFunding) {
        toast.error(`Investment amount exceeds remaining funding needed (${remainingFunding} USDC)`);
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
        setCurrentStep(InvestmentStep.APPROVE);
      } else {
        // Already approved, proceed to invest
        setCurrentStep(InvestmentStep.INVEST);
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
      vaultAddress as `0x${string}`, 
      investmentAmount
    );
  };

  // Handle investment
  const handleInvest = () => {
    if (!investorAddress) {
      toast.error("Wallet not connected");
      return;
    }
    
    invest(investmentAmount);
  };

  // Reset the form to start over
  const handleReset = () => {
    setInvestmentAmount("");
    setCurrentStep(InvestmentStep.AMOUNT);
  };

  // Disable the form if funding is closed
  if (isFundingClosed) {
    return (
      <Card className="bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-black backdrop-blur-sm border-zinc-800/50">
        <CardHeader>
          <CardTitle className="text-zinc-300">Investment Closed</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-yellow-900/30 border-yellow-700 text-yellow-300">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Funding Closed</AlertTitle>
            <AlertDescription>
              This project has reached its funding target and is no longer accepting investments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case InvestmentStep.AMOUNT:
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
                <span className="text-zinc-400">Remaining Funding Needed:</span>
                <span className="text-white">{(parseFloat(totalFunding) - parseFloat(currentFunding)).toFixed(2)} USDC</span>
              </div>
              
              <Alert className="bg-blue-900/30 border-blue-700 text-blue-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Enter the amount of USDC you wish to invest in this project. Your investment will be locked until the project repays the loan.
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
        
      case InvestmentStep.APPROVE:
        return (
          <>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-900/30 border-yellow-700 text-yellow-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertTitle>USDC Approval Required</AlertTitle>
                <AlertDescription>
                  You need to approve the vault contract to spend your USDC.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 border border-zinc-800 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Amount to Approve:</span>
                  <span className="text-white">{investmentAmount} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Project Vault:</span>
                  <span className="text-white truncate max-w-[200px]">{vaultAddress}</span>
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
        
      case InvestmentStep.INVEST:
        return (
          <>
            <CardContent className="space-y-4">
              <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300">
                <Check className="h-4 w-4 mr-2" />
                <AlertTitle>Ready to Invest</AlertTitle>
                <AlertDescription>
                  Your USDC is approved. You can now invest in this project.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 border border-zinc-800 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Project:</span>
                  <span className="text-white">{projectName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Investment Amount:</span>
                  <span className="text-white">{investmentAmount} USDC</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleInvest}
                disabled={isInvesting}
              >
                {isInvesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Investing...
                  </>
                ) : (
                  <>
                    Confirm Investment
                  </>
                )}
              </Button>
            </CardContent>
          </>
        );
        
      case InvestmentStep.COMPLETE:
        return (
          <>
            <CardContent className="space-y-4">
              <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300">
                <Check className="h-4 w-4 mr-2" />
                <AlertTitle>Investment Successful!</AlertTitle>
                <AlertDescription>
                  You have successfully invested {investmentAmount} USDC in this project.
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-4">
                <p className="text-zinc-300 mb-4">
                  Thank you for supporting renewable energy projects. You will receive returns as the project makes repayments.
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
      <CardHeader>
        <CardTitle className="text-white">Invest in this Project</CardTitle>
      </CardHeader>
      {renderStepContent()}
    </Card>
  );
} 