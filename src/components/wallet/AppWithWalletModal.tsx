'use client';

import { ReactNode, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface AppWithWalletModalProps {
  children: ReactNode;
}

export function AppWithWalletModal({ children }: AppWithWalletModalProps) {
  const { authenticated, ready: privyReady } = usePrivy();
  const { isConnected, address } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  // Sync Privy authentication with Wagmi connection
  useEffect(() => {
    const syncWalletConnection = async () => {
      if (!privyReady) return;

      try {
        if (authenticated && !isConnected) {
          // Privy is authenticated but Wagmi is not connected
          console.log('Syncing wallet: Privy authenticated, connecting Wagmi...');
          await connectAsync({ connector: injected() });
        } else if (!authenticated && isConnected) {
          // Wagmi is connected but Privy is not authenticated
          console.log('Syncing wallet: Privy not authenticated, disconnecting Wagmi...');
          disconnect();
        }
      } catch (error) {
        console.error('Error syncing wallet connection:', error);
      }
    };

    syncWalletConnection();
  }, [authenticated, isConnected, privyReady, connectAsync, disconnect]);

  return (
    <>
      {children}
    </>
  );
} 