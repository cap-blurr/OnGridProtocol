'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { createConfig, http, fallback } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { UserTypeProvider } from './userType';
import { injected, walletConnect } from 'wagmi/connectors';

// Multiple RPC endpoints for redundancy - prioritize CORS-friendly endpoints
const baseSepoliaTransports = fallback([
  // Primary: Official Base Sepolia RPC (no CORS restrictions)
  http('https://sepolia.base.org', {
    batch: false,
    retryDelay: 500,
    retryCount: 3,
  }),
  // Secondary: Public Node RPC (generally CORS-friendly)  
  http('https://base-sepolia-rpc.publicnode.com', {
    batch: false,
    retryDelay: 800,
    retryCount: 3,
  }),
  // Tertiary: Additional public endpoint
  http('https://base-sepolia.blockpi.network/v1/rpc/public', {
    batch: false,
    retryDelay: 1000,
    retryCount: 2,
  }),
  // Last resort: Alchemy (may fail due to CORS in production)
  ...(typeof window === 'undefined' || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ? [
    http('https://base-sepolia.g.alchemy.com/v2/1gJpy5A2EiQrD8o1RIjPOo0-xXf_CFLA', {
      batch: false,
      retryDelay: 1000,
      retryCount: 1,
    })
  ] : []),
]);

// Wagmi configuration for contract interactions - Enhanced for Privy v2 compatibility
const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    // Enhanced injected connector that properly detects Privy wallets
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [baseSepolia.id]: baseSepoliaTransports,
  },
  ssr: true,
  // Enhanced polling configuration for better responsiveness
  pollingInterval: 3000, // Poll every 3 seconds
  // Add batch configuration
  batch: {
    multicall: {
      batchSize: 1024,
      wait: 16,
    },
  },
  // Sync connected state between Privy and Wagmi
  syncConnectedChain: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 3000, // 3 seconds 
        gcTime: 1000 * 60 * 10, // 10 minutes
      },
    },
  }));

  return (
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmbauroii017tla0lzr7ip7d0'}
          clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
          config={{
            appearance: {
              theme: 'dark',
          accentColor: '#4CAF50',
            },
            embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
            },
            supportedChains: [baseSepolia],
        loginMethods: ['email', 'sms','google','wallet'],
        defaultChain: baseSepolia,
        // Disable WalletConnect to avoid conflicts
        externalWallets: {
          walletConnect: {
            enabled: false,
          },
        },
          }}
        >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <UserTypeProvider>
            {children}
          </UserTypeProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </PrivyProvider>
  );
}