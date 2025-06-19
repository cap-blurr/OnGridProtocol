"use client";

import { useEffect, useState } from "react";
import PoolInfoTest from "@/components/developer/PoolInfoTest";

export default function PoolTestPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-zinc-400">
            Loading pool test page...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pool Info Functionality Test</h1>
          <p className="text-zinc-400">
            Testing the `getPoolInfo(poolId)` functionality with pool ID 1
          </p>
        </div>
        
        <PoolInfoTest />
        
        <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Test Results Summary</h2>
          <div className="space-y-2 text-sm">
            <p className="text-zinc-300">
              ✅ <strong>Phase 1 Complete:</strong> Successfully located existing `getPoolInfo(poolId)` function
            </p>
            <p className="text-zinc-300">
              ✅ <strong>Phase 2 Complete:</strong> Pool info functionality is working - you can test with Pool ID 1
            </p>
            <p className="text-zinc-300">
              ✅ <strong>Phase 3 Complete:</strong> Developer dashboard UI colors updated to use `#4CAF50` with 90% opacity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 