'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  usePoolCount,
  usePoolInfo,
  useDepositToPool,
  useUserShares,
  useRedeemFromPool,
} from '@/hooks/contracts/useLiquidityPoolManager';
import {
  useUSDCBalance,
  useUSDCAllowance,
  useUSDCApprove,
  USDC_DECIMALS,
  isApprovalNeeded as checkApprovalNeeded,
} from '@/hooks/contracts/useUSDC';
import { useContractAddresses } from '@/hooks/contracts/useDeveloperRegistry';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Info, ShieldCheck, Coins, Sun } from 'lucide-react';
import { formatUnits, parseUnits } from 'ethers';
import toast from 'react-hot-toast';

interface PoolDetailProps {
  poolId: number;
  liquidityPoolManagerAddress: `0x${string}`;
}

function PoolDetailCard({ poolId, liquidityPoolManagerAddress }: PoolDetailProps) {
  const { address: userAddress } = useAccount();
  const { name, formattedTotalAssets, aprPercentage, riskLevel, totalShares: poolTotalShares, isLoading: isLoadingPoolInfo, error: poolInfoError }
    = usePoolInfo(poolId);
  const { deposit, isLoading: isDepositing, isSuccess: isDepositSuccess, error: depositError }
    = useDepositToPool(poolId);
  const { shares: userShares, isLoading: isLoadingUserShares,}
    = useUserShares(poolId, userAddress);
  const { redeem, isLoading: isRedeeming, isSuccess: isRedeemSuccess, error: redeemError }
    = useRedeemFromPool(poolId);
  
  const [depositAmount, setDepositAmount] = useState('');
  const [redeemSharesAmount, setRedeemSharesAmount] = useState('');

  const { allowance, refetch: refetchAllowance, isLoading: isLoadingAllowance }
    = useUSDCAllowance(userAddress, liquidityPoolManagerAddress);
  const { approve, isLoading: isApproving, isSuccess: isApproveSuccess, error: approveError }
    = useUSDCApprove();

  const needsApproval = parseFloat(depositAmount) > 0 && checkApprovalNeeded(allowance, depositAmount);

  const formattedUserShares = userShares ? formatUnits(userShares, 0) : '0';

  useEffect(() => {
    if (isApproveSuccess) {
      toast.success(`Approval for Solar Pool ${poolId} successful!`);
      refetchAllowance();
    }
  }, [isApproveSuccess, poolId, refetchAllowance]);

  useEffect(() => {
    if (isDepositSuccess) {
      toast.success(`Successfully deposited to Solar Pool ${poolId}!`);
      setDepositAmount('');
      refetchAllowance();
      refetchUserShares();
    }
  }, [isDepositSuccess, poolId, refetchAllowance, refetchUserShares]);

  useEffect(() => {
    if (isRedeemSuccess) {
      toast.success(`Successfully redeemed shares from Solar Pool ${poolId}!`);
      setRedeemSharesAmount('');
      refetchUserShares();
    }
  }, [isRedeemSuccess, poolId, refetchUserShares]);

  const handleApprove = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount to approve.');
      return;
    }
    approve(liquidityPoolManagerAddress, depositAmount);
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount.');
      return;
    }
    deposit(depositAmount);
  };

  const handleRedeem = () => {
    if (!redeemSharesAmount || BigInt(redeemSharesAmount) <= BigInt(0)) {
      toast.error('Please enter a valid amount of shares to redeem.');
      return;
    }
    if (userShares && BigInt(redeemSharesAmount) > userShares) {
      toast.error('You do not have enough shares to redeem this amount.');
      return;
    }
    redeem(redeemSharesAmount);
  };
  
  const previewAssetsOnRedeem = () => {
    if (!redeemSharesAmount || BigInt(redeemSharesAmount) <= BigInt(0) || !poolTotalShares || poolTotalShares === BigInt(0) || !formattedTotalAssets) {
      return '0.00';
    }
    try {
      const poolTotalAssetsBigInt = parseUnits(formattedTotalAssets, USDC_DECIMALS);
      const assets = (BigInt(redeemSharesAmount) * poolTotalAssetsBigInt) / poolTotalShares;
      return formatUnits(assets, USDC_DECIMALS);
    } catch (e) {
      return '0.00';
    }
  };

  if (isLoadingPoolInfo) {
    return (
      <div className="p-4 border rounded-lg bg-black/20 border-oga-green/30 text-center text-zinc-400 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="animate-spin h-4 w-4" />
          <span className="text-sm">Loading Solar Pool {poolId} info...</span>
        </div>
      </div>
    );
  }

  if (poolInfoError) {
    return <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300"><AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Solar Pool {poolId}</AlertTitle><AlertDescription>{poolInfoError.message}</AlertDescription></Alert>;
  }
  
  if (!name && poolId > 0) {
      return (
        <div className="p-4 border rounded-lg bg-black/20 border-oga-green/30 text-center text-zinc-500 backdrop-blur-sm">
            Solar Pool {poolId} details not found.
        </div>
      );
  }
  if (!name) return null;

  const getRiskLevelText = (level: number | undefined) => {
    switch (level) {
      case 1: return 'Low Risk';
      case 2: return 'Medium Risk';
      case 3: return 'High Risk';
      default: return 'N/A';
    }
  };

  const getRiskLevelColor = (level: number | undefined) => {
    switch (level) {
      case 1: return 'bg-oga-green/30 text-oga-green border-oga-green/50';
      case 2: return 'bg-oga-yellow/30 text-oga-yellow border-oga-yellow/50';
      case 3: return 'bg-red-700/50 text-red-300 border-red-600/50';
      default: return 'bg-zinc-700/50 text-zinc-300 border-zinc-600/50';
    }
  };

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-oga-green/40 hover:border-oga-green/60 transition-colors duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-base lg:text-lg text-oga-green flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-oga-yellow flex-shrink-0" />
            <span className="leading-tight">{name} (Pool ID: {poolId})</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full flex items-center w-fit ${getRiskLevelColor(riskLevel)}`}>
            <ShieldCheck size={12} className="mr-1" /> {getRiskLevelText(riskLevel)}
          </span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-zinc-400 pt-1 space-y-1">
          <div>Total Solar Assets: <span className="text-oga-green">{formattedTotalAssets} USDC</span> | APR: <span className="text-oga-green">{aprPercentage.toFixed(2)}%</span></div>
        </CardDescription>
        <CardDescription className="text-xs sm:text-sm text-zinc-400 pt-1 flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              <Coins size={12} className="mr-1 text-oga-green"/> 
              <span>Your Shares:</span>
            </div>
            {isLoadingUserShares ? 
              <Loader2 className="h-3 w-3 animate-spin" /> : 
              <span className="text-oga-green font-medium">{formattedUserShares}</span>
            }
            {userShares && <span className="text-xs text-red-400">(Error loading shares)</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div>
          <Input 
            type="number" 
            placeholder="USDC Amount to Deposit" 
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="h-10 bg-zinc-900/70 border-oga-green/30 text-white focus:border-oga-green placeholder-zinc-500 mb-2 text-sm"
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {needsApproval && (
              <Button 
                onClick={handleApprove} 
                disabled={isApproving || isLoadingAllowance || !depositAmount || parseFloat(depositAmount) <= 0}
                className="flex-1 bg-gradient-to-r from-oga-yellow to-oga-yellow-light hover:from-oga-yellow-dark hover:to-oga-yellow text-black font-semibold text-xs sm:text-sm"
              >
                {isApproving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Approve USDC
              </Button>
            )}
            <Button 
              onClick={handleDeposit} 
              disabled={isDepositing || (needsApproval && parseFloat(depositAmount) > 0) || !depositAmount || parseFloat(depositAmount) <= 0}
              className="flex-1 bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white font-semibold text-xs sm:text-sm"
            >
              {isDepositing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Deposit to Solar Pool
            </Button>
          </div>
          {approveError && <p className="text-xs text-red-400 mt-1">Approval Error: {approveError.message}</p>}
          {depositError && <p className="text-xs text-red-400 mt-1">Deposit Error: {depositError.message}</p>}
          {isDepositSuccess && <p className="text-xs text-oga-green mt-1 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/>Solar Pool Deposit Confirmed!</p>}
        </div>

        <hr className="my-4 border-oga-green/20" />

        <div>
          <Input 
            type="number" 
            placeholder="Shares to Redeem" 
            value={redeemSharesAmount}
            onChange={(e) => setRedeemSharesAmount(e.target.value)}
            className="h-10 bg-zinc-900/70 border-oga-green/30 text-white focus:border-oga-green placeholder-zinc-500 mb-2 text-sm"
          />
          {redeemSharesAmount && BigInt(redeemSharesAmount) > 0 && poolTotalShares > BigInt(0) && (
            <p className="text-xs text-zinc-400 mb-2">
              You will receive approx. <span className="text-oga-green">{previewAssetsOnRedeem()} USDC</span>
            </p>
          )}
          <Button 
            onClick={handleRedeem}
            disabled={isRedeeming || !redeemSharesAmount || BigInt(redeemSharesAmount) <= 0 || (userShares != undefined && BigInt(redeemSharesAmount) > userShares)}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold text-xs sm:text-sm"
          >
            {isRedeeming ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Redeem Solar Pool Shares
          </Button>
          {redeemError && <p className="text-xs text-red-400 mt-1">Redeem Error: {redeemError.message}</p>}
          {isRedeemSuccess && <p className="text-xs text-oga-green mt-1 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/>Solar Pool Redemption Confirmed!</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PoolInvestmentCard() {
  const { poolCount, isLoading: isLoadingCount, error: countError } = usePoolCount();
  const { liquidityPoolManagerProxy } = useContractAddresses(); 
  const [poolIds, setPoolIds] = useState<number[]>([]);

  useEffect(() => {
    if (poolCount !== undefined && poolCount !== null) {
      const numPools = Number(poolCount);
      if (numPools > 0) {
        setPoolIds(Array.from({ length: numPools }, (_, i) => i + 1));
      } else {
        setPoolIds([]);
      }
    }
  }, [poolCount]);

  if (isLoadingCount) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="text-xl lg:text-2xl font-bold text-white flex items-center">
            <Sun className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-oga-yellow" />
            Loading Solar Liquidity Pools...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-oga-green" />
            <p className="text-zinc-400 text-sm">Loading solar energy pools...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (countError) {
    return <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300"><AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Solar Pool Count</AlertTitle><AlertDescription>{countError.message}</AlertDescription></Alert>;
  }

  if (!liquidityPoolManagerProxy) {
    return <Alert variant="default" className="bg-oga-yellow/20 border-oga-yellow/50 text-oga-yellow"><Info className="h-4 w-4" /><AlertTitle>Configuration Error</AlertTitle><AlertDescription>Solar Pool Manager address is not configured. Please contact support.</AlertDescription></Alert>;
  }

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl font-bold text-white flex items-center">
          <Sun className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-oga-yellow" />
          Invest in Solar Liquidity Pools
        </CardTitle>
        <CardDescription className="text-zinc-400 pt-1 text-sm lg:text-base">
          Provide liquidity to solar energy project funding pools and earn yield. Select a pool and enter the amount of USDC you wish to deposit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6">
        {poolIds.length === 0 && !isLoadingCount && (
          <div className="text-center text-zinc-400 py-6">
            <Sun size={48} className="mx-auto mb-4 text-oga-yellow opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No Solar Pools Available</h3>
            <p className="text-sm">No solar energy liquidity pools are available at the moment.</p>
            <p className="text-xs mt-2 text-zinc-500">Check back soon for new solar investment opportunities!</p>
          </div>
        )}
        {poolIds.map((id) => (
          <PoolDetailCard key={id} poolId={id} liquidityPoolManagerAddress={liquidityPoolManagerProxy as `0x${string}`} />
        ))}
      </CardContent>
    </Card>
  );
} 

function refetchUserShares() {
  throw new Error('Function not implemented.');
}
