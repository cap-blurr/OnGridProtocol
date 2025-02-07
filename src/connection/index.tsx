'use client'

import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

import { solana, solanaTestnet, solanaDevnet, base, baseSepolia } from '@reown/appkit/networks'

import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { ReactNode } from 'react'

export const ethersAdapter = new EthersAdapter()

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
})

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

// 3. Set up the metadata - Optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}


createAppKit({
  adapters: [ethersAdapter, solanaWeb3JsAdapter],
  networks: [base, baseSepolia, solanaTestnet, solanaDevnet],
  metadata,
  projectId,
  features: {
    analytics: true,
    connectMethodsOrder: ['wallet'],
  }
})

export function AppKit({ children }: { children: ReactNode }) {
    return children;
  }