"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import { InvestmentModal } from "@/components/investment-modal"

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    chain: "solana" | "base";
    totalAmount: number;
    availableAmount: number;
    returns: number;
    status: string;
    image: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showInvestModal, setShowInvestModal] = useState(false);
  const progress =
    ((project.totalAmount - project.availableAmount) / project.totalAmount) *
    100;

  return (
    <Card className="w-full cursor-pointer rounded-2xl overflow-hidden min-h-[454px] dark bg-neutral-900 relative flex flex-col group hover:border hover:border-oga-green-light hover:shadow-md hover:shadow-oga-green-light">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: `url('${project.image || "/placeholder.svg"}')`,
        }}
      />

      <div className="w-full absolute bottom-0 z-10 flex flex-col flex-grow">
        <CardFooter className="flex flex-col flex-grow bg-gradient-to-b from-black/40 via-black/80 to-black rounded-t-3xl backdrop-blur-sm p-4 w-full transition-opacity duration-300 ">
          <div className="space-y-6 flex-grow">
            <div className="space-y-2">
              <h2 className="text-xl text-white font-bold">{project.title}</h2>
              <p className="text-sm text-gray-300">{project.description}</p>
            </div>
            <div className="space-y-2 w-full hidden group-hover:block">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Available</span>
                <span>${project.availableAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full mt-4 mb-2 bg-oga-green border border-oga-green-dark text-white rounded-xl hover:bg-oga-yellow-dark hover:text-gray-900"
            onClick={() => setShowInvestModal(true)}
          >
            Invest Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </div>

      {/* <InvestmentModal project={project} isOpen={showInvestModal} onClose={() => setShowInvestModal(false)} /> */}
    </Card>
  );
}
