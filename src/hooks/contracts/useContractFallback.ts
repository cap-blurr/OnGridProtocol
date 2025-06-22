import { useState, useEffect } from 'react';

export function useContractFallback() {
  const [hasRpcError, setHasRpcError] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Listen for network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Monitor for CORS/RPC errors in console
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('CORS') || 
          message.includes('Failed to fetch') || 
          message.includes('Network Error') ||
          message.includes('base-sepolia.g.alchemy.com')) {
        setHasRpcError(true);
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      console.error = originalConsoleError;
    };
  }, []);

  // Auto-recovery after 30 seconds
  useEffect(() => {
    if (hasRpcError) {
      const timer = setTimeout(() => {
        setHasRpcError(false);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [hasRpcError]);

  return {
    hasRpcError,
    isOnline,
    shouldUseFallback: hasRpcError || !isOnline
  };
}

// Mock data for fallback scenarios
export const mockPortfolioMetrics = {
  totalInvested: 0,
  currentValue: 0,
  totalReturns: 0,
  availableWithdrawals: 0,
  totalProjects: 0,
  activePools: 0,
  averageROI: 0,
  monthlyGrowth: 0,
};

export const mockPoolInvestments = {
  totalValue: '0',
  count: 0,
  details: []
};

export const mockTransactions: any[] = [];

export const mockProjectInvestments: any[] = []; 