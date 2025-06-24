import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../providers/providers";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnGrid Protocol - Solar Investment Platform",
  description: "Invest in solar energy projects with blockchain transparency",
};

// Global BigInt serialization fix
if (typeof window !== 'undefined') {
  // Add BigInt support to JSON.stringify
  (BigInt.prototype as any).toJSON = function() {
    return this.toString();
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
