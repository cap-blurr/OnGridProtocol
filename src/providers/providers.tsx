'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { UserTypeProvider } from './userType';

// Wagmi configuration
const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'OnGridProtocol',
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
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
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              ethereum: {
                createOnLogin: 'users-without-wallets'
              }
            }
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