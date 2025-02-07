"use client"

import { ProjectCard } from "./project-card"

// Simulated project data
const projects = [
    {
        id: "1",
        title: "Amazon Rainforest Conservation",
        description: "Protect and preserve the Amazon rainforest through sustainable management and conservation efforts.",
        chain: "solana" as const,
        totalAmount: 1000000,
        availableAmount: 750000,
        returns: 12,
        status: "active",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop",
      },
      {
        id: "2",
        title: "Wind Farm Development",
        description: "Large-scale wind farm project generating clean energy and carbon credits in Texas.",
        chain: "base" as const,
        totalAmount: 500000,
        availableAmount: 200000,
        returns: 8,
        status: "active",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1000&auto=format&fit=crop",
      },
    
  {
    id: "3",
    title: "Wind Farm Development",
    description: "Large-scale wind farm project generating clean energy and carbon credits in Texas.",
    chain: "base" as const,
    totalAmount: 500000,
    availableAmount: 200000,
    returns: 8,
    status: "active",
    image: "https://images.unsplash.com/photo-1515344905723-babc01aac23d?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

]

export function ProjectGrid() {
  return (
    <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

