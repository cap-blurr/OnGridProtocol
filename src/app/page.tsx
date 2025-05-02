'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useUserType } from '@/providers/userType';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { userType, isLoading } = useUserType();
  const [isMounted, setIsMounted] = useState(false);

  // Handle SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect logged-in users to the appropriate dashboard
  useEffect(() => {
    // Don't do anything during SSR or while loading user type
    if (!isMounted || isLoading) return;

    // If connected and user type is selected, redirect to appropriate dashboard
    if (isConnected && userType) {
      if (userType === 'developer') {
        router.push('/developer-dashboard');
      } else if (userType === 'normal') {
        router.push('/dashboard');
      }
    }
  }, [isConnected, userType, router, isMounted, isLoading]);

  return <LandingPage />;
}