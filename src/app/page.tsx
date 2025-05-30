'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from '@privy-io/react-auth';
import { useUserType } from '@/providers/userType';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { userType, isLoading } = useUserType();
  const [isMounted, setIsMounted] = useState(false);

  // Handle SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect logged-in users to the appropriate dashboard
  useEffect(() => {
    // Don't do anything during SSR, while loading user type, or while Privy is not ready
    if (!isMounted || isLoading || !ready) return;

    // If authenticated and user type is selected, redirect to appropriate dashboard
    if (authenticated && userType) {
      if (userType === 'developer') {
        router.push('/developer-dashboard');
      } else if (userType === 'normal') {
        router.push('/dashboard');
      }
    }
  }, [authenticated, userType, router, isMounted, isLoading, ready]);

  return (
    <main>
      <LandingPage />
    </main>
  );
}
