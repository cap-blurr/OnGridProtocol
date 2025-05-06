"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Download,
  ChevronLeft,
  Leaf,
  Filter,
  BarChart3,
  TreePine,
  BatteryCharging
} from "lucide-react";
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock carbon credit history data
const mockCreditHistory = [
  {
    month: "May 2024",
    credits: 340,
    value: 34000,
    devices: 4,
    energyProduced: 3200,
    co2Reduced: 280,
    transactions: [
      { date: "2024-05-25", type: "Generation", device: "Solar Panel Array A", amount: 120, status: "Verified" },
      { date: "2024-05-20", type: "Generation", device: "Wind Turbine Cluster B", amount: 135, status: "Verified" },
      { date: "2024-05-15", type: "Generation", device: "Solar Farm D", amount: 85, status: "Verified" },
    ]
  },
  {
    month: "April 2024",
    credits: 250,
    value: 25000,
    devices: 4,
    energyProduced: 2800,
    co2Reduced: 220,
    transactions: [
      { date: "2024-04-25", type: "Generation", device: "Solar Panel Array A", amount: 100, status: "Verified" },
      { date: "2024-04-20", type: "Generation", device: "Wind Turbine Cluster B", amount: 100, status: "Verified" },
      { date: "2024-04-15", type: "Generation", device: "Solar Farm D", amount: 50, status: "Verified" },
    ]
  },
  {
    month: "March 2024",
    credits: 210,
    value: 21000,
    devices: 3,
    energyProduced: 2300,
    co2Reduced: 190,
    transactions: [
      { date: "2024-03-25", type: "Generation", device: "Solar Panel Array A", amount: 90, status: "Verified" },
      { date: "2024-03-20", type: "Generation", device: "Wind Turbine Cluster B", amount: 80, status: "Verified" },
      { date: "2024-03-15", type: "Generation", device: "Solar Farm D", amount: 40, status: "Verified" },
    ]
  },
  {
    month: "February 2024",
    credits: 180,
    value: 18000,
    devices: 3,
    energyProduced: 2100,
    co2Reduced: 160,
    transactions: [
      { date: "2024-02-25", type: "Generation", device: "Solar Panel Array A", amount: 70, status: "Verified" },
      { date: "2024-02-20", type: "Generation", device: "Wind Turbine Cluster B", amount: 75, status: "Verified" },
      { date: "2024-02-15", type: "Generation", device: "Solar Farm D", amount: 35, status: "Verified" },
    ]
  },
  {
    month: "January 2024",
    credits: 150,
    value: 15000,
    devices: 3,
    energyProduced: 1800,
    co2Reduced: 130,
    transactions: [
      { date: "2024-01-25", type: "Generation", device: "Solar Panel Array A", amount: 60, status: "Verified" },
      { date: "2024-01-20", type: "Generation", device: "Wind Turbine Cluster B", amount: 60, status: "Verified" },
      { date: "2024-01-15", type: "Generation", device: "Solar Farm D", amount: 30, status: "Verified" },
    ]
  },
  {
    month: "December 2023",
    credits: 120,
    value: 12000,
    devices: 2,
    energyProduced: 1500,
    co2Reduced: 100,
    transactions: [
      { date: "2023-12-25", type: "Generation", device: "Solar Panel Array A", amount: 50, status: "Verified" },
      { date: "2023-12-20", type: "Generation", device: "Wind Turbine Cluster B", amount: 70, status: "Verified" },
    ]
  }
];

