/*"use client";

import Image from "next/image";

import {
  useWalletInfo,
  useAppKitAccount,
  useAppKit,
} from "@reown/appkit/react";

import { ArrowRight, ChevronDown, Sidebar, Wallet, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { KYCModal } from "../kyc/kyc-modal";

export function Profile() {
  const { address } = useAppKitAccount();
  const { walletInfo } = useWalletInfo();
  const { open } = useAppKit();

  const handleWalletActions = async () => {
    open();
  };

  // Format address for display
  const displayAddress = address 
    ? `${String(address).substring(0, 6)}...${String(address).substring(String(address).length - 4)}`
    : '';

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 hover:border-emerald-700/50 rounded-md px-3 py-2 transition-all duration-200"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-900/30 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-zinc-200 font-medium text-sm hidden sm:inline">
              {displayAddress}
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[280px] p-0 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl"
        >
          <div className="flex flex-col items-center py-6 px-4 border-b border-zinc-800">
            {walletInfo?.icon ? (
              <Image
                src={walletInfo.icon}
                alt="Wallet Logo"
                width={48}
                height={48}
                className="mb-3"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
            )}
            <span className="text-zinc-200 font-medium mb-1">
              {displayAddress}
            </span>
            <span className="text-emerald-500 text-xs">Connected</span>
          </div>

          <div className="py-2">
            <button
              className="flex w-full justify-between items-center px-4 py-3 text-zinc-200 hover:bg-zinc-800 hover:text-emerald-400 transition-colors duration-200"
              onClick={handleWalletActions}
            >
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Wallet Settings
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/dashboard"
              className="flex w-full justify-between items-center px-4 py-3 text-zinc-200 hover:bg-zinc-800 hover:text-emerald-400 transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                <Sidebar className="w-4 h-4" />
                Dashboard
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <KYCModal />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
*/