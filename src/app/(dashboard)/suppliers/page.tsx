"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import SupplierCard from "@/components/dashboard/suppliers/suppliers-card";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GradientSection from "@/components/ui/gradient-section";

export default function SupplierGrid() {
  const [filter, setFilter] = useState("all");

  return (
    <>
      <GradientSection>
        <div className="relative text-white">
          <div className="mx-auto max-w-7xl py-8">
            <div className="flex flex-col gap-2 mb-16 text-center">
              <h1 className="text-3xl font-bold mb-2">Solar Suppliers</h1>
              <p className="mx-auto max-w-[800px] text-zinc-300 mt-4 text-center md:text-base">
                Find trusted experts to handle your solar installation? We
                connect you with certified solar installation companies that
                deliver high-quality, efficient, and sustainable energy
                solutions.
              </p>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Search suppliers..."
                  className="pl-9 py-4 h-12 rounded-full dark bg-zinc-900"
                />
              </div>
              <div className="flex gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white rounded-full">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="all">All Suppliers</SelectItem>
                    <SelectItem value="certified">Certified Only</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white rounded-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="funding">Most Funded</SelectItem>
                    <SelectItem value="installations">
                      Most Installations
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <SupplierCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </GradientSection>
    </>
  );
}
