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
    if (!isMounted) return; // Wait for client-side hydration
    
    const redirect = async () => {
      if (!ready || isLoading) return; // Wait for auth and user type to be ready
      
      if (authenticated && userType) {
        try {
          if (userType === 'developer') {
            await router.replace('/developer-dashboard');
          } else if (userType === 'normal') {
            await router.replace('/dashboard');
          }
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    };

    redirect();
  }, [authenticated, userType, router, isMounted, isLoading, ready]);

  return (
    <main>
      <LandingPage />
    </main>
  );
}
