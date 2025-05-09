"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserType } from '@/providers/userType';
import { UserIcon, Sun, ArrowRightLeft } from 'lucide-react';

export default function SwitchAccountButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { userType, setUserType } = useUserType();
  const router = useRouter();

  // Don't render if no user type is selected
  if (!userType) return null;

  const handleSwitchAccount = async () => {
    setIsLoading(true);
    try {
      // Switch user type
      const newType = userType === 'normal' ? 'developer' : 'normal';
      setUserType(newType);
      
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
      className="flex items-center gap-2 rounded-lg bg-black/40 border border-emerald-800/30 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <>
          {userType === 'normal' ? (
            <Sun className="h-4 w-4 text-emerald-400" />
          ) : (
            <UserIcon className="h-4 w-4 text-emerald-400" />
          )}
          <span className="mr-1">
            Switch to {userType === 'normal' ? 'Solar Developer' : 'Investor'} View
          </span>
          <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-400" />
        </>
      )}
    </button>
  );
}
