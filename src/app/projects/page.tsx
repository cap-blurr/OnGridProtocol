"use client";
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

// This would ideally come from a backend API or subgraph indexing your contracts
// For demo purposes, we're hardcoding some sample projects
interface Project {
  id: string;
  vaultAddress: `0x${string}`;
  developer: `0x${string}`;
  loanAmount: string;
  description: string;
  image: string;
  type: 'solar' | 'wind' | 'hydro' | 'biomass';
}

// Sample projects - in a real app, this would come from your contracts/API
const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    vaultAddress: '0x0000000000000000000000000000000000000001' as `0x${string}`,
    developer: '0x0000000000000000000000000000000000000001' as `0x${string}`,
    loanAmount: '50000',
    description: 'Solar Farm California',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    type: 'solar'
  },
  {
    id: '2',
    vaultAddress: '0x0000000000000000000000000000000000000002' as `0x${string}`,
    developer: '0x0000000000000000000000000000000000000002' as `0x${string}`,
    loanAmount: '75000',
    description: 'Wind Farm Texas',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    type: 'wind'
  },
  {
    id: '3',
    vaultAddress: '0x0000000000000000000000000000000000000003' as `0x${string}`,
    developer: '0x0000000000000000000000000000000000000003' as `0x${string}`,
    loanAmount: '30000',
    description: 'Microhydro Kenya',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
    type: 'hydro'
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useAccount();
  
  // In a real app, this would fetch projects from your contracts/API
  useEffect(() => {
    // Simulate API fetch
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // Here you would call your API or use contract hooks
        // For now, we're just using the sample data
        setTimeout(() => {
          setProjects(SAMPLE_PROJECTS);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Clean Energy Projects</h1>
          <p className="text-zinc-400 max-w-xl">
            Invest in verified clean energy projects to earn returns while making a positive environmental impact
          </p>
        </div>
        
        {!isConnected && (
          <Button className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet to Invest
          </Button>
        )}
      </div>
      
      {isLoading ? (
        // Skeleton loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg bg-black/20 h-[400px] animate-pulse" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        // Project grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <ProjectCard 
              key={project.id}
              id={project.id}
              title={project.description}
              type={project.type}
              loanAmount={project.loanAmount}
              vaultAddress={project.vaultAddress}
              developer={project.developer}
              imageUrl={project.image}
            />
          ))}
        </div>
      ) : (
        // No projects found
        <div className="text-center py-16">
          <h3 className="text-xl text-zinc-300 mb-4">No projects available at the moment</h3>
          <p className="text-zinc-500">
            Check back soon for new investment opportunities
          </p>
        </div>
      )}
    </div>
  );
}
