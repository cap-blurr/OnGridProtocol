'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  useVaultDetails, 
  useInvestInVault,
  useClaimableAmounts,
  useClaimPrincipal,
  useClaimYield,
  useRedeem
} from '@/hooks/contracts/useDirectProjectVault';
import {
  useUSDCAllowance,
  useUSDCApprove,
  USDC_DECIMALS,
  isApprovalNeeded as checkApprovalNeeded,
} from '@/hooks/contracts/useUSDC';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Info, TrendingUp, Clock, Sun, DollarSign } from 'lucide-react';
import { formatUnits } from 'ethers';
import toast from 'react-hot-toast';

export interface SolarProjectData {
  id: string; // Your internal project ID from Supabase/backend
  name: string;
  description: string;
  vaultAddress: `0x${string}`;
  location?: string;
  capacity?: string; // e.g., "50 MW"
  // Add other relevant details fetched from your backend/Supabase if needed
  // e.g., metadataCID, developerName, targetLoanAmount (can also come from vaultDetails)
}

interface DirectProjectInvestmentItemProps {
  project: SolarProjectData;
}

export default function DirectProjectInvestmentItem({ project }: DirectProjectInvestmentItemProps) {
  const { address: userAddress } = useAccount();
  const {
    loanAmount: targetLoanAmount, 
    totalAssetsInvested, 
    isFundingClosed, 
    aprPercentage, 
    tenorDays, 
    fundingPercentage, 
    formattedLoanAmount,
    formattedTotalAssetsInvested,
    isLoading: isLoadingVaultDetails, 
    error: vaultDetailsError
  } = useVaultDetails(project.vaultAddress);

  const { invest, isLoading: isInvesting, isSuccess: isInvestSuccess, error: investError } 
    = useInvestInVault(project.vaultAddress);
  
  const { 
    claimablePrincipal, 
    claimableYield, 
    formattedClaimablePrincipal, 
    formattedClaimableYield, 
    isLoading: isLoadingClaimableAmounts,
    refetch: refetchClaimableAmounts
  } = useClaimableAmounts(project.vaultAddress, userAddress);

  const { claimPrincipal, isLoading: isClaimingPrincipal, isSuccess: isClaimPrincipalSuccess, error: claimPrincipalError } = useClaimPrincipal(project.vaultAddress);
  const { claimYield, isLoading: isClaimingYield, isSuccess: isClaimYieldSuccess, error: claimYieldError } = useClaimYield(project.vaultAddress);
  const { redeem, isLoading: isRedeeming, isSuccess: isRedeemSuccess, error: redeemError } = useRedeem(project.vaultAddress);
  
  const [investmentAmount, setInvestmentAmount] = useState('');

  const { allowance, refetch: refetchAllowance, isLoading: isLoadingAllowance }
    = useUSDCAllowance(userAddress, project.vaultAddress);
  const { approve, isLoading: isApproving, isSuccess: isApproveSuccess, error: approveError }
    = useUSDCApprove();

  const needsApproval = parseFloat(investmentAmount) > 0 && checkApprovalNeeded(allowance, investmentAmount);

  useEffect(() => {
    if (isApproveSuccess) {
      toast.success(`Approval for ${project.name} successful!`);
      refetchAllowance();
    }
  }, [isApproveSuccess, project.name, refetchAllowance]);

  useEffect(() => {
    if (isInvestSuccess) {
      toast.success(`Successfully invested in ${project.name}!`);
      setInvestmentAmount(''); 
      refetchAllowance();
      if (refetchClaimableAmounts) refetchClaimableAmounts();
    }
  }, [isInvestSuccess, project.name, refetchAllowance, refetchClaimableAmounts]);

  useEffect(() => {
    if (isClaimPrincipalSuccess || isClaimYieldSuccess || isRedeemSuccess) {
      toast.success('Claim/Redeem successful!');
      if (refetchClaimableAmounts) refetchClaimableAmounts();
    }
  }, [isClaimPrincipalSuccess, isClaimYieldSuccess, isRedeemSuccess, refetchClaimableAmounts]);

  const handleApprove = () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      toast.error('Please enter a valid amount to approve.');
      return;
    }
    approve(project.vaultAddress, investmentAmount);
  };

  const handleInvest = () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      toast.error('Please enter a valid investment amount.');
      return;
    }
    invest(investmentAmount);
  };

  const handleClaimPrincipal = () => claimPrincipal();
  const handleClaimYield = () => claimYield();
  const handleRedeemAll = () => redeem();

  if (isLoadingVaultDetails) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm border border-oga-green/40 p-4">
        <div className="flex items-center justify-center space-x-2 text-zinc-400">
          <Loader2 className="animate-spin h-5 w-5" /> 
          <span>Loading solar project details...</span>
        </div>
      </Card>
    );
  }

  if (vaultDetailsError) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm border border-red-700/60 p-4">
        <Alert variant="destructive" className="bg-transparent border-none text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Solar Project: {project.name}</AlertTitle>
            <AlertDescription>{vaultDetailsError.message}</AlertDescription>
        </Alert>
      </Card>
    );
  }

  const hasClaimablePrincipal = claimablePrincipal && claimablePrincipal > BigInt(0);
  const hasClaimableYield = claimableYield && claimableYield > BigInt(0);

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-colors duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-oga-green flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-oga-yellow" />
            <span>{project.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            {isFundingClosed && <Badge variant="outline" className="bg-rose-700/50 border-rose-600 text-rose-300">Funding Closed</Badge>}
            {!isFundingClosed && fundingPercentage >= 100 && <Badge variant="outline" className="bg-oga-green/50 border-oga-green text-oga-green">Fully Funded</Badge>}
          </div>
        </CardTitle>
        <CardDescription className="text-sm text-zinc-400 pt-1 line-clamp-2">
          {project.description}
        </CardDescription>
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2">
          <span className="flex items-center"><TrendingUp size={14} className="mr-1 text-oga-green" /> APR: {aprPercentage.toFixed(2)}%</span>
          <span className="flex items-center"><Clock size={14} className="mr-1 text-oga-green" /> Tenor: {tenorDays} days</span>
          {project.location && (
            <span className="flex items-center text-oga-yellow">📍 {project.location}</span>
          )}
          {project.capacity && (
            <span className="flex items-center text-oga-yellow">⚡ {project.capacity}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div>
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Solar Project Funding</span>
            <span>{fundingPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={fundingPercentage} className="h-2 bg-zinc-800" indicatorClassName="bg-oga-green" />
          <div className="text-xs text-zinc-500 mt-1 text-right">
            {formattedTotalAssetsInvested} / {formattedLoanAmount} USDC Raised
          </div>
        </div>

        {!isFundingClosed && fundingPercentage < 100 && (
          <div className="border-t border-oga-green/20 pt-4">
            <h4 className="text-md font-semibold text-oga-green mb-2 flex items-center">
              <Sun className="w-4 h-4 mr-2 text-oga-yellow" />
              Invest in Solar Project
            </h4>
            <Input 
              type="number" 
              placeholder="USDC Amount to Invest" 
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="h-10 bg-zinc-900/70 border-oga-green/30 text-white focus:border-oga-green placeholder-zinc-500"
            />
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
              {needsApproval && (
                <Button 
                  onClick={handleApprove} 
                  disabled={isApproving || isLoadingAllowance || !investmentAmount || parseFloat(investmentAmount) <= 0}
                  className="flex-1 bg-gradient-to-r from-oga-yellow to-oga-yellow-light hover:from-oga-yellow-dark hover:to-oga-yellow text-black font-semibold"
                >
                  {isApproving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Approve USDC
                </Button>
              )}
              <Button 
                onClick={handleInvest} 
                disabled={isInvesting || (needsApproval && parseFloat(investmentAmount) > 0) || !investmentAmount || parseFloat(investmentAmount) <= 0}
                className="flex-1 bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white font-semibold"
              >
                {isInvesting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Invest in Solar
              </Button>
            </div>
            {approveError && <p className="text-xs text-red-400 mt-1">Approval Error: {approveError.message}</p>}
            {investError && <p className="text-xs text-red-400 mt-1">Investment Error: {investError.message}</p>}
            {isInvestSuccess && <p className="text-xs text-oga-green mt-1 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/>Solar Investment Confirmed!</p>}
          </div>
        )}
        {(isFundingClosed || fundingPercentage >= 100) && !(!isFundingClosed && fundingPercentage < 100) && (
            <Alert variant="default" className="bg-oga-green/20 border-oga-green/50 text-oga-green">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Solar Project Funded</AlertTitle>
                <AlertDescription>This solar energy project is now fully funded and generating clean energy.</AlertDescription>
            </Alert>
        )}

        {(isFundingClosed || fundingPercentage >= 100) && (
          <div className="border-t border-oga-green/20 pt-4 mt-4">
            <h4 className="text-md font-semibold text-oga-green mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-oga-green" />
              Your Solar Investment Returns
            </h4>
            {isLoadingClaimableAmounts && <div className="text-zinc-400 text-sm flex items-center"><Loader2 className="animate-spin h-4 w-4 mr-2" />Loading claimable amounts...</div>}
            {!isLoadingClaimableAmounts && (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-zinc-800/30 p-3 rounded-md border border-oga-green/20">
                  <span className="text-sm text-zinc-300 flex items-center"><DollarSign size={16} className="mr-2 text-oga-green"/>Principal Available:</span>
                  <span className="text-sm font-medium text-oga-green">{formattedClaimablePrincipal} USDC</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-800/30 p-3 rounded-md border border-oga-green/20">
                  <span className="text-sm text-zinc-300 flex items-center"><Sun size={16} className="mr-2 text-oga-yellow"/>Solar Yield Available:</span>
                  <span className="text-sm font-medium text-oga-green">{formattedClaimableYield} USDC</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <Button 
                    onClick={handleClaimPrincipal} 
                    disabled={!hasClaimablePrincipal || isClaimingPrincipal || isRedeeming}
                    className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white text-xs sm:text-sm"
                  >
                    {isClaimingPrincipal ? <Loader2 className="animate-spin h-4 w-4" /> : "Claim Principal"}
                  </Button>
                  <Button 
                    onClick={handleClaimYield} 
                    disabled={!hasClaimableYield || isClaimingYield || isRedeeming}
                    className="w-full bg-gradient-to-r from-oga-yellow to-oga-yellow-light hover:from-oga-yellow-dark hover:to-oga-yellow text-black text-xs sm:text-sm font-semibold"
                  >
                    {isClaimingYield ? <Loader2 className="animate-spin h-4 w-4" /> : "Claim Solar Yield"}
                  </Button>
                  <Button 
                    onClick={handleRedeemAll} 
                    disabled={(!hasClaimablePrincipal && !hasClaimableYield) || isRedeeming || isClaimingPrincipal || isClaimingYield}
                    className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs sm:text-sm"
                  >
                    {isRedeeming ? <Loader2 className="animate-spin h-4 w-4" /> : "Redeem All"}
                  </Button>
                </div>
                {claimPrincipalError && <p className="text-xs text-red-400 mt-1">Claim Principal Error: {claimPrincipalError.message}</p>}
                {claimYieldError && <p className="text-xs text-red-400 mt-1">Claim Solar Yield Error: {claimYieldError.message}</p>}
                {redeemError && <p className="text-xs text-red-400 mt-1">Redeem Error: {redeemError.message}</p>}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 