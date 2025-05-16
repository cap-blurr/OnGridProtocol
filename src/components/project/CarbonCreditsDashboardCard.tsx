'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import {
  useOGCCTokenInfo,
  useOGCCBalance,
  useOGCCApprove,
  useOGCCAllowance,
  OGCC_DECIMALS
} from '@/hooks/contracts/useCarbonCreditToken';
import {
  useExchangeInfo,
  useExchangeOGCCToUSDC
} from '@/hooks/contracts/useCarbonCreditExchange';
import { useUSDCBalance, USDC_DECIMALS } from '@/hooks/contracts/useUSDC'; // To show user's USDC balance
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Info, Coins, TrendingUp, ShieldAlert, Repeat2, FileText, Settings2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatUnits, parseUnits } from 'ethers';
import toast from 'react-hot-toast';
import { isApprovalNeeded as checkApprovalNeeded } from '@/hooks/contracts/useUSDC'; // Reusing this helper

export default function CarbonCreditsDashboardCard() {
  const { address: userAddress } = useAccount();

  // OGCC Token Info
  const { 
    name: ogccName, symbol: ogccSymbol, totalSupply: ogccTotalSupply, formattedTotalSupply: ogccFormattedTotalSupply,
    protocolTreasury, formattedTreasuryBalance, isPaused: isOgccPaused, isLoading: isLoadingOgccInfo, tokenAddress: ogccTokenAddress
  } = useOGCCTokenInfo();

  // User Balances
  const { balance: ogccUserBalance, formattedBalance: formattedOgccUserBalance, refetch: refetchOgccBalance, isLoading: isLoadingOgccUserBalance } = useOGCCBalance(userAddress);
  const { formattedBalance: formattedUsdcUserBalance, refetch: refetchUsdcBalance, isLoading: isLoadingUsdcUserBalance } = useUSDCBalance(userAddress);

  // Exchange Info
  const {
    exchangeAddress, exchangeRate, protocolFeeBps, rewardDistributorFeeBps, isExchangeEnabled, isPaused: isExchangePaused,
    formattedTotalCreditsExchanged, formattedTotalUsdcCollected, formattedTotalProtocolFees, formattedTotalRewardsFunded,
    isLoading: isLoadingExchangeInfo
  } = useExchangeInfo();

  // Exchange Actions
  const { approve: approveOgcc, isLoading: isApprovingOgcc, isSuccess: isOgccApproveSuccess, error: ogccApproveError } = useOGCCApprove();
  const { exchangeCredits, isLoading: isExchanging, isSuccess: isExchangeSuccess, error: exchangeError } = useExchangeOGCCToUSDC();
  const { allowance: ogccAllowance, formattedAllowance: formattedOgccAllowance, refetch: refetchOgccAllowance, isLoading: isLoadingOgccAllowance } = 
    useOGCCAllowance(userAddress, exchangeAddress);

  const [ogccToExchange, setOgccToExchange] = useState('');
  const needsOgccApproval = exchangeAddress && parseFloat(ogccToExchange) > 0 && checkApprovalNeeded(ogccAllowance, ogccToExchange);

  // Calculated values for UI
  const exchangeRateDisplay = exchangeRate && ogccSymbol && USDC_DECIMALS && OGCC_DECIMALS
    ? `1 ${ogccSymbol} ≈ ${formatUnits(exchangeRate, USDC_DECIMALS - OGCC_DECIMALS)} USDC` // Adjust based on how exchangeRate is defined
    : 'N/A';
  const protocolFeeDisplay = protocolFeeBps ? `${(Number(protocolFeeBps) / 100).toFixed(2)}%` : 'N/A';
  
  let estimatedUsdcToReceive = '0.00';
  if (ogccToExchange && parseFloat(ogccToExchange) > 0 && exchangeRate && protocolFeeBps) {
    try {
      const amountOgcc = parseUnits(ogccToExchange, OGCC_DECIMALS);
      // This calculation assumes exchangeRate is USDC per OGCC (smallest unit to smallest unit)
      // And fee is on the USDC received. Adjust if contract logic differs.
      // Example: If exchangeRate = 5 * 10^USDC_DECIMALS for 1 * 10^OGCC_DECIMALS OGCC
      // This means 1 OGCC (token unit) = 5 USDC (token unit)
      // Let's assume exchangeRate is defined as: amount of USDC (6 decimals) for 1 OGCC (3 decimals)
      // So, for `X` OGCC (parsed to 3 decimals), USDC_RAW = (X * exchangeRate) / (10^OGCC_DECIMALS)
      // Then fee is applied to USDC_RAW
      
      const usdcRaw = (amountOgcc * exchangeRate) / BigInt(10 ** OGCC_DECIMALS);
      const feeAmount = (usdcRaw * protocolFeeBps) / BigInt(10000);
      const netUsdc = usdcRaw - feeAmount;
      estimatedUsdcToReceive = formatUnits(netUsdc, USDC_DECIMALS);
    } catch (e) { /* ignore calculation error for display */ }
  }

  useEffect(() => {
    if (isOgccApproveSuccess) {
      toast.success('OGCC spending approved for exchange!');
      refetchOgccAllowance();
    }
  }, [isOgccApproveSuccess, refetchOgccAllowance]);

  useEffect(() => {
    if (isExchangeSuccess) {
      toast.success('Successfully exchanged OGCC for USDC!');
      setOgccToExchange('');
      refetchOgccBalance();
      refetchUsdcBalance();
      refetchOgccAllowance();
      // Potentially refetch exchange stats if they are important to see updated immediately
    }
  }, [isExchangeSuccess, refetchOgccBalance, refetchUsdcBalance, refetchOgccAllowance]);

  const handleApproveOgcc = () => {
    if (!exchangeAddress || !ogccToExchange || parseFloat(ogccToExchange) <= 0) {
      toast.error('Please enter a valid amount of OGCC to approve.');
      return;
    }
    approveOgcc(exchangeAddress, ogccToExchange);
  };

  const handleExchangeOgcc = () => {
    if (!ogccToExchange || parseFloat(ogccToExchange) <= 0) {
      toast.error('Please enter a valid amount of OGCC to exchange.');
      return;
    }
    if (ogccUserBalance && parseUnits(ogccToExchange, OGCC_DECIMALS) > ogccUserBalance) {
      toast.error('Insufficient OGCC balance.');
      return;
    }
    exchangeCredits(ogccToExchange);
  };

  const isLoading = isLoadingOgccInfo || isLoadingExchangeInfo || isLoadingOgccUserBalance || isLoadingUsdcUserBalance;

  if (isLoading) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-emerald-800/30">
        <CardHeader><CardTitle className="text-white">Carbon Credits & Exchange</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center py-10"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></CardContent>
      </Card>
    );
  }
  
  const InfoRow = ({ label, value, icon: Icon, unit = '' }: { label: string; value?: string | number | boolean | ReactNode; icon?: React.ElementType; unit?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-zinc-700/50 last:border-b-0">
      <span className="text-sm text-zinc-400 flex items-center">
        {Icon && <Icon size={16} className="mr-2 text-emerald-500" />} {label}
      </span>
      <span className="text-sm text-white font-medium">
        {typeof value === 'boolean' ? (value ? <ThumbsUp size={16} className="text-green-500"/> : <ThumbsDown size={16} className="text-red-500"/>) : value || 'N/A'} {typeof value !== 'object' && unit}
      </span>
    </div>
  );

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-emerald-800/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Carbon Credits (OGCC) & Exchange</CardTitle>
        <CardDescription className="text-zinc-400 pt-1">
          View your OGCC balance, token details, exchange information, and swap OGCC for USDC.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Column 1: OGCC Token Info & User Balance */}
        <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-zinc-700/30">
          <h3 className="text-lg font-semibold text-emerald-400 mb-3">OGCC Token Details</h3>
          <InfoRow label="Name" value={ogccName} icon={FileText} />
          <InfoRow label="Symbol" value={ogccSymbol} icon={FileText} />
          <InfoRow label="Total Supply" value={ogccFormattedTotalSupply} unit={ogccSymbol} icon={Coins} />
          <InfoRow label="Protocol Treasury" value={protocolTreasury ? `${protocolTreasury.substring(0,6)}...${protocolTreasury.substring(protocolTreasury.length - 4)}` : 'N/A'} icon={ShieldAlert} />
          <InfoRow label="Treasury Balance" value={formattedTreasuryBalance} unit={ogccSymbol} icon={Coins} />
          <InfoRow label="Token Paused" value={isOgccPaused} icon={Settings2} />
          
          <hr className="my-3 border-zinc-700/50" />
          <h4 className="text-md font-semibold text-emerald-300 mb-2">Your Balances</h4>
          <InfoRow 
            label={`Your ${ogccSymbol || 'OGCC'} Balance`} 
            value={isLoadingOgccUserBalance ? <Loader2 size={16} className='animate-spin' /> as ReactNode : formattedOgccUserBalance} 
            unit={ogccSymbol} 
            icon={Coins} 
          />
          <InfoRow 
            label="Your USDC Balance" 
            value={isLoadingUsdcUserBalance ? <Loader2 size={16} className='animate-spin' /> as ReactNode : formattedUsdcUserBalance} 
            unit="USDC" 
            icon={Coins} 
          />
        </div>

        {/* Column 2: Exchange Info & Actions */}
        <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-zinc-700/30">
          <h3 className="text-lg font-semibold text-emerald-400 mb-3">OGCC/USDC Exchange</h3>
          {!exchangeAddress && <Alert variant='default' className="bg-yellow-900/30 text-yellow-300 border-yellow-700"><Info className="h-4 w-4"/>Exchange address not configured.</Alert>}
          {exchangeAddress && (
            <>
              <InfoRow label="Exchange Rate" value={exchangeRateDisplay} icon={Repeat2} />
              <InfoRow label="Protocol Fee" value={protocolFeeDisplay} icon={TrendingUp} />
              <InfoRow label="Exchange Enabled" value={isExchangeEnabled} icon={Settings2} />
              <InfoRow label="Exchange Paused" value={isExchangePaused} icon={Settings2} />
              
              <hr className="my-3 border-zinc-700/50" />
              <h4 className="text-md font-semibold text-emerald-300 mb-2">Swap OGCC for USDC</h4>
              {!(isExchangeEnabled && !isExchangePaused) && 
                <Alert variant='default' className="bg-orange-800/40 text-orange-300 border-orange-700 mb-3"><AlertCircle className="h-4 w-4"/>Exchange is currently disabled or paused.</Alert>
              }
              <Input 
                type="number" 
                placeholder={`Amount of ${ogccSymbol || 'OGCC'} to swap`} 
                value={ogccToExchange}
                onChange={(e) => setOgccToExchange(e.target.value)}
                disabled={!(isExchangeEnabled && !isExchangePaused)}
                className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600 placeholder-zinc-500"
              />
              {parseFloat(ogccToExchange) > 0 && (
                <p className="text-xs text-zinc-400 mt-1">
                  Estimated USDC to receive: <span className="text-emerald-300">{estimatedUsdcToReceive} USDC</span> (after fees)
                </p>
              )}
              <p className="text-xs text-zinc-500 mt-1">
                Your current allowance: {isLoadingOgccAllowance ? (<Loader2 size={12} className='animate-spin inline-block' /> as ReactNode) : formattedOgccAllowance} {ogccSymbol}
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                {needsOgccApproval && (
                  <Button 
                    onClick={handleApproveOgcc} 
                    disabled={isApprovingOgcc || isLoadingOgccAllowance || !(isExchangeEnabled && !isExchangePaused) || !ogccToExchange || parseFloat(ogccToExchange) <= 0}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    {isApprovingOgcc ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Approve {ogccSymbol || 'OGCC'}
                  </Button>
                )}
                <Button 
                  onClick={handleExchangeOgcc}
                  disabled={isExchanging || (needsOgccApproval && parseFloat(ogccToExchange) > 0) || !(isExchangeEnabled && !isExchangePaused) || !ogccToExchange || parseFloat(ogccToExchange) <= 0}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {isExchanging ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Exchange for USDC
                </Button>
              </div>
              {ogccApproveError && <p className="text-xs text-red-400 mt-1">Approval Error: {ogccApproveError.message}</p>}
              {exchangeError && <p className="text-xs text-red-400 mt-1">Exchange Error: {exchangeError.message}</p>}
            </>
          )}
          <hr className="my-3 border-zinc-700/50" />
          <h4 className="text-md font-semibold text-emerald-300 mb-2">Exchange Statistics</h4>
          <InfoRow label="Total Credits Exchanged" value={formattedTotalCreditsExchanged} unit={ogccSymbol} />
          <InfoRow label="Total USDC Collected" value={formattedTotalUsdcCollected} unit="USDC" />
          <InfoRow label="Total Protocol Fees (USDC)" value={formattedTotalProtocolFees} unit="USDC" />
          <InfoRow label="Total Rewards Funded (USDC)" value={formattedTotalRewardsFunded} unit="USDC" />
        </div>
      </CardContent>
    </Card>
  );
} 