'use client';

import { useAccount } from 'wagmi';
import { useDeveloperProjects } from '@/hooks/contracts/useDeveloperProjects';
import RepaymentManager from '@/components/developer/RepaymentManager';
import LoadingScreen from '@/components/ui/loading-screen';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function RepaymentPage() {
  const { address: userAddress, isConnected } = useAccount();
  
  // Get developer's projects
  const { 
    projects, 
    isLoading, 
    error 
  } = useDeveloperProjects();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Loan Repayment</h1>
        <p className="text-xl text-zinc-400">Please connect your wallet to manage loan repayments.</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
  return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="bg-red-900/30 border-red-700 text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading projects: {error}
          </AlertDescription>
        </Alert>
        </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Loan Repayment</h1>
        <p className="text-xl text-zinc-400">You don't have any active projects to make repayments for.</p>
        <p className="text-zinc-500 mt-2">Create a project first to see repayment options.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RepaymentManager 
        developerAddress={userAddress}
        projectIds={projects.map(project => Number(project.id))}
      />
    </div>
  );
} 