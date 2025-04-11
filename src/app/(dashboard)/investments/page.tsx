"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import InvestmentPoolCard from "@/components/dashboard/investment-pool/investment-pool-card";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GradientSection from "@/components/ui/gradient-section";

export default function InvestmentPoolsGrid() {
  return (
    <GradientSection>
      <div className=" text-white">
        <div className="mx-auto max-w-7xl py-8 ">
          <div className="flex flex-col gap-2 mb-16">
            <h1 className="text-center text-3xl font-bold leading-tight">
              Investment Pools
            </h1>
            <p className="mx-auto max-w-[800px] text-zinc-300 mt-4 text-center md:text-base">
              Discover investment opportunities with varying risk and return
              profiles
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="bg-zinc-800/50">
                <TabsTrigger
                  value="all"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  All Pools
                </TabsTrigger>
                <TabsTrigger
                  value="low"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Low Risk
                </TabsTrigger>
                <TabsTrigger
                  value="medium"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Medium Risk
                </TabsTrigger>
                <TabsTrigger
                  value="high"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  High Risk
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-3">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    placeholder="Search pools..."
                    className="pl-9 py-4 h-12 rounded-full dark bg-zinc-900"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                <Select defaultValue="apr">
                  <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white rounded-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="apr">Highest APR</SelectItem>
                    <SelectItem value="funding">Most Funded</SelectItem>
                    <SelectItem value="investors">Most Investors</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <InvestmentPoolCard
                  name="Low-Risk Pool"
                  type="low"
                  apr={5.2}
                  raised={920000}
                  target={1000000}
                  minInvestment={50}
                  maxInvestment={5000}
                  investors={1876}
                  daysLeft={3}
                />
                <InvestmentPoolCard
                  name="Medium-Risk Pool"
                  type="medium"
                  apr={12.5}
                  raised={850000}
                  target={1000000}
                  minInvestment={100}
                  maxInvestment={10000}
                  investors={1234}
                  daysLeft={2}
                />
                <InvestmentPoolCard
                  name="High-Risk Pool"
                  type="high"
                  apr={24.8}
                  raised={650000}
                  target={1000000}
                  minInvestment={200}
                  maxInvestment={20000}
                  investors={892}
                  daysLeft={5}
                />
                <InvestmentPoolCard
                  name="Balanced Growth"
                  type="medium"
                  apr={14.3}
                  raised={750000}
                  target={1000000}
                  minInvestment={100}
                  maxInvestment={15000}
                  investors={1045}
                  daysLeft={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="low" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <InvestmentPoolCard
                  name="Low-Risk Pool"
                  type="low"
                  apr={5.2}
                  raised={920000}
                  target={1000000}
                  minInvestment={50}
                  maxInvestment={5000}
                  investors={1876}
                  daysLeft={3}
                />
                <InvestmentPoolCard
                  name="Capital Preservation"
                  type="low"
                  apr={4.8}
                  raised={980000}
                  target={1000000}
                  minInvestment={50}
                  maxInvestment={5000}
                  investors={2104}
                  daysLeft={1}
                />
              </div>
            </TabsContent>

            <TabsContent value="medium" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <InvestmentPoolCard
                  name="Medium-Risk Pool"
                  type="medium"
                  apr={12.5}
                  raised={850000}
                  target={1000000}
                  minInvestment={100}
                  maxInvestment={10000}
                  investors={1234}
                  daysLeft={2}
                />
                <InvestmentPoolCard
                  name="Balanced Growth"
                  type="medium"
                  apr={14.3}
                  raised={750000}
                  target={1000000}
                  minInvestment={100}
                  maxInvestment={15000}
                  investors={1045}
                  daysLeft={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="high" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <InvestmentPoolCard
                  name="High-Risk Pool"
                  type="high"
                  apr={24.8}
                  raised={650000}
                  target={1000000}
                  minInvestment={200}
                  maxInvestment={20000}
                  investors={892}
                  daysLeft={5}
                />
                <InvestmentPoolCard
                  name="Aggressive Growth"
                  type="high"
                  apr={28.5}
                  raised={450000}
                  target={1000000}
                  minInvestment={250}
                  maxInvestment={25000}
                  investors={678}
                  daysLeft={7}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </GradientSection>
  );
}
