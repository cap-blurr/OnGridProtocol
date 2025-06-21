"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Database, Info, RefreshCw, Network, Wallet, CheckCircle } from "lucide-react";
import { usePoolInfo, useUserShares, useDepositToPool, usePoolCount } from "@/hooks/contracts/useLiquidityPoolManager";
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove, isApprovalNeeded } from '@/hooks/contracts/useUSDC';
import { useContractAddresses } from '@/hooks/contracts/useDeveloperRegistry';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Helper function to safely get an error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return "An unknown error occurred";
}

export default function PoolInfoTest() {
  const [poolId, setPoolId] = useState(1);
  const [investAmount, setInvestAmount] = useState('');
  const { address: userAddress, isConnected } = useAccount();
  const addresses = useContractAddresses();

  // Test Pool Info for the specified pool ID
  const {
    exists,
    name,
    totalAssets,
    totalShares,
    formattedTotalAssets,
    riskLevel,
    aprRate,
    aprPercentage,
    isLoading: isLoadingPoolInfo,
    error: poolInfoError
  } = usePoolInfo(poolId);

  // Get pool count
  const {
    poolCount,
    formattedPoolCount,
    isLoading: isLoadingCount,
    error: countError
  } = usePoolCount();

  // User shares in this pool
  const {
    shares: userShares,
    isLoading: isLoadingUserShares,
    error: userSharesError
  } = useUserShares(poolId, userAddress);

  // USDC functions
  const { formattedBalance: usdcBalance } = useUSDCBalance(userAddress);
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance(
    userAddress,
    addresses.liquidityPoolManagerProxy as `0x${string}`
  );
  const { approve, isLoading: isApproving } = useUSDCApprove();
  const { deposit, isLoading: isDepositing } = useDepositToPool();

  // Check if approval is needed
  const needsApproval = investAmount && parseFloat(investAmount) > 0 && 
    isApprovalNeeded(allowance, investAmount);

  const handleApprove = () => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      toast.error('Please enter a valid amount to approve.');
      return;
    }
    approve(addresses.liquidityPoolManagerProxy as `0x${string}`, investAmount);
  };

  const handleDeposit = () => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      toast.error('Please enter a valid deposit amount.');
      return;
    }
    deposit(poolId, investAmount);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 backdrop-blur-sm border border-oga-green/40">
        <CardHeader>
          <CardTitle className="text-oga-green flex items-center gap-2">
            <Info className="h-5 w-5 text-oga-green" />
            Pool Information Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pool ID Input */}
          <div className="flex gap-2">
            <Input
              type="number"
              value={poolId}
              onChange={(e) => setPoolId(parseInt(e.target.value) || 1)}
              placeholder="Pool ID"
              className="bg-black/20 border-oga-green/30 text-oga-green"
              min="1"
            />
            <Button
              onClick={() => setPoolId(1)}
              className="bg-oga-green hover:bg-oga-green/80 text-black"
            >
              Test Pool 1
            </Button>
          </div>

          {/* Pool Count Info */}
          <div className="p-3 bg-black/20 border border-oga-green/20 rounded-lg">
            <h3 className="text-oga-green font-medium mb-2">Pool Count Information</h3>
            {isLoadingCount ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-oga-green/80">Loading pool count...</span>
              </div>
            ) : countError ? (
              <Alert className="bg-red-900/30 border-red-700">
                <AlertDescription className="text-red-300">
                  Error loading pool count: {countError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-oga-green/80">Total Pools:</span>
                  <span className="text-oga-green ml-2">{formattedPoolCount}</span>
                </div>
                <div>
                  <span className="text-oga-green/80">Raw Pool Count:</span>
                  <span className="text-oga-green ml-2">{poolCount?.toString() || '0'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Pool Info Display */}
          <div className="p-3 bg-black/20 border border-oga-green/20 rounded-lg">
            <h3 className="text-oga-green font-medium mb-2">Pool ID {poolId} Information</h3>
            
            {isLoadingPoolInfo ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-oga-green/80">Loading pool info...</span>
              </div>
            ) : poolInfoError ? (
              <Alert className="bg-red-900/30 border-red-700">
                <AlertDescription className="text-red-300">
                  Error: {poolInfoError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-oga-green/80">Exists:</span>
                    <span className={`ml-2 ${exists ? 'text-oga-green' : 'text-red-400'}`}>
                      {exists ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-oga-green/80">Name:</span>
                    <span className="text-oga-green ml-2">{name || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-oga-green/80">Total Assets:</span>
                    <span className="text-oga-green ml-2">{formattedTotalAssets} USDC</span>
                  </div>
                  <div>
                    <span className="text-oga-green/80">Total Shares:</span>
                    <span className="text-oga-green ml-2">{totalShares?.toString() || '0'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-oga-green/80">Risk Level:</span>
                    <span className="text-oga-green ml-2">{riskLevel || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-oga-green/80">APR:</span>
                    <span className="text-oga-green ml-2">{aprPercentage.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Shares */}
          <div className="p-3 bg-black/20 border border-oga-green/20 rounded-lg">
            <h3 className="text-oga-green font-medium mb-2">Your Pool Investments</h3>
            
            {!isConnected ? (
              <p className="text-oga-green/80 text-sm">Connect your wallet to see your shares</p>
            ) : isLoadingUserShares ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-oga-green/80">Loading your shares...</span>
              </div>
            ) : userSharesError ? (
              <Alert className="bg-red-900/30 border-red-700">
                <AlertDescription className="text-red-300">
                  Error loading shares: {userSharesError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-oga-green/80">Your Shares in Pool {poolId}:</span>
                  <span className="text-oga-green ml-2">{userShares?.toString() || '0'}</span>
                </div>
                <div>
                  <span className="text-oga-green/80">Your USDC Balance:</span>
                  <span className="text-oga-green ml-2">{usdcBalance} USDC</span>
                </div>
              </div>
            )}
          </div>

          {/* Investment Test Section */}
          {exists && isConnected && (
            <div className="p-3 bg-black/20 border border-oga-green/20 rounded-lg">
              <h3 className="text-oga-green font-medium mb-3">Test Investment</h3>
              
              <div className="space-y-3">
                <Input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder="Amount to invest (USDC)"
                  className="bg-black/20 border-oga-green/30 text-oga-green"
                  step="0.000001"
                  min="0"
                />
                
                <div className="flex gap-2">
                  {needsApproval ? (
                    <Button
                      onClick={handleApprove}
                      disabled={isApproving || !investAmount || parseFloat(investAmount) <= 0}
                      className="flex-1 bg-oga-yellow hover:bg-oga-yellow/80 text-black"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        'Approve USDC'
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDeposit}
                      disabled={isDepositing || !investAmount || parseFloat(investAmount) <= 0}
                      className="flex-1 bg-oga-green hover:bg-oga-green/80 text-black"
                    >
                      {isDepositing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Depositing...
                        </>
                      ) : (
                        'Deposit to Pool'
                      )}
                    </Button>
                  )}
                </div>
                
                {investAmount && parseFloat(investAmount) > 0 && (
                  <div className="text-xs text-oga-green/80">
                    {needsApproval ? 
                      'You need to approve USDC spending first' : 
                      'Ready to invest in the pool'
                    }
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contract Addresses for Debugging */}
          <div className="p-3 bg-black/20 border border-oga-green/20 rounded-lg">
            <h3 className="text-oga-green font-medium mb-2">Contract Addresses (Debug)</h3>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-oga-green/80">USDC Address:</span>
                <span className="text-oga-green ml-2 font-mono">{addresses.usdc}</span>
              </div>
              <div>
                <span className="text-oga-green/80">Pool Manager:</span>
                <span className="text-oga-green ml-2 font-mono">{addresses.liquidityPoolManagerProxy}</span>
              </div>
              <div>
                <span className="text-oga-green/80">Your Address:</span>
                <span className="text-oga-green ml-2 font-mono">{userAddress || 'Not connected'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 