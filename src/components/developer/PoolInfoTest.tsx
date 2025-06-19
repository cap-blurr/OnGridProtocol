"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Database, Info, RefreshCw, Network, Wallet, CheckCircle } from "lucide-react";
import { usePoolInfo } from "@/hooks/contracts/useLiquidityPoolManager";
import { useReadContract } from 'wagmi';
import { useContractAddresses } from '@/hooks/contracts/useDeveloperRegistry';
import LiquidityPoolManagerABI from '@/contracts/abis/LiquidityPoolManager.json';
import { useUSDC } from '@/hooks/contracts/useUSDC';
import { useAccount } from 'wagmi';
import { useState } from 'react';

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
  const addresses = useContractAddresses();
  const { address: userAddress } = useAccount();
  const [retryCount, setRetryCount] = useState(0);
  const [approvalAmount, setApprovalAmount] = useState('1000');
  
  // Direct contract call for debugging
  const { 
    data: rawData, 
    isLoading: rawLoading, 
    error: rawError,
    status: rawStatus,
    failureReason,
    fetchStatus,
    refetch: refetchRaw
  } = useReadContract({
    address: addresses.liquidityPoolManagerProxy as `0x${string}`,
    abi: LiquidityPoolManagerABI.abi,
    functionName: 'getPoolInfo',
    args: [BigInt(1)],
    query: {
      enabled: true,
      retry: false, // Disable retry to see the raw error
      staleTime: 0, // Always refetch
      gcTime: 0, // Don't cache
    }
  });

  // Test pool info functionality with pool ID 1 using the hook
  const { 
    exists: poolExists, 
    name: poolName, 
    formattedTotalAssets, 
    riskLevel, 
    aprPercentage, 
    isLoading: isLoadingPoolInfo, 
    error: poolInfoError 
  } = usePoolInfo(1);

  // USDC functionality for approval testing
  const {
    balance: usdcBalance,
    formattedBalance,
    allowance: usdcAllowance,
    formattedAllowance,
    approve,
    approveMax,
    isLoading: isApprovalLoading,
    isSuccess: isApprovalSuccess,
    error: approvalError,
    isApprovalNeeded,
  } = useUSDC(userAddress, addresses.liquidityPoolManagerProxy);

  console.log('Pool Info Debug:', {
    rawData,
    rawLoading,
    rawError,
    rawStatus,
    failureReason,
    fetchStatus,
    addresses: addresses.liquidityPoolManagerProxy,
    retryCount,
    timestamp: new Date().toISOString(),
    userAddress,
    usdcBalance: usdcBalance?.toString(),
    usdcAllowance: usdcAllowance?.toString(),
  });

  // Manual retry function
  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    try {
      await refetchRaw();
    } catch (error) {
      console.error('Manual retry failed:', error);
    }
  };

  // Check if it's a 500 server error
  const is500Error = rawError && (
    getErrorMessage(rawError).includes('500') || 
    getErrorMessage(rawError).includes('Internal Server Error') ||
    getErrorMessage(rawError).includes('server responded with a status of 500')
  );

  // Handle approval
  const handleApproval = () => {
    if (!userAddress) {
      alert('Please connect your wallet first');
      return;
    }
    approve(addresses.liquidityPoolManagerProxy as `0x${string}`, approvalAmount);
  };

  // Handle max approval
  const handleMaxApproval = () => {
    if (!userAddress) {
      alert('Please connect your wallet first');
      return;
    }
    approveMax(addresses.liquidityPoolManagerProxy as `0x${string}`);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-[#4CAF50]" />
          Pool Info & USDC Approval Test - Pool ID: 1
          <Button
            onClick={handleRetry}
            size="sm"
            variant="outline"
            className="ml-auto border-[#4CAF50]/30 hover:bg-[#4CAF50]/10"
            disabled={rawLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${rawLoading ? 'animate-spin' : ''}`} />
            Retry ({retryCount})
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Status */}
        <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
          <h4 className="text-purple-300 font-medium mb-2 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet Status
          </h4>
          <div className="text-xs text-purple-200 space-y-1">
            <div>Connected: {userAddress ? 'Yes' : 'No'}</div>
            <div>Address: {userAddress || 'Not connected'}</div>
            <div>USDC Balance: {formattedBalance} USDC</div>
            <div>Pool Allowance: {formattedAllowance} USDC</div>
            {userAddress && (
              <div>Approval Needed (1000 USDC): {isApprovalNeeded('1000') ? 'Yes' : 'No'}</div>
            )}
          </div>
        </div>

        {/* USDC Approval Section */}
        {userAddress && (
          <div className="p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <h4 className="text-yellow-300 font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              USDC Approval Testing
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Amount to approve"
                  value={approvalAmount}
                  onChange={(e) => setApprovalAmount(e.target.value)}
                  className="bg-black/40 border-yellow-700/30 text-white"
                />
                <Button
                  onClick={handleApproval}
                  disabled={isApprovalLoading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isApprovalLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Approve'
                  )}
                </Button>
              </div>
              <Button
                onClick={handleMaxApproval}
                disabled={isApprovalLoading}
                variant="outline"
                className="w-full border-yellow-700/30 hover:bg-yellow-900/20"
              >
                {isApprovalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Approve Maximum Amount (Unlimited)
              </Button>
              {isApprovalSuccess && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-400">Approval Successful!</AlertTitle>
                  <AlertDescription className="text-green-300">
                    USDC approval completed. You can now invest in pools.
                  </AlertDescription>
                </Alert>
              )}
              {approvalError && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertTitle className="text-red-400">Approval Failed</AlertTitle>
                  <AlertDescription className="text-red-300">
                    {getErrorMessage(approvalError)}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* Network Status */}
        <div className="p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
            <Network className="w-4 h-4" />
            Network Status
          </h4>
          <div className="text-xs text-blue-200 space-y-1">
            <div>Chain: Base Sepolia (84532)</div>
            <div>RPC: {navigator.onLine ? 'Online' : 'Offline'}</div>
            <div>Timestamp: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
          <h4 className="text-zinc-300 font-medium mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Debug Information
          </h4>
          <div className="text-xs text-zinc-400 space-y-1">
            <div>Contract Address: {addresses.liquidityPoolManagerProxy}</div>
            <div>USDC Address: {addresses.usdc}</div>
            <div>Raw Status: {rawStatus}</div>
            <div>Fetch Status: {fetchStatus}</div>
            <div>Raw Loading: {rawLoading ? 'true' : 'false'}</div>
            <div>Hook Loading: {isLoadingPoolInfo ? 'true' : 'false'}</div>
            <div>Retry Count: {retryCount}</div>
            {rawData ? <div>Raw Data Length: {JSON.stringify(rawData as any).length} chars</div> : null}
            {rawError && (
              <div className="text-red-400 space-y-1">
                <div>Raw Error: {getErrorMessage(rawError)}</div>
                {is500Error && (
                  <div className="text-orange-400">⚠️ This appears to be a server error (500)</div>
                )}
              </div>
            )}
            {poolInfoError && <div className="text-red-400">Hook Error: {getErrorMessage(poolInfoError)}</div>}
            {failureReason && <div className="text-orange-400">Failure Reason: {JSON.stringify(failureReason)}</div>}
          </div>
        </div>

        {/* 500 Error Special Handling */}
        {is500Error && (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-400">Server Error Detected (500)</AlertTitle>
            <AlertDescription className="text-orange-300">
              <div className="space-y-2">
                <div>The contract call is likely succeeding, but there's a server error in processing the response.</div>
                <div className="text-xs mt-2 p-2 bg-orange-900/20 rounded">
                  <div><strong>Possible solutions:</strong></div>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Wait 30-60 seconds and retry (rate limiting)</li>
                    <li>Check your internet connection</li>
                    <li>Try switching to a different RPC endpoint</li>
                    <li>Clear browser cache and reload the page</li>
                    <li>Check if Alchemy RPC is experiencing downtime</li>
                  </ul>
                </div>
                <Button
                  onClick={handleRetry}
                  size="sm"
                  className="mt-2 bg-orange-600 hover:bg-orange-700"
                  disabled={rawLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${rawLoading ? 'animate-spin' : ''}`} />
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {rawLoading || isLoadingPoolInfo ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#4CAF50] mr-2" />
            <span className="text-zinc-400">Loading pool information...</span>
          </div>
        ) : rawError || poolInfoError ? (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-400">Error Loading Pool Info</AlertTitle>
            <AlertDescription className="text-red-300">
              <div className="space-y-2">
                <div>Primary Error: {rawError ? getErrorMessage(rawError) : getErrorMessage(poolInfoError)}</div>
                {rawError && poolInfoError && (
                  <div>Secondary Error: {getErrorMessage(poolInfoError)}</div>
                )}
                <div className="text-xs mt-2 p-2 bg-red-900/20 rounded">
                  <div>This might be caused by:</div>
                  <ul className="list-disc list-inside mt-1">
                    <li>RPC provider issues (Alchemy rate limiting)</li>
                    <li>Network connectivity problems</li>
                    <li>Contract call timeout</li>
                    <li>Memory issues on the frontend</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ) : rawData ? (
          <div className="space-y-4">
            <Alert className="border-[#4CAF50]/50 bg-[#4CAF50]/10">
              <AlertCircle className="h-4 w-4 text-[#4CAF50]" />
              <AlertTitle className="text-[#4CAF50]">Success - Raw Contract Call</AlertTitle>
              <AlertDescription className="text-[#4CAF50]/80">
                Contract call succeeded! Data received: {JSON.stringify(rawData).substring(0, 100)}...
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-lg">
                <h3 className="text-[#4CAF50] font-medium mb-2">Pool Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Pool Exists:</span>
                    <span className="text-white">{poolExists ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Pool Name:</span>
                    <span className="text-white">{poolName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Assets:</span>
                    <span className="text-white">${formattedTotalAssets} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Risk Level:</span>
                    <span className="text-white">{riskLevel || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">APR:</span>
                    <span className="text-white">{aprPercentage ? `${aprPercentage}%` : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
                <h3 className="text-zinc-300 font-medium mb-2">Raw Contract Response</h3>
                <div className="text-xs text-zinc-400 break-all">
                  {JSON.stringify(rawData, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-lg">
              <p className="text-[#4CAF50] text-sm">
                ✓ Pool info functionality is working correctly! The `getPoolInfo(poolId)` function successfully retrieves:
              </p>
              <ul className="text-[#4CAF50] text-xs mt-2 space-y-1 ml-4">
                <li>• Pool existence status</li>
                <li>• Pool name and metadata</li>
                <li>• Total assets in the pool</li>
                <li>• Risk level and APR rates</li>
              </ul>
              {userAddress && !isApprovalNeeded('1000') && (
                <div className="mt-3 p-2 bg-green-900/20 border border-green-700 rounded">
                  <p className="text-green-300 text-xs">
                    ✓ USDC approval is set! You should be able to invest in this pool now.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-400">No Data</AlertTitle>
            <AlertDescription className="text-orange-300">
              No data received from contract call, but no error either. This might indicate the pool doesn't exist or there's a configuration issue.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 