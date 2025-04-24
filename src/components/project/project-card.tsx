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
      className="dark overflow-hidden group cursor-pointer bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm border-2 border-zinc-800/60 hover:border-oga-green/50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-oga-green/5"
    >
      <div className="aspect-[1.7/1] relative overflow-hidden rounded-t-xl">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.name}
          width={500}
          height={300}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge
            variant="outline"
            className={
              project.status === "Live"
                ? "bg-oga-green text-white border-oga-green/50 shadow-sm shadow-oga-green/20"
                : "bg-amber-500 text-white border-amber-400/50 shadow-sm shadow-amber-500/20"
            }
          >
            {project.status}
          </Badge>
          <Badge
            variant="outline"
            className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/50 text-zinc-300"
          >
            {project.chain}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-zinc-900/80 backdrop-blur-sm text-xs border border-zinc-800/60 text-zinc-300">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <CardHeader className="pt-6 space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-zinc-200 group-hover:text-white transition-colors">{project.name}</h2>
          <div className="flex gap-2">
            {Object.entries(project.socials).map(([platform, url]) => (
              <Link
                key={platform}
                href={url}
                className="text-zinc-400 hover:text-white p-1.5 rounded-full bg-zinc-800/50 hover:bg-oga-green/20 transition-all"
              >
                {platform === "website" && <Globe className="h-4 w-4" />}
                {platform === "twitter" && <Twitter className="h-4 w-4" />}
                {platform === "github" && <Github className="h-4 w-4" />}
                {platform === "discord" && <IconBrandDiscord className="h-4 w-4" />}
              </Link>
            ))}
          </div>
        </div>
        <p className="text-zinc-400 text-sm line-clamp-2">{project.description}</p>
      </CardHeader>

      <CardContent className="space-y-6 pb-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Funding Progress</span>
            <span className="text-oga-green font-medium">{project.progress}%</span>
          </div>
          <div className="relative h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
            <Progress value={project.progress} className="h-full bg-gradient-to-r from-oga-green to-emerald-500 absolute inset-0" />
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>{(project.raised/1000).toLocaleString()}K USDT</span>
            <span>{(project.target/1000).toLocaleString()}K USDT</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Target className="h-3.5 w-3.5" />
              <span>Min Allocation</span>
            </div>
            <p className="font-medium text-zinc-300">{project.minAllocation} USDT</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Rocket className="h-3.5 w-3.5" />
              <span>Max Allocation</span>
            </div>
            <p className="font-medium text-zinc-300">{project.maxAllocation} USDT</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Coins className="h-3.5 w-3.5" />
              <span>Token Price</span>
            </div>
            <p className="font-medium text-zinc-300">{project.tokenPrice} USDT</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Total Supply</span>
            </div>
            <p className="font-medium text-zinc-300">{project.totalSupply}</p>
          </div>
        </div>

        <div className="flex justify-between text-xs text-zinc-500 border-t border-zinc-800/50 pt-4">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>
              {project.participants.toLocaleString()} participants
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{project.timeLeft} left</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-6">
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-oga-green to-emerald-600 hover:from-emerald-600 hover:to-oga-green text-white border-0 rounded-xl h-12 shadow-md shadow-green-900/20 group">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
