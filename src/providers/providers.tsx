'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { UserTypeProvider } from './userType';
import { injected } from 'wagmi/connectors';

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
    [baseSepolia.id]: http('https://base-sepolia.g.alchemy.com/v2/1gJpy5A2EiQrD8o1RIjPOo0-xXf_CFLA'),
  },
  ssr: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

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