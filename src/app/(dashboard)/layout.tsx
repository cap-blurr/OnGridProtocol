import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { ToastProvider } from "@/providers/toast-provider";
import Providers from "@/providers/privy-provider";
import Sidebar from "@/components/dashboard/layout/sidebar";
import Link from "next/link";
import ConnectButton from "@/components/layout/ConnectButton";
import { MobileNav } from "@/components/layout/MobileNav";
import Image from "next/image";
import logo from "../../../public/ongrid-logo.png";

export const metadata: Metadata = {
  title: "OnGridProtocol | Dashboard",
  description:
    "Join us in transforming the energy sector through community-driven investments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` bg-neutral-950 antialiased`}>
        {" "}
        <Providers>
          <div className={`flex h-screen`}>
            <Sidebar />
            <div className="w-full flex flex-1 flex-col">
              <header className="h-20 px-6 border-b border-white/20 bg-oga-black flex gap-6 text-white items-center justify-between">
              <span className="hidden lg:block"></span>
                <Link href="/" className="lg:hidden ml-12">
                  <Image
                    src={logo}
                    alt="Ongrid-logo"
                    className="w-24 md:32 lg:w-36"
                  />
                </Link>
                <div className="hidden lg:flex justify-between text-white gap-12">
                  <Link
                    href="/?#about"
                    className="hidden md:block font-medium cursor-pointer hover:text-oga-yellow-dark"
                  >
                    About
                  </Link>
                  <Link
                    href="/?#how-it-works"
                    className="hidden md:block font-medium cursor-pointer hover:text-oga-yellow-dark"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/projects"
                    className="cursor-pointer hover:text-oga-yellow-dark"
                  >
                    Projects
                  </Link>
                  <Link
                    href="/impact"
                    className="cursor-pointer hover:text-oga-yellow-dark"
                  >
                    Impact
                  </Link>
                </div>
                <div className="flex gap-4 items-center">
                  <ConnectButton />
                  <div className="block lg:hidden">
                    <MobileNav />
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-auto px-4 pt-0 bg-color1">
                {children}
              </main>
            </div>
          </div>
          {/* <ToastProvider /> */}
        </Providers>
      </body>
    </html>
  );
}
