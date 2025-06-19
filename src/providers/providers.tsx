'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { createConfig, http, fallback } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { UserTypeProvider } from './userType';
import { injected } from 'wagmi/connectors';

// Multiple RPC endpoints for redundancy
const baseSepoliaTransports = fallback([
  http('https://base-sepolia.g.alchemy.com/v2/1gJpy5A2EiQrD8o1RIjPOo0-xXf_CFLA', {
    batch: false, // Disable batching to avoid server errors
    retryDelay: 1000,
    retryCount: 3,
  }),
  http('https://sepolia.base.org', {
    batch: false,
    retryDelay: 1000,
    retryCount: 3,
  }),
  http('https://base-sepolia-rpc.publicnode.com', {
    batch: false,
    retryDelay: 1000,
    retryCount: 3,
  }),
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
        loginMethods: ['wallet', 'email', 'sms'],
        defaultChain: baseSepolia,
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