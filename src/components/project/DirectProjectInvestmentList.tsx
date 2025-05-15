'use client';

import { useState, useEffect } from 'react';
import DirectProjectInvestmentItem, { HighValueProjectData } from './DirectProjectInvestmentItem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info } from 'lucide-react';

// TODO: Replace with actual data fetching logic for high-value projects
// This would typically involve querying your backend or Supabase table where 
// ProjectFactory's ProjectCreated events are indexed and vault addresses are stored.
const fetchHighValueProjects = async (): Promise<HighValueProjectData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  
  // Return mock data for now
  return [
    {
      id: 'hp1',
      name: 'Project Helios - Solar Farm Alpha',
      description: 'A large-scale solar energy generation project aiming to power 10,000 homes. Located in Nevada, USA.',
      vaultAddress: '0xVaultAddressHelios123' // Replace with actual deployed vault address for testing
    },
    {
      id: 'hp2',
      name: 'GeoPower Plant Beta',
      description: 'Innovative geothermal power plant focusing on sustainable energy extraction and minimal environmental impact.',
      vaultAddress: '0xVaultAddressGeoBeta456' // Replace with actual deployed vault address for testing
    },
    // Add more mock projects if needed, each with a unique, valid vaultAddress for on-chain interaction
  ];
};

export default function DirectProjectInvestmentList() {
  const [projects, setProjects] = useState<HighValueProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProjects = await fetchHighValueProjects();
        setProjects(fetchedProjects);
      } catch (err: any) {
        console.error("Error fetching high-value projects:", err);
        setError(err.message || "Failed to load projects.");
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-emerald-800/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Invest Directly in High-Value Projects</CardTitle>
        <CardDescription className="text-zinc-400 pt-1">
          Browse and invest in individual high-impact renewable energy projects with dedicated funding vaults.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          </div>
        )}
        {error && (
            <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Projects</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center text-zinc-400 py-6">
            <Info size={32} className="mx-auto mb-2 text-zinc-500" />
            No direct investment projects available at the moment.
          </div>
        )}
        {!isLoading && !error && projects.map((project) => (
          <DirectProjectInvestmentItem key={project.id} project={project} />
        ))}
      </CardContent>
    </Card>
  );
} 