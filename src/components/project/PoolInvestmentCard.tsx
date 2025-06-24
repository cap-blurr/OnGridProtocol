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
import { Loader2, CheckCircle, AlertCircle, Info, ShieldCheck, Coins, Sun, RefreshCw } from 'lucide-react';
import { formatUnits, parseUnits } from 'ethers';
import toast from 'react-hot-toast';

interface PoolDetailProps {
  poolId: number;
  liquidityPoolManagerAddress: `0x${string}`;
  onDepositSuccess?: () => void;
  onRedeemSuccess?: () => void;
}

function PoolDetailCard({ poolId, liquidityPoolManagerAddress, onDepositSuccess, onRedeemSuccess }: PoolDetailProps) {
  const { address: userAddress } = useAccount();
  const { name, formattedTotalAssets, aprPercentage, riskLevel, totalShares: poolTotalShares, isLoading: isLoadingPoolInfo, error: poolInfoError }
    = usePoolInfo(poolId);
  const { deposit, isLoading: isDepositing, isSuccess: isDepositSuccess, error: depositError, isConnected: isDepositConnected, userAddress: depositUserAddress }
    = useDepositToPool(poolId);
  const { shares: userShares, isLoading: isLoadingUserShares }
    = useUserShares(poolId, userAddress);
  const { redeem, isLoading: isRedeeming, isSuccess: isRedeemSuccess, error: redeemError }
    = useRedeemFromPool();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [redeemSharesAmount, setRedeemSharesAmount] = useState('');

  const { allowance, refetch: refetchAllowance, isLoading: isLoadingAllowance }
    = useUSDCAllowance(userAddress, liquidityPoolManagerAddress);
  const { approve, approveMax, isLoading: isApproving, isSuccess: isApproveSuccess, error: approveError, isConnected: isApprovalConnected, userAddress: approveUserAddress }
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
      // Only clear the input and trigger refresh - toast is handled in the hook
      setDepositAmount('');
      refetchAllowance();
      // Trigger dashboard refresh
      if (onDepositSuccess) {
        onDepositSuccess();
      }
    }
  }, [isDepositSuccess, poolId, refetchAllowance, onDepositSuccess]);

  useEffect(() => {
    if (isRedeemSuccess) {
      // Only clear the input and trigger refresh - toast is handled in the hook  
      setRedeemSharesAmount('');
      // Trigger dashboard refresh
      if (onRedeemSuccess) {
        onRedeemSuccess();
      }
    }
  }, [isRedeemSuccess, poolId, onRedeemSuccess]);

  const handleApprove = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount to approve.');
      return;
    }
    
    // Check wallet connection state
    if (!isApprovalConnected) {
      toast.error('Wallet connection issue. Please reconnect your wallet.');
      return;
    }
    
    approve(liquidityPoolManagerAddress, depositAmount);
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount.');
      return;
    }
    
    // Check wallet connection state
    if (!isDepositConnected) {
      toast.error('Wallet connection issue. Please reconnect your wallet.');
      return;
    }
    
    // Store the deposit amount for transaction tracking
    localStorage.setItem(`pending_deposit_amount`, depositAmount);
    console.log(`💾 Stored deposit amount for tracking: ${depositAmount}`);
    
    deposit(poolId, depositAmount);
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
    
    // Calculate estimated USDC value for the shares being redeemed
    const estimatedUSDC = redeemSharesAmount && poolTotalShares > BigInt(0) ? 
      previewAssetsOnRedeem() : redeemSharesAmount;
    
    // Store the estimated redeem amount for transaction tracking
    localStorage.setItem(`pending_redeem_amount`, estimatedUSDC);
    console.log(`💾 Stored redeem amount for tracking: ${estimatedUSDC}`);
    
    redeem(poolId, redeemSharesAmount);
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
      <div className="p-6 border rounded-lg bg-gradient-to-br from-oga-green/20 via-oga-green/10 to-oga-green/20 border-oga-green/50 text-center text-oga-green backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="animate-spin h-5 w-5 text-oga-green" />
          <span className="text-sm font-medium">Loading Solar Pool {poolId} info...</span>
        </div>
      </div>
    );
  }

  if (poolInfoError) {
    return <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300"><AlertCircle className="h-4 w-4" /><AlertTitle>Error Loading Solar Pool {poolId}</AlertTitle><AlertDescription>{poolInfoError.message}</AlertDescription></Alert>;
  }
  
  if (!name && poolId > 0) {
    return (
      <div className="p-6 border rounded-lg bg-black/40 backdrop-blur-sm border-oga-green/30 text-center text-oga-green">
        <span className="font-medium">Solar Pool {poolId} details not found.</span>
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
      default: return 'bg-oga-green/20 text-oga-green border-oga-green/40';
    }
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg lg:text-xl text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Sun className="h-5 w-5 text-oga-yellow flex-shrink-0" />
            <span className="leading-tight">{name} (Pool ID: {poolId})</span>
            {/* Real-time update indicators */}
            {(isDepositing || isRedeeming || isApproving) && (
              <Loader2 className="h-4 w-4 animate-spin text-oga-green" />
            )}
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full flex items-center w-fit font-medium ${getRiskLevelColor(riskLevel)}`}>
            <ShieldCheck size={12} className="mr-1.5" /> {getRiskLevelText(riskLevel)}
          </span>
        </CardTitle>
        <CardDescription className="text-sm text-oga-green/90 pt-2 space-y-2">
          <div className="font-medium">
            Total Solar Assets: <span className="text-oga-green font-semibold">{formattedTotalAssets} USDC</span> | 
            APR: <span className="text-oga-green font-semibold">{aprPercentage.toFixed(2)}%</span>
          </div>
        </CardDescription>
        <CardDescription className="text-sm text-oga-green/90 pt-1 flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <Coins size={14} className="mr-2 text-oga-green"/> 
            <span className="font-medium">Your Shares:</span>
          </div>
          {isLoadingUserShares ? (
            <Loader2 className="h-4 w-4 animate-spin text-oga-green" />
          ) : (
            <span className="text-oga-green font-semibold">{formattedUserShares}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div>
          <Input 
            type="number" 
            placeholder="USDC Amount to Deposit" 
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="h-12 bg-oga-green/10 border-oga-green/50 text-white focus:border-oga-green focus:bg-oga-green/15 placeholder-oga-green/70 mb-3 text-sm font-medium"
          />
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {needsApproval && (
              <Button 
                onClick={handleApprove} 
                disabled={isApproving || isLoadingAllowance || !depositAmount || parseFloat(depositAmount) <= 0}
                className="flex-1 bg-oga-yellow hover:bg-oga-yellow/80 text-black font-semibold text-sm transition-all duration-300"
              >
                {isApproving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Approve USDC
              </Button>
            )}
            <Button 
              onClick={handleDeposit} 
              disabled={isDepositing || (needsApproval && parseFloat(depositAmount) > 0) || !depositAmount || parseFloat(depositAmount) <= 0}
              className="flex-1 bg-oga-green hover:bg-oga-green/80 text-white font-semibold text-sm transition-all duration-300"
            >
              {isDepositing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Deposit to Solar Pool
            </Button>
          </div>
          {approveError && <p className="text-xs text-red-400 mt-2">Approval Error: {approveError.message}</p>}
          {depositError && <p className="text-xs text-red-400 mt-2">Deposit Error: {depositError.message}</p>}
          {isDepositSuccess && <p className="text-xs text-oga-green mt-2 flex items-center font-medium"><CheckCircle className="h-4 w-4 mr-1"/>Solar Pool Deposit Confirmed!</p>}
        </div>

        <hr className="my-6 border-oga-green/40" />

        <div>
          <Input 
            type="number" 
            placeholder="Shares to Redeem" 
            value={redeemSharesAmount}
            onChange={(e) => setRedeemSharesAmount(e.target.value)}
            className="h-12 bg-oga-green/10 border-oga-green/50 text-white focus:border-oga-green focus:bg-oga-green/15 placeholder-oga-green/70 mb-3 text-sm font-medium"
          />
          {redeemSharesAmount && BigInt(redeemSharesAmount) > 0 && poolTotalShares > BigInt(0) && (
            <p className="text-sm text-oga-green/90 mb-3 font-medium">
              You will receive approx. <span className="text-oga-green font-semibold">{previewAssetsOnRedeem()} USDC</span>
            </p>
          )}
          <Button 
            onClick={handleRedeem}
            disabled={isRedeeming || !redeemSharesAmount || BigInt(redeemSharesAmount) <= 0 || (userShares != undefined && BigInt(redeemSharesAmount) > userShares)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all duration-300"
          >
            {isRedeeming ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Redeem Solar Pool Shares
          </Button>
          {redeemError && <p className="text-xs text-red-400 mt-2">Redeem Error: {redeemError.message}</p>}
          {isRedeemSuccess && <p className="text-xs text-oga-green mt-2 flex items-center font-medium"><CheckCircle className="h-4 w-4 mr-1"/>Solar Pool Redemption Confirmed!</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PoolInvestmentCard({ onInvestmentUpdate }: { onInvestmentUpdate?: () => void }) {
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

  const handleInvestmentSuccess = () => {
    if (onInvestmentUpdate) {
      onInvestmentUpdate();
    }
  };

  if (isLoadingCount) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="text-2xl lg:text-3xl font-bold text-white flex items-center">
            <Sun className="h-6 w-6 lg:h-7 lg:w-7 mr-3 text-oga-yellow" />
            Loading Solar Liquidity Pools...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-oga-green" />
            <p className="text-oga-green font-medium">Loading solar energy pools...</p>
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
    <div className="space-y-8">
      <div className="space-y-6 lg:space-y-8">
        {poolIds.length === 0 && !isLoadingCount && (
          <div className="text-center text-oga-green py-12 bg-black/40 backdrop-blur-sm border border-oga-green/30 rounded-lg p-8">
            <Sun size={64} className="mx-auto mb-6 text-oga-yellow opacity-60" />
            <h3 className="text-2xl font-bold text-white mb-4">No Solar Pools Available</h3>
            <p className="text-lg text-oga-green/80 mb-2">No solar energy liquidity pools are available at the moment.</p>
            <p className="text-sm text-oga-green/60">Check back soon for new solar investment opportunities!</p>
          </div>
        )}
        {poolIds.map((id) => (
          <div key={id} className="bg-black/40 backdrop-blur-sm border border-oga-green/30 hover:border-oga-green/50 transition-all duration-300 rounded-lg overflow-hidden p-6">
            <PoolDetailCard 
              poolId={id} 
              liquidityPoolManagerAddress={liquidityPoolManagerProxy as `0x${string}`}
              onDepositSuccess={handleInvestmentSuccess}
              onRedeemSuccess={handleInvestmentSuccess}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 