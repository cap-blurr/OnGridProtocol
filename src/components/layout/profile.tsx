"use client";

import Image from "next/image";

import {
  useWalletInfo,
  useAppKitAccount,
  useAppKit,
} from "@reown/appkit/react";

import { ArrowRight, ChevronDown, Sidebar, Wallet } from "lucide-react";
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

  return (
    <div className="font-mono">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900 rounded-lg border-none hover:bg-zinc-950"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-oga-green-light font-bold">
                {String(address).substring(0, 8)}...
                {String(address).substring(
                  String(address).length - 9,
                  String(address).length - 1
                )}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-oga-green-light" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-[280px] p-0 bg-zinc-950 border border-oga-green-dark rounded-xl font-mono"
        >
          <div className="flex flex-col items-center py-6 px-4 ">
            <Image
              src={walletInfo?.icon || ""}
              alt="Fox Logo"
              width={48}
              height={48}
              className="mb-4"
            />
            {/* <p className="text-black font-bold mb-2">0xDdb3...453C</p> */}
            <span className="text-oga-green-light text-sm md:text-base font-bold mb-2">
              {String(address).substring(0, 8)}...
              {String(address).substring(
                String(address).length - 9,
                String(address).length - 1
              )}
            </span>
          </div>
          

          <div className="py-2">
          <div
            className="flex justify-between items-center px-6 py-3 text-white hover:text-oga-yellow font-bold cursor-pointer"
            onClick={handleWalletActions}
          >
            <span className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet
            </span>
            <ArrowRight className="w-5 h-5" />
          </div>

          <Link
              href="/dashboard"
              className="flex justify-between items-center px-6 py-3 text-white hover:text-oga-yellow font-bold cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sidebar className="w-5 h-5" />
                Dashboard
              </span>
              <ArrowRight className="w-5 h-5" />
            </Link>

          <KYCModal/>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
