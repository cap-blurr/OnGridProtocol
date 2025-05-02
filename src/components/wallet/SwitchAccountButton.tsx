"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/providers/userType';
import { UserIcon, Code, ArrowRightLeft } from 'lucide-react';

export default function SwitchAccountButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { userType, switchUserType } = useUserType();
  const router = useRouter();

  // Don't render if no user type is selected
  if (!userType) return null;

  const handleSwitchAccount = async () => {
    setIsLoading(true);
    try {
      // Switch user type
      switchUserType();
      
      // Redirect to appropriate dashboard
      const destination = userType === 'normal' ? '/developer-dashboard' : '/dashboard';
      router.push(destination);
    } catch (error) {
      console.error('Error switching account type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSwitchAccount}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <>
          {userType === 'normal' ? (
            <Code className="h-4 w-4" />
          ) : (
            <UserIcon className="h-4 w-4" />
          )}
          <span className="mr-1">
            Switch to {userType === 'normal' ? 'Developer' : 'Normal'} Account
          </span>
          <ArrowRightLeft className="h-3.5 w-3.5" />
        </>
      )}
    </button>
  );
} 