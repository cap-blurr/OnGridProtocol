'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { createConfig, http, fallback } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { UserTypeProvider } from './userType';
import { injected } from 'wagmi/connectors';

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

// Wagmi configuration for contract interactions - Privy v2 handles wallet connections directly
const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected({
      // This allows wagmi to work with Privy's injected wallet
      // No specific target needed - will detect Privy's injected wallet automatically
    }),
  ],
  transports: {
    [baseSepolia.id]: baseSepoliaTransports,
  },
  ssr: true,
  // Add polling configuration
  pollingInterval: 4000, // Poll every 4 seconds instead of default
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5000, // 5 seconds
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
            },
            supportedChains: [baseSepolia],
            loginMethods: ['email', 'sms','google','wallet'],
            defaultChain: baseSepolia,
            // Only use embedded wallets and email/SMS to avoid WalletConnect
            walletConnectCloudProjectId: undefined
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