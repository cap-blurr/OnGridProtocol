"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

export default function Providers({ children }: { children: React.ReactNode }) {
  const solanaConnectors = toSolanaWalletConnectors();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_PROJECT_ID || ""}
      config={{
        appearance: {
          walletChainType: "ethereum-and-solana",
          theme: "dark",
          accentColor: "#28a745",
          logo: '/ongrid-logo.png',
        },
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
