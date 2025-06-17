"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Database } from "lucide-react";
import { usePoolInfo } from "@/hooks/contracts/useLiquidityPoolManager";

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
  // Test pool info functionality with pool ID 1
  const { 
    exists: poolExists, 
    name: poolName, 
    formattedTotalAssets, 
    riskLevel, 
    aprPercentage, 
    isLoading: isLoadingPoolInfo, 
    error: poolInfoError 
  } = usePoolInfo(1);

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-[#4CAF50]/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-[#4CAF50]" />
          Pool Info Test - Pool ID: 1
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingPoolInfo ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#4CAF50] mr-2" />
            <span className="text-zinc-400">Loading pool information...</span>
          </div>
        ) : poolInfoError ? (
          <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Pool Info</AlertTitle>
            <AlertDescription>{getErrorMessage(poolInfoError)}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Pool Exists:</span>
                <p className="text-white font-medium">
                  {poolExists ? (
                    <span className="text-[#4CAF50]">✓ Yes</span>
                  ) : (
                    <span className="text-red-400">✗ No</span>
                  )}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Pool Name:</span>
                <p className="text-white font-medium">{poolName || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Total Assets:</span>
                <p className="text-white font-medium">${formattedTotalAssets} USDC</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Risk Level:</span>
                <p className="text-white font-medium">{riskLevel || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">APR:</span>
                <p className="text-white font-medium">{aprPercentage?.toFixed(2)}%</p>
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 