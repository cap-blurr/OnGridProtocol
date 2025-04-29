'use client';
 
import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';
 
const wagmiConfig = createConfig({
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

const queryClient = new QueryClient();
 
export function Providers({ 
  children, 
  initialState 
}: { 
  children: ReactNode;
  initialState?: any;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              name: 'OnGrid Protocol',
              logo: '/ongrid-logo.png',
              mode: 'dark',
              theme: 'default',
            },
            wallet: {
              display: 'modal',
              termsUrl: 'https://ongridprotocol.com/terms',
              privacyUrl: 'https://ongridprotocol.com/privacy',
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}