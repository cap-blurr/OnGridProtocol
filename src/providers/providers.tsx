'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { UserTypeProvider } from './userType';

// Use only Alchemy RPC URL to isolate issues - NO FALLBACKS
const ALCHEMY_RPC_URL = 'https://base-sepolia.g.alchemy.com/v2/TjWdEzlbzj1Xr_Bj5K6Z2';

// Create custom Base Sepolia chain to prevent default RPC usage
const customBaseSepolia = {
  ...baseSepolia,
  rpcUrls: {
    default: { http: [ALCHEMY_RPC_URL] },
    public: { http: [ALCHEMY_RPC_URL] }, // Override public RPCs too
  }
};

const config = createConfig({
  chains: [customBaseSepolia],
  transports: {
    [baseSepolia.id]: http(ALCHEMY_RPC_URL, {
      // Strict configuration - no retries to prevent fallbacks
      retryCount: 0,
      timeout: 10000, // 10 second timeout
    }),
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 3,
        staleTime: 30000, // 30 seconds
      },
    },
  }));

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmbauroii017tla0lzr7ip7d0'}
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
        loginMethods: ['email','wallet'],
        defaultChain: baseSepolia,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <UserTypeProvider>
            {children}
          </UserTypeProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}