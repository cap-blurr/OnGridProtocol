"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Profile } from "./profile";

export default function ConnectButton() {
  const { open } = useAppKit();
  const { isConnected,  } = useAppKitAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = async () => {
    if (!isConnected) {
      open()
    }
  };


  return (
    <>
      {isClient && isConnected ? (
        // <appkit-button />
        <Profile />
      ) : (
        <Button
          onClick={() => {
            handleConnect();
          }}
          className="bg-oga-green h-10 p-3 sm:p-4 lg:px-6 lg:py-4 border border-oga-green-dark text-white text-sm lg:text-base rounded-full hover:bg-oga-yellow-dark hover:text-gray-900"
          translate="no"
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}
