'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useUserType } from '@/providers/userType';
import LoadingScreen from '@/components/ui/loading-screen';
import EnhancedKYCForm from '@/components/developer/EnhancedKYCForm';

export default function KYCPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { userType, isLoading: isLoadingUserType } = useUserType();

  const handleKYCComplete = () => {
    router.push('/developer-dashboard');
  };

  // Loading state
  if (isLoadingUserType) {
    return <LoadingScreen />;
  }

  // Not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">KYC Verification</h1>
        <p className="text-xl text-gray-300">Please connect your wallet to access KYC verification.</p>
      </div>
    );
  }

  // Not a developer
  if (userType && userType !== 'developer') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Access Denied</h1>
        <p className="text-xl text-zinc-400">This page is for developers only.</p>
        <Button
          onClick={() => router.push('/')}
          className="mt-4 bg-oga-green hover:bg-oga-green/80"
        >
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-oga-green hover:bg-oga-green/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-oga-green" />
                KYC Verification
              </h1>
              <p className="text-zinc-400 mt-1">
                Complete your identity verification to start creating projects
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced KYC Form */}
        <div className="max-w-4xl mx-auto">
          <EnhancedKYCForm onComplete={handleKYCComplete} />
        </div>
      </div>
    </div>
  );
}
