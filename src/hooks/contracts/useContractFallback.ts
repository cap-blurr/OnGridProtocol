import { useState, useEffect } from 'react';

export function useContractFallback() {
  const [hasRpcError, setHasRpcError] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // Detect production environment
    setIsProduction(window.location.hostname === 'www.ongridprotocol.com' || window.location.hostname === 'ongridprotocol.com');
    
    // Listen for network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Monitor for RPC errors more aggressively
    const originalConsoleError = console.error;
    const originalFetch = window.fetch;
    
    // Override fetch to catch RPC errors early
    window.fetch = async (input, init) => {
      try {
        const response = await originalFetch(input, init);
        if (!response.ok && typeof input === 'string' && input.includes('alchemy.com')) {
          setErrorCount(prev => prev + 1);
          if (errorCount > 3) {
            setHasRpcError(true);
          }
        }
        return response;
      } catch (error) {
        if (typeof input === 'string' && input.includes('alchemy.com')) {
          setErrorCount(prev => prev + 1);
          setHasRpcError(true);
        }
        throw error;
      }
    };
    
    // Monitor console errors
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('CORS') || 
          message.includes('Failed to fetch') || 
          message.includes('Network Error') ||
          message.includes('ERR_INSUFFICIENT_RESOURCES') ||
          message.includes('alchemy.com') ||
          message.includes('Failed to load resource')) {
        setErrorCount(prev => prev + 1);
        setHasRpcError(true);
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      console.error = originalConsoleError;
      window.fetch = originalFetch;
    };
  }, [errorCount]);

  // Auto-recovery after 30 seconds
  useEffect(() => {
    if (hasRpcError) {
      const timer = setTimeout(() => {
        setHasRpcError(false);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [hasRpcError]);

  const retry = () => {
    setHasRpcError(false);
    setErrorCount(0);
  };

  return {
    hasRpcError,
    isOnline,
    isProduction,
    errorCount,
    shouldUseFallback: hasRpcError || !isOnline || (isProduction && errorCount > 2),
    retry
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