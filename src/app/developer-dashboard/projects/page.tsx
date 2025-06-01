'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useUserType } from '@/providers/userType';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter,
  MapPin, 
  Zap, 
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Sun,
  Battery,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

// Define the status type
type ProjectStatus = 'active' | 'fundraising' | 'planning' | 'completed' | 'paused';

// Mock data for projects - replace with actual data fetching
const mockProjects = [
  {
    id: '1',
    name: 'Solar Farm Alpha',
    location: 'Lagos, Nigeria',
    capacity: '50 MW',
    status: 'active' as ProjectStatus,
    fundingGoal: 5000000,
    fundingRaised: 3750000,
    roi: 12.5,
    timeline: '24 months',
    investors: 45,
    createdAt: '2024-01-15',
    type: 'high-value',
    description: 'Large-scale solar farm providing clean energy to 50,000 homes',
    carbonCredits: 15000,
    technology: 'Monocrystalline Silicon'
  },
  {
    id: '2',
    name: 'Community Solar Beta',
    location: 'Abuja, Nigeria',
    capacity: '25 MW',
    status: 'fundraising' as ProjectStatus,
    fundingGoal: 2500000,
    fundingRaised: 1200000,
    roi: 10.8,
    timeline: '18 months',
    investors: 28,
    createdAt: '2024-02-10',
    type: 'low-value',
    description: 'Community-focused solar installation for local grid stability',
    carbonCredits: 8500,
    technology: 'Polycrystalline Silicon'
  },
  {
    id: '3',
    name: 'Industrial Solar Gamma',
    location: 'Port Harcourt, Nigeria',
    capacity: '75 MW',
    status: 'planning' as ProjectStatus,
    fundingGoal: 7500000,
    fundingRaised: 0,
    roi: 15.2,
    timeline: '36 months',
    investors: 0,
    createdAt: '2024-03-05',
    type: 'high-value',
    description: 'Industrial-scale solar facility for manufacturing sector',
    carbonCredits: 22000,
    technology: 'Bifacial Panels'
  }
];

const statusColors: Record<ProjectStatus, string> = {
  active: 'bg-green-500',
  fundraising: 'bg-blue-500',
  planning: 'bg-yellow-500',
  completed: 'bg-gray-500',
  paused: 'bg-red-500'
};

const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  fundraising: 'Fundraising',
  planning: 'Planning',
  completed: 'Completed',
  paused: 'Paused'
};

export default function DeveloperProjectsPage() {
  const { authenticated, ready } = usePrivy();
  const { userType } = useUserType();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && (!authenticated || userType !== 'developer')) {
      router.push('/');
    }
  }, [authenticated, ready, userType, router]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalFunding = projects.reduce((sum, project) => sum + project.fundingRaised, 0);
  const totalGoal = projects.reduce((sum, project) => sum + project.fundingGoal, 0);
  const totalInvestors = projects.reduce((sum, project) => sum + project.investors, 0);
  const averageROI = projects.reduce((sum, project) => sum + project.roi, 0) / projects.length;

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!authenticated || userType !== 'developer') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Solar Projects</h1>
          <p className="text-gray-400">Manage and monitor your solar energy projects</p>
        </div>
        <div className="flex gap-2">
          <Link href="/developer-dashboard/projects/create-low">
            <Button variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-900/20">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </Link>
          <Link href="/developer-dashboard/projects/create-high">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              High-Value Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <Sun className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Funds Raised</p>
                <p className="text-2xl font-bold text-white">${(totalFunding / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Investors</p>
                <p className="text-2xl font-bold text-white">{totalInvestors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. ROI</p>
                <p className="text-2xl font-bold text-white">{averageROI.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-700 text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="fundraising">Fundraising</option>
          <option value="planning">Planning</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="bg-gray-900/50 border-gray-700 hover:border-emerald-600/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`${statusColors[project.status]} text-white text-xs`}>
                    {statusLabels[project.status]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.type}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-gray-700">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-400"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-white">{project.name}</CardTitle>
              <CardDescription className="text-gray-400">{project.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                {project.location}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Capacity</p>
                  <p className="text-white font-semibold">{project.capacity}</p>
                </div>
                <div>
                  <p className="text-gray-400">ROI</p>
                  <p className="text-emerald-400 font-semibold">{project.roi}%</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Funding Progress</span>
                  <span className="text-white">
                    ${(project.fundingRaised / 1000000).toFixed(1)}M / ${(project.fundingGoal / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(project.fundingRaised / project.fundingGoal) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-400">Investors</p>
                  <p className="text-white font-semibold">{project.investors}</p>
                </div>
                <div>
                  <p className="text-gray-400">Carbon Credits</p>
                  <p className="text-green-400 font-semibold">{project.carbonCredits.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-900/20"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Project Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Sun className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Create your first solar project to get started.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link href="/developer-dashboard/projects/create-low">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 