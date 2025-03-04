"use client";

import { useState, useEffect } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Profile } from "./profile";

export default function ConnectButton() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient && authenticated ?(
    <Profile/>
  ) : (
    <Button
      onClick={login}
      className="bg-oga-green h-10 p-3 sm:p-4 lg:px-6 lg:py-4 border border-oga-green-dark text-white text-sm lg:text-base rounded-full hover:bg-oga-yellow-dark hover:text-gray-900"
      translate="no"
    >
      Connect Wallet
    </Button>
  );
}