export default function CarbonCreditsHistoryPage() {
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterQuarter, setFilterQuarter] = useState<string>("all");
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  // Calculate total statistics
  const totalCredits = mockCreditHistory.reduce((total, month) => total + month.credits, 0);
  const totalValue = mockCreditHistory.reduce((total, month) => total + month.value, 0);
  const totalEnergy = mockCreditHistory.reduce((total, month) => total + month.energyProduced, 0);
  const totalCO2 = mockCreditHistory.reduce((total, month) => total + month.co2Reduced, 0);

  // Filter the data based on selected filters
  let filteredHistory = [...mockCreditHistory];
  
  if (filterYear !== "all") {
    filteredHistory = filteredHistory.filter(month => {
      const year = month.month.split(" ")[1];
      return year === filterYear;
    });
  }

  if (filterQuarter !== "all") {
    filteredHistory = filteredHistory.filter(month => {
      const monthName = month.month.split(" ")[0];
      switch (filterQuarter) {
        case "Q1":
          return ["January", "February", "March"].includes(monthName);
        case "Q2":
          return ["April", "May", "June"].includes(monthName);
        case "Q3":
          return ["July", "August", "September"].includes(monthName);
        case "Q4":
          return ["October", "November", "December"].includes(monthName);
        default:
          return true;
      }
    });
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link 
            href="/dashboard/carbon-credits" 
            className="text-zinc-400 hover:text-white flex items-center mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Carbon Credits
          </Link>
          <h1 className="text-3xl font-bold text-white">Carbon Credits History</h1>
          <p className="text-zinc-400 mt-2">
            View your historical carbon credit generation and transactions
          </p>
        </div>
        
        <Button variant="outline" className="border-emerald-700 bg-emerald-900/10 hover:bg-emerald-800/30 hover:text-white hover:border-emerald-600 transition-colors">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Credits
            </CardTitle>
            <Leaf className="h-4 w-4 text-[#FFDC00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCredits.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-500">
              Worth ${totalValue.toLocaleString()} <span className="text-xs">USD</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              CO₂ Reduced
            </CardTitle>
            <TreePine className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCO2.toLocaleString()} <span className="text-base ml-1">tonnes</span>
            </div>
            <p className="text-xs text-zinc-500">
              Total environmental impact
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energy Produced
            </CardTitle>
            <BatteryCharging className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEnergy.toLocaleString()} <span className="text-base ml-1">kWh</span>
            </div>
            <p className="text-xs text-zinc-500">
              Total clean energy generated
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Average
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalCredits / mockCreditHistory.length).toLocaleString()}
            </div>
            <p className="text-xs text-zinc-500">
              Average credits per month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:flex-1">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="bg-zinc-900 border-zinc-700">
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:flex-1">
          <Select value={filterQuarter} onValueChange={setFilterQuarter}>
            <SelectTrigger className="bg-zinc-900 border-zinc-700">
              <SelectValue placeholder="Filter by quarter" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all">All Quarters</SelectItem>
              <SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem>
              <SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem>
              <SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem>
              <SelectItem value="Q4">Q4 (Oct-Dec)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-black/40 backdrop-blur-sm border-emerald-900/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-900/30 border-b border-zinc-800/50">
                  <TableHead>Month</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Energy Produced</TableHead>
                  <TableHead>CO₂ Reduced</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((month) => (
                  <>
                    <TableRow key={month.month} className="hover:bg-emerald-900/10 border-b border-zinc-800/30">
                      <TableCell>
                        <div className="font-medium text-white flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                          {month.month}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {month.credits.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-emerald-500">
                        ${month.value.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {month.energyProduced.toLocaleString()} <span className="text-xs text-zinc-400">kWh</span>
                      </TableCell>
                      <TableCell>
                        {month.co2Reduced.toLocaleString()} <span className="text-xs text-zinc-400">tonnes</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-800/30 hover:text-white"
                          onClick={() => setExpandedMonth(expandedMonth === month.month ? null : month.month)}
                        >
                          {expandedMonth === month.month ? "Hide Details" : "Show Details"}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedMonth === month.month && (
                      <TableRow className="bg-zinc-900/30 border-b border-zinc-800/30">
                        <TableCell colSpan={6} className="p-0">
                          <div className="p-4">
                            <h3 className="text-white font-medium mb-3">Transactions for {month.month}</h3>
                            <Table>
                              <TableHeader>
                                <TableRow className="border-zinc-700">
                                  <TableHead>Date</TableHead>
                                  <TableHead>Device</TableHead>
                                  <TableHead>Credits</TableHead>
                                  <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {month.transactions.map((tx, idx) => (
                                  <TableRow key={idx} className="border-zinc-800/20">
                                    <TableCell className="text-zinc-300">{tx.date}</TableCell>
                                    <TableCell className="text-zinc-300">{tx.device}</TableCell>
                                    <TableCell className="text-emerald-500 font-medium">{tx.amount}</TableCell>
                                    <TableCell className="text-right">
                                      <Badge variant="outline" className="border-emerald-600 text-emerald-500 bg-emerald-900/20">
                                        {tx.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            
                            <div className="mt-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-800/30 hover:text-white"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Export Month Data
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                
                {filteredHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <Filter className="h-8 w-8 mb-2" />
                        <p>No results found with the selected filters.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4 border-emerald-800/60 hover:border-emerald-700 hover:bg-emerald-800/30 hover:text-white"
                          onClick={() => {
                            setFilterYear("all");
                            setFilterQuarter("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 