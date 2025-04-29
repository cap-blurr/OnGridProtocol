import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@coinbase/onchainkit/styles.css';
import { ToastProvider } from "@/providers/toast-provider";
import { Providers } from "@/providers/providers";
import { cookies } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { AppWithWalletModal } from "@/components/wallet/AppWithWalletModal";

// Load B612 font family
const b612 = localFont({
  src: [
    {
      path: "./fonts/B612.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/B612.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-b612",
});

// Define a function to get config - similar to what was in the example
function getConfig() {
  return createConfig({
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
}

export const metadata: Metadata = {
  title: "OnGridProtocol",
  description:
    "Join us in transforming the energy sector through community-driven investments.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const cookieString = (await cookieStore).getAll().map((cookie: { name: any; value: any; }) => `${cookie.name}=${cookie.value}`).join('; ');
  const initialState = cookieToInitialState(getConfig(), cookieString);
  
  return (
    <html lang="en">
      <body
        className={`${b612.variable} font-b612 bg-neutral-950 antialiased`}
      >
        <Providers initialState={initialState}>
          <AppWithWalletModal>
            {children}
            <ToastProvider />
          </AppWithWalletModal>
        </Providers>
      </body>
    </html>
  );
}
