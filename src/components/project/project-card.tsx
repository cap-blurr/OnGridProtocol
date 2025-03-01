"use client";

import { ArrowRight, BarChart3, Clock, Coins, Github, Globe, Rocket, Target, Twitter, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { IconBrandDiscord } from "@tabler/icons-react";
import Image from "next/image";

interface ProjectCardProps {
    project: {
      id: number;
      name: string;
      description: string;
      image: string;
      status: "Live" | "Upcoming" | "Completed" | string;
      participants: number;
      timeLeft: string;
      raised: number;
      target: number;
      progress: number;
      tokenPrice: number;
      totalSupply: string;
      minAllocation: number;
      maxAllocation: number;
      access?: "Public" | "Private" | string;
      chain: "Solana" | "Base" | string;
      socials: {
        website: string;
        twitter: string;
        github: string;
        discord: string;
      };
      tags: string[];
    };
  }
  


export function ProjectCard({ project }: ProjectCardProps) {

  return (
    <Card
    key={project.id}
    className="dark overflow-hidden hover:shadow-xl transition-all duration-300 border-2 group cursor-pointer"
  >
    <div className="aspect-[2/1] relative overflow-hidden">
      <Image
        src={project.image || "/placeholder.svg"}
        alt={project.name}
        width={500}
        height={500}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <Badge
          variant="outline"
          className={
            project.status === "Live"
              ? "bg-[#28a745] text-white border-[#28a745]"
              : "bg-[#FFDC00] text-black border-[#FFDC00]"
          }
        >
          {project.status}
        </Badge>
        <Badge
          variant="outline"
          className="bg-background/80 backdrop-blur-sm"
        >
          {project.chain}
        </Badge>
      </div>
    </div>

    <CardHeader>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-muted">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {Object.entries(project.socials).map(([platform, url]) => (
            <Link
              key={platform}
              href={url}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {platform === "website" && <Globe className="h-5 w-5" />}
              {platform === "twitter" && <Twitter className="h-5 w-5" />}
              {platform === "github" && <Github className="h-5 w-5" />}
              {platform === "discord" && <IconBrandDiscord className="h-5 w-5" />}
            </Link>
          ))}
        </div>
      </div>
      <p className="text-muted-foreground">{project.description}</p>
    </CardHeader>

    <CardContent className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span className="text-[#28a745]">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{project.raised.toLocaleString()} USDT</span>
          <span>{project.target.toLocaleString()} USDT</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Min Allocation</span>
          </div>
          <p className="font-medium">{project.minAllocation} USDT</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Rocket className="h-4 w-4" />
            <span>Max Allocation</span>
          </div>
          <p className="font-medium">{project.maxAllocation} USDT</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span>Token Price</span>
          </div>
          <p className="font-medium">{project.tokenPrice} USDT</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>Total Supply</span>
          </div>
          <p className="font-medium">{project.totalSupply}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>
            {project.participants.toLocaleString()} participants
          </span>
        </div>
        {/* <div className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            <span>{project.access}</span>
          </div> */}
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{project.timeLeft} left</span>
        </div>
      </div>
    </CardContent>

    <CardFooter>
      <Link href={`/projects/${project.id}`} className="w-full">
        <Button className="w-full bg-gradient-to-r from-[#28a745] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#28a745] text-white">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardFooter>
  </Card>
  );
}
