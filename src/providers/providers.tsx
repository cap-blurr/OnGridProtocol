'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { UserTypeProvider } from './userType';

// Minimal Wagmi configuration without external connectors
// This is only for contract interactions, not wallet connections
const config = createConfig({
  chains: [baseSepolia],
  connectors: [], // Empty connectors - Privy will handle wallet connections
  ssr: true,
  transports: {
    [baseSepolia.id]: http('https://base-sepolia.g.alchemy.com/v2/1gJpy5A2EiQrD8o1RIjPOo0-xXf_CFLA'),
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmbauroii017tla0lzr7ip7d0'}
          clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
          config={{
            // Let Privy handle all wallet connections
            appearance: {
              theme: 'dark',
              accentColor: '#10B981', // emerald-500 to match your theme
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              createOnLogin: 'users-without-wallets'
            },
            // Supported wallet connectors - all handled by Privy
            supportedChains: [baseSepolia],
          }}
        >
          <UserTypeProvider>
            {children}
          </UserTypeProvider>
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}