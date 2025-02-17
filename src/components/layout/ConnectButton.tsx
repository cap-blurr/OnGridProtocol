"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ConnectButton() {
  const { open,  } = useAppKit();
  const { isConnected,  } = useAppKitAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = async () => {
    if (!isConnected) {
      //   open({ view: "Networks" });
      //   setTimeout(() => {
      //     open({ view: "Connect" });
      //   }, 3000);
      // } else {
      //   open({ view: "Connect" });
      // }
      open()
    }
  };


  return (
    <>
      {isClient && isConnected ? (
        <appkit-button />
      ) : (
        <Button
          onClick={() => {
            handleConnect();
          }}
          className="bg-oga-green p-3 sm:p-4 border border-oga-green-dark text-white  text-sm md:text-lg rounded-full hover:bg-oga-yellow-dark hover:text-gray-900 lg:text-lg lg:px-6 lg:py-3"
          translate="no"
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}
