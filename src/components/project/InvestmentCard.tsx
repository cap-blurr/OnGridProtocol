'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight } from 'lucide-react';
import { parseUnits } from 'ethers';
import toast from 'react-hot-toast';

// Import custom hooks
import { useVaultDetails, useInvestInVault } from '@/hooks/contracts/useDirectProjectVault';
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove, isApprovalNeeded, USDC_DECIMALS } from '@/hooks/contracts/useUSDC';

export interface InvestmentCardProps {
  id: string;
  vaultAddress: `0x${string}`;
  developerAddress: string;
}

export function InvestmentCard({ id, vaultAddress, developerAddress }: InvestmentCardProps) {
  const [investAmount, setInvestAmount] = useState('');
  const [needsApproval, setNeedsApproval] = useState(true);
  const { address, isConnected } = useAccount();
  
  // Get vault information
  const {
    loanAmount,
    totalAssetsInvested,
    isFundingClosed,
    fundingPercentage,
    formattedLoanAmount,
    formattedTotalAssetsInvested
  } = useVaultDetails(vaultAddress);
  
  // Get USDC balance
  const { formattedBalance, refetch: refetchBalance } = useUSDCBalance(address);
  
  // Check USDC allowance
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance(
    address,
    vaultAddress
  );
  
  // USDC approval
  const { approve, isLoading: isApproving, isSuccess: isApproveSuccess } = useUSDCApprove();
  
  // Invest function
  const { invest, isLoading: isInvesting, isSuccess: isInvestSuccess } = useInvestInVault(vaultAddress);
  
  // Check if approval is needed when amount changes
  useEffect(() => {
    if (!investAmount || !allowance) {
      setNeedsApproval(true);
      return;
    }
    
    setNeedsApproval(isApprovalNeeded(allowance, investAmount));
  }, [investAmount, allowance]);
  
  // Refetch data when transactions complete
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
    if (isInvestSuccess) {
      refetchBalance();
      setInvestAmount('');
      toast.success('Investment successful!');
    }
  }, [isApproveSuccess, isInvestSuccess, refetchAllowance, refetchBalance]);
  
  // Handle approve USDC
  const handleApprove = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!investAmount) {
      toast.error('Please enter an amount to invest');
      return;
    }
    
    approve(vaultAddress, investAmount);
  };
  
  // Handle invest
  const handleInvest = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!investAmount) {
      toast.error('Please enter an amount to invest');
      return;
    }
    
    if (isFundingClosed) {
      toast.error('Funding is closed for this project');
      return;
    }
    
    invest(investAmount);
  };
  
  const isDisabled = !isConnected || isApproving || isInvesting || isFundingClosed;
  
  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-emerald-800/30">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          <span>Invest in Project #{id}</span>
          <Badge variant="outline" className={isFundingClosed 
            ? "bg-amber-900/30 text-amber-300 border-amber-700" 
            : "bg-emerald-900/30 text-emerald-300 border-emerald-700"
          }>
            {isFundingClosed ? 'Funding Closed' : 'Funding Open'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Funding progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-zinc-400">Funding Progress</span>
            <span className="text-sm text-white">{fundingPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={fundingPercentage} className="h-2 bg-emerald-950" />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 p-3 rounded-md">
            <div className="text-xs text-zinc-400 mb-1">Target</div>
            <div className="text-white font-medium">${formattedLoanAmount} USDC</div>
          </div>
          <div className="bg-black/20 p-3 rounded-md">
            <div className="text-xs text-zinc-400 mb-1">Raised</div>
            <div className="text-white font-medium">${formattedTotalAssetsInvested} USDC</div>
          </div>
        </div>
        
        {/* Investment form */}
        {!isFundingClosed && (
          <div className="mt-4">
            <label className="block mb-2 text-zinc-300">Amount to Invest (USDC)</label>
            <Input
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              placeholder="Enter amount to invest"
              className="w-full bg-black/30 border-emerald-900/50 text-white"
              min="0"
              step="0.01"
              disabled={isDisabled}
            />
            <p className="text-sm text-zinc-400 mt-1">
              Available: {formattedBalance} USDC
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3">
        {!isFundingClosed && (
          needsApproval ? (
            <Button 
              onClick={handleApprove} 
              disabled={isDisabled || !investAmount || Number(investAmount) <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isApproving ? 'Approving...' : 'Approve USDC'}
            </Button>
          ) : (
            <Button 
              onClick={handleInvest}
              disabled={isDisabled || !investAmount || Number(investAmount) <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isInvesting ? 'Investing...' : 'Confirm Investment'}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          )
        )}
        
        {isFundingClosed && (
          <p className="text-amber-400 text-center">
            Funding is closed for this project. Check other available projects.
          </p>
        )}
      </CardFooter>
    </Card>
  );
} 