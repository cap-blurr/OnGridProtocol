import { useState, useEffect } from 'react';
import { rpcCORSHandler } from '@/lib/rpc-cors-handler';

export function useContractFallback() {
  const [hasRpcError, setHasRpcError] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [isProduction, setIsProduction] = useState(false);
  const [hasCORSError, setHasCORSError] = useState(false);

  useEffect(() => {
    // Detect production environment
    setIsProduction(window.location.hostname === 'www.ongridprotocol.com' || window.location.hostname === 'ongridprotocol.com');
    
    // Listen for network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Setup CORS error handler
    rpcCORSHandler.onCORSError((error) => {
      console.warn('CORS error detected, activating fallback mode:', error);
      setHasCORSError(true);
      setHasRpcError(true);
    });
    
    // Monitor for RPC errors more aggressively
    const originalConsoleError = console.error;
    const originalFetch = window.fetch;
    
    // Override fetch to catch RPC errors early
    window.fetch = async (input, init) => {
      try {
        const response = await originalFetch(input, init);
        if (!response.ok && typeof input === 'string' && input.includes('alchemy.com')) {
          console.warn('RPC request failed:', response.status, response.statusText);
          setErrorCount(prev => prev + 1);
          if (errorCount > 3) {
            setHasRpcError(true);
          }
        }
        return response;
      } catch (error: any) {
        // Enhanced CORS error detection
        if (typeof input === 'string' && input.includes('alchemy.com')) {
          console.warn('RPC fetch error:', error.message);
          
          // Specifically catch CORS errors
          if (error.message && (
            error.message.includes('CORS') || 
            error.message.includes('Failed to fetch') ||
            error.message.includes('Network Error') ||
            error.message.includes('Access-Control-Allow-Origin')
          )) {
            console.warn('CORS/Network error detected, activating fallback mode');
            setHasRpcError(true);
          } else {
            setErrorCount(prev => prev + 1);
            if (errorCount > 2) { // Lower threshold for production
              setHasRpcError(true);
            }
          }
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
          message.includes('Failed to load resource') ||
          message.includes('Access-Control-Allow-Origin') ||
          message.includes('net::ERR_FAILED')) {
        console.warn('RPC error detected via console:', message);
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
    setHasCORSError(false);
    rpcCORSHandler.clearErrors();
  };

  const getDiagnosticReport = () => {
    return rpcCORSHandler.generateDiagnosticReport();
  };

  return {
    hasRpcError,
    hasCORSError,
    isOnline,
    isProduction,
    errorCount,
    shouldUseFallback: hasRpcError || hasCORSError || !isOnline || (isProduction && errorCount > 2),
    retry,
    getDiagnosticReport
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