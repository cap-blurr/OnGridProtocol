'use client';

import { useState, useEffect } from 'react';
import DirectProjectInvestmentItem, { SolarProjectData } from './DirectProjectInvestmentItem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info, AlertCircle, Sun } from 'lucide-react';

// TODO: Replace with actual data fetching logic for solar projects
// This would typically involve querying your backend or Supabase table where 
// ProjectFactory's ProjectCreated events are indexed and vault addresses are stored.
const fetchSolarProjects = async (): Promise<SolarProjectData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  
  // For demo purposes, return empty array since we don't have actual deployed vault addresses
  // In production, this would fetch real vault addresses from ProjectCreated events
  return [];
  
  // When you have actual vault addresses from deployed contracts, replace them here:
  // return [
  //   {
  //     id: 'solar1',
  //     name: 'Project Helios - Solar Farm Alpha',
  //     description: 'A large-scale solar energy generation project aiming to power 10,000 homes across rural communities in northern Nigeria.',
  //     vaultAddress: '0x...' as `0x${string}`, // Replace with actual deployed vault address
  //     location: 'Nigeria',
  //     capacity: '50 MW'
  //   },
  //   // ... more projects with real addresses
  // ];
};

export default function DirectProjectInvestmentList() {
  const [projects, setProjects] = useState<SolarProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProjects = await fetchSolarProjects();
        setProjects(fetchedProjects);
      } catch (err: any) {
        console.error("Error fetching solar projects:", err);
        setError(err.message || "Failed to load solar projects.");
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center">
          <Sun className="h-6 w-6 mr-3 text-oga-yellow" />
          Invest Directly in Solar Energy Projects
        </CardTitle>
        <CardDescription className="text-zinc-400 pt-1">
          Browse and invest in individual high-impact solar energy projects with dedicated funding vaults across Africa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-oga-green" />
              <p className="text-zinc-400 text-sm">Loading solar energy projects...</p>
            </div>
          </div>
        )}
        {error && (
            <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Solar Projects</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center text-zinc-400 py-6">
            <Sun size={48} className="mx-auto mb-4 text-oga-yellow opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No Solar Projects Available</h3>
            <p className="text-sm">No direct solar energy investment projects are available at the moment.</p>
            <p className="text-xs mt-2 text-zinc-500">Check back soon for new solar opportunities!</p>
          </div>
        )}
        {!isLoading && !error && projects.map((project) => (
          <DirectProjectInvestmentItem key={project.id} project={project} />
        ))}
      </CardContent>
    </Card>
  );
} 