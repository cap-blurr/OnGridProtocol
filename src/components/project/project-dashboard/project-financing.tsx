"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  CircleDollarSign,
  Coins,
  Lock,
  Globe,
  Twitter,
  Github,
  DiscIcon as Discord,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProjectData } from "@/types/project";


interface ProjectContentProps {
  project: ProjectData;
}

const ProjectFinancing: React.FC<ProjectContentProps> = ({ project }) => {
  return (
    <div className="mx-auto bg-transparent md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card/50 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CircleDollarSign className="h-4 w-4" />
                Market Cap
              </div>
              <TrendingUp className="h-4 w-4 text-[#28a745]" />
            </div>
            <div className="text-2xl font-bold">
              ${project.marketCap.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-[#28a745]">
              <ArrowUpRight className="h-4 w-4" />
              <span>+2.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="h-4 w-4" />
                Total Supply
              </div>
            </div>
            <div className="text-2xl font-bold">
              {project.totalSupply}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Circulating: {project.circulatingSupply}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Participants
              </div>
            </div>
            <div className="text-2xl font-bold">
              {project.participants.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Active Contributors
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Raised Amount
              </div>
            </div>
            <div className="text-2xl font-bold">
              ${project.raised.toLocaleString()}
            </div>
            <Progress value={project.progress} className="h-1 mt-2" />
            <div className="text-sm text-muted-foreground mt-1">
              {project.progress}% of ${project.target.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-5">
            <TabsList className="bg-transparent h-10 rounded-full">
              <TabsTrigger
                value="overview"
                className="flex-1 rounded-full h-full  data-[state=active]:bg-oga-green"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="tokenomics"
                className="flex-1 rounded-full h-full   data-[state=active]:bg-oga-green"
              >
                Tokenomics
              </TabsTrigger>
              <TabsTrigger
                value="roadmap"
                className="flex-1 rounded-full h-full  data-[state=active]:bg-oga-green"
              >
                Roadmap
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="flex-1 rounded-full h-full data-[state=active]:bg-oga-green"
              >
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Praesentium commodi nam enim blanditiis
                    doloremque placeat rem error
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">
                        Token Price
                      </span>
                      <span className="font-medium">
                        {project.tokenPrice} USDT
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">
                        Total Supply
                      </span>
                      <span className="font-medium">
                        {project.totalSupply}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">
                        Access
                      </span>
                      <span className="font-medium">
                        {project.access}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">
                        Chain
                      </span>
                      <span className="font-medium">
                        {project.chain}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pool Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">
                        Min Allocation
                      </span>
                      <span className="font-medium">
                        {project.minAllocation} USDT
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">
                        Max Allocation
                      </span>
                      <span className="font-medium">
                        {project.maxAllocation} USDT
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">
                        Participants
                      </span>
                      <span className="font-medium">
                        {project.participants.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tokenomics">
              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6 space-y-6">
                  {project.tokenomics.distribution.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {item.category}
                        </span>
                        <span className="font-medium">
                          {item.percentage}%
                        </span>
                      </div>
                      <Progress
                        value={item.percentage}
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.team.map((member) => (
                  <Card
                    key={member.name}
                    className="bg-card/50 backdrop-blur-sm border-white/20"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={500}
                          height={500}
                          className="h-16 w-16 rounded-full ring-2 ring-[#28a745]/20"
                        />
                        <div>
                          <h3 className="font-semibold">
                            {member.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="roadmap">
              <Card className="bg-card/50 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {project.roadmap.map((phase) => (
                      <div
                        key={phase.phase}
                        className="relative pl-8 pb-8 last:pb-0"
                      >
                        <div className="absolute left-0 top-0 h-full w-px bg-muted">
                          <div
                            className={`absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full
                          ${
                            phase.status === "completed"
                              ? "bg-[#28a745]"
                              : phase.status === "in-progress"
                              ? "bg-[#FFDC00]"
                              : "bg-muted"
                          }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            {phase.phase}: {phase.title}
                          </h3>
                          <ul className="space-y-2">
                            {phase.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-center text-sm text-muted-foreground"
                              >
                                <ChevronRight className="h-4 w-4 mr-2 text-[#28a745]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Investment details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <span className="text-muted-foreground">
                        Price
                      </span>
                      <span className="font-medium">
                        ${project.tokenPrice} USDT
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <span className="text-muted-foreground">
                        Min Allocation
                      </span>
                      <span className="font-medium">
                        {project.minAllocation} USDT
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/20">
                      <span className="text-muted-foreground">
                        Max Allocation
                      </span>
                      <span className="font-medium">
                        {project.maxAllocation} USDT
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">
                        Access
                      </span>
                      <div className="flex items-center gap-1">
                        <Lock className="h-4 w-4" />
                        <span className="font-medium">
                          {project.access}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-[#28a745] font-medium">
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {project.raised.toLocaleString()} USDT
                    </span>
                    <span className="text-muted-foreground">
                      {project.target.toLocaleString()} USDT
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-oga-green text-white hover:bg-oga-yellow hover:text-gray-700">
                    Invest
                  </Button>
                  <div className="flex items-center justify-center gap-4">
                    {Object.entries(project.socials).map(
                      ([platform, url]) => (
                        <Link
                          key={platform}
                          href={url}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {platform === "website" && (
                            <Globe className="h-5 w-5" />
                          )}
                          {platform === "twitter" && (
                            <Twitter className="h-5 w-5" />
                          )}
                          {platform === "github" && (
                            <Github className="h-5 w-5" />
                          )}
                          {platform === "discord" && (
                            <Discord className="h-5 w-5" />
                          )}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectFinancing;