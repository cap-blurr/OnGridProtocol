"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Profile } from "./profile";
import { Wallet } from "lucide-react";

export default function ConnectButton() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = async () => {
    if (!isConnected) {
      open();
    }
  };

  return (
    <>
      {isClient && isConnected ? (
        <Profile />
      ) : (
        <Button
          onClick={() => {
            handleConnect();
          }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
          translate="no"
        >
          <Wallet className="h-4 w-4 mr-2" />
          <span>Connect Wallet</span>
        </Button>
      )}
    </>
  );
}
