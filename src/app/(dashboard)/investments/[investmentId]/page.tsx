"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Shield,
  Clock,
  ArrowLeft,
  Star,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";

interface Project {
  name: string;
  type: string;
  fundingAmount: number;
  status: "active" | "completed" | "pending";
  description: string;
  completion: number;
  location: string;
  startDate: string;
  image?: string;
}

interface InvestmentPoolDetailProps {
  name: string;
  type: "low" | "medium" | "high";
  apr: number;
  raised: number;
  target: number;
  minInvestment: number;
  maxInvestment: number;
  investors: number;
  daysLeft: number;
  lockupPeriod: number;
  projects?: Project[];
}

export default function InvestmentPoolDetail() {
  const params = useParams();
  const investmentId = params?.investmentId as string;
  
  const [poolData, setPoolData] = useState<InvestmentPoolDetailProps>({
    name: "Medium-Risk Pool",
    type: "medium",
    apr: 12.5,
    raised: 850000,
    target: 1000000,
    minInvestment: 100,
    maxInvestment: 10000,
    investors: 1234,
    daysLeft: 2,
    lockupPeriod: 90,
  });
  
  const progress = Math.round((poolData.raised / poolData.target) * 100);

  useEffect(() => {
    if (investmentId.includes("low")) {
      setPoolData(prev => ({ ...prev, type: "low", name: "Low-Risk Pool", apr: 5.5 }));
    } else if (investmentId.includes("high")) {
      setPoolData(prev => ({ ...prev, type: "high", name: "High-Risk Pool", apr: 18.5 }));
    }
  }, [investmentId]);

  const getPoolDetails = (type: string) => {
    switch (type) {
      case "low":
        return {
          tags: ["Stable", "Low-Risk", "Secure"],
          description:
            "A conservative investment pool focused on stable returns with minimal risk exposure. This pool prioritizes capital preservation while providing consistent yields through carefully vetted low-risk opportunities.",
          badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-400",
          buttonColor: "bg-oga-green hover:bg-oga-green-dark",
          progressColor: "bg-oga-green",
          riskLevel: "Low",
          riskColor: "text-blue-400",
          riskBadge: "bg-blue-500 text-white",
          allocationBreakdown: [
            { name: "Government Bonds", value: 40 },
            { name: "Blue-Chip Stocks", value: 30 },
            { name: "Corporate Bonds", value: 20 },
            { name: "Cash Reserves", value: 10 },
          ],
          performanceData: [
            { month: "Jan", return: 0.8 },
            { month: "Feb", return: 0.7 },
            { month: "Mar", return: 0.9 },
            { month: "Apr", return: 0.6 },
            { month: "May", return: 0.8 },
            { month: "Jun", return: 0.7 },
          ],
          defaultProjects: [
            {
              name: "Municipal Solar Grid",
              type: "Infrastructure",
              fundingAmount: 250000,
              status: "active",
              description:
                "Installation of solar panels on municipal buildings to reduce energy costs and carbon footprint for the city.",
              completion: 65,
              location: "Portland, OR",
              startDate: "2023-09-15",
              image:
                "/placeholder.svg?height=200&width=300&text=Municipal+Solar",
            },
            {
              name: "Commercial Office Installation",
              type: "Corporate",
              fundingAmount: 180000,
              status: "active",
              description:
                "Rooftop solar installation for a Fortune 500 company's headquarters with battery backup system.",
              completion: 80,
              location: "Chicago, IL",
              startDate: "2023-10-02",
              image: "/placeholder.svg?height=200&width=300&text=Office+Solar",
            },
            {
              name: "Government Building Retrofit",
              type: "Public Sector",
              fundingAmount: 320000,
              status: "completed",
              description:
                "Complete energy retrofit of federal buildings including solar panels and energy-efficient systems.",
              completion: 100,
              location: "Washington, DC",
              startDate: "2023-07-20",
              image:
                "/placeholder.svg?height=200&width=300&text=Government+Solar",
            },
            {
              name: "Hospital Solar Installation",
              type: "Healthcare",
              fundingAmount: 290000,
              status: "active",
              description:
                "Solar installation for regional hospital to provide reliable backup power and reduce operating costs.",
              completion: 45,
              location: "Boston, MA",
              startDate: "2023-11-10",
              image:
                "/placeholder.svg?height=200&width=300&text=Hospital+Solar",
            },
          ],
        };
      case "high":
        return {
          tags: ["High-Yield", "Aggressive", "Growth"],
          description:
            "A high-risk investment pool targeting maximum returns through innovative projects and emerging markets with significant growth potential. This pool is designed for investors seeking substantial returns who can tolerate higher volatility.",
          badgeColor: "border-red-500/30 bg-red-500/10 text-red-400",
          buttonColor: "bg-emerald-600 hover:bg-emerald-700",
          progressColor: "bg-gradient-to-r from-emerald-600 to-emerald-400",
          riskLevel: "High",
          riskColor: "text-red-400",
          riskBadge: "bg-red-500 text-white",
          allocationBreakdown: [
            { name: "Emerging Markets", value: 35 },
            { name: "Tech Startups", value: 30 },
            { name: "Crypto Assets", value: 25 },
            { name: "Venture Capital", value: 10 },
          ],
          performanceData: [
            { month: "Jan", return: 3.2 },
            { month: "Feb", return: -1.5 },
            { month: "Mar", return: 4.8 },
            { month: "Apr", return: -2.1 },
            { month: "May", return: 5.3 },
            { month: "Jun", return: 2.9 },
          ],
          defaultProjects: [
            {
              name: "Floating Solar Farm",
              type: "Innovation",
              fundingAmount: 420000,
              status: "active",
              description:
                "Experimental floating solar farm on a reservoir that maximizes space efficiency and reduces water evaporation.",
              completion: 55,
              location: "Lake Mead, NV",
              startDate: "2023-08-05",
              image:
                "/placeholder.svg?height=200&width=300&text=Floating+Solar",
            },
            {
              name: "Solar Storage Startup",
              type: "Venture",
              fundingAmount: 350000,
              status: "active",
              description:
                "Funding for a startup developing next-generation solar storage technology with higher efficiency.",
              completion: 40,
              location: "Austin, TX",
              startDate: "2023-09-22",
              image:
                "/placeholder.svg?height=200&width=300&text=Storage+Startup",
            },
            {
              name: "Experimental PV Technology",
              type: "R&D",
              fundingAmount: 280000,
              status: "pending",
              description:
                "Research and development of perovskite solar cell technology with potential for breakthrough efficiency.",
              completion: 20,
              location: "San Francisco, CA",
              startDate: "2023-12-01",
              image: "/placeholder.svg?height=200&width=300&text=PV+Research",
            },
            {
              name: "Agrivoltaics Project",
              type: "Agriculture",
              fundingAmount: 310000,
              status: "active",
              description:
                "Combined solar and agricultural project that allows farming beneath elevated solar panels.",
              completion: 60,
              location: "Fresno, CA",
              startDate: "2023-07-15",
              image: "/placeholder.svg?height=200&width=300&text=Agrivoltaics",
            },
          ],
        };
      default:
        return {
          tags: ["Balanced", "Growth", "Diversified"],
          description:
            "A balanced investment pool offering moderate risk exposure with attractive returns. This pool is diversified across multiple sectors to optimize performance while maintaining reasonable stability.",
          badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
          buttonColor: "bg-emerald-600 hover:bg-emerald-700",
          progressColor: "bg-gradient-to-r from-emerald-600 to-emerald-400",
          riskLevel: "Medium",
          riskColor: "text-amber-400",
          riskBadge: "bg-amber-500 text-white",
          allocationBreakdown: [
            { name: "Growth Stocks", value: 35 },
            { name: "Corporate Bonds", value: 25 },
            { name: "Real Estate", value: 20 },
            { name: "Alternative Assets", value: 20 },
          ],
          performanceData: [
            { month: "Jan", return: 1.5 },
            { month: "Feb", return: 1.2 },
            { month: "Mar", return: 1.8 },
            { month: "Apr", return: 0.9 },
            { month: "May", return: 2.1 },
            { month: "Jun", return: 1.6 },
          ],
          defaultProjects: [
            {
              name: "Residential Community Solar",
              type: "Residential",
              fundingAmount: 320000,
              status: "active",
              description:
                "Community solar project serving 150+ homes in a suburban neighborhood with shared benefits.",
              completion: 70,
              location: "Denver, CO",
              startDate: "2023-08-20",
              image:
                "/placeholder.svg?height=200&width=300&text=Community+Solar",
            },
            {
              name: "Small Business Installation",
              type: "Commercial",
              fundingAmount: 180000,
              status: "completed",
              description:
                "Solar installation for a strip mall with multiple small businesses to reduce operating costs.",
              completion: 100,
              location: "Atlanta, GA",
              startDate: "2023-06-15",
              image:
                "/placeholder.svg?height=200&width=300&text=Business+Solar",
            },
            {
              name: "School District Solar Project",
              type: "Education",
              fundingAmount: 250000,
              status: "active",
              description:
                "Installation of solar panels across multiple schools in a district with educational components.",
              completion: 60,
              location: "Phoenix, AZ",
              startDate: "2023-09-05",
              image: "/placeholder.svg?height=200&width=300&text=School+Solar",
            },
            {
              name: "Mixed-Use Development",
              type: "Real Estate",
              fundingAmount: 290000,
              status: "active",
              description:
                "Solar integration for a new mixed-use development with residential and commercial spaces.",
              completion: 50,
              location: "Nashville, TN",
              startDate: "2023-10-12",
              image:
                "/placeholder.svg?height=200&width=300&text=Mixed+Use+Solar",
            },
          ],
        };
    }
  };

  const poolDetails = getPoolDetails(poolData.type);
  const poolProjects = poolData.projects || poolDetails.defaultProjects;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="relative h-48 w-full sm:h-56 md:h-64 lg:h-80">
        <Image
          src={`https://images.unsplash.com/photo-1542336391-ae2936d8efe4?q=80&w=2923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
          alt={`${poolData.name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
          <Link href="/investments">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-zinc-700 bg-zinc-900/80 text-white backdrop-blur-sm hover:bg-zinc-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Pools
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Pool Header */}
        <div className="relative -mt-16 mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-4 border-zinc-900 ${
                poolData.type === "low"
                  ? "bg-blue-900/30"
                  : poolData.type === "high"
                  ? "bg-red-900/30"
                  : "bg-amber-900/30"
              } sm:h-24 sm:w-24 flex items-center justify-center`}
            >
              {poolData.type === "low" ? (
                <Shield className="h-12 w-12 text-blue-400" />
              ) : poolData.type === "high" ? (
                <TrendingUp className="h-12 w-12 text-red-400" />
              ) : (
                <PieChart className="h-12 w-12 text-amber-400" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl text-white">
                  {poolData.name}
                </h1>
                <Badge className="bg-emerald-500 text-white">Verified</Badge>
                <Badge
                  className={
                    poolDetails.riskBadge +
                    " px-3 py-0.5 text-xs font-medium uppercase"
                  }
                >
                  {poolData.type} Risk
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {poolDetails.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:gap-3 md:mt-0 md:w-auto">
            <Button className="bg-oga-green hover:bg-oga-green-dark">
              Invest Now
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column */}
          <div className="md:col-span-2">
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Investment Pool Overview
                </CardTitle>
                <CardDescription className="text-zinc-300">
                  {poolDetails.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 sm:p-4">
                    <div className="mb-1 text-sm text-zinc-300">
                      Current APR
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold sm:text-2xl text-white">
                        {poolData.apr}%
                      </span>
                      <span className="ml-1 text-zinc-400">annual</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 sm:p-4">
                    <div className="mb-1 text-sm text-zinc-300">
                      Total Raised
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold sm:text-2xl text-white">
                        {(poolData.raised / 1000000).toFixed(1)}M
                      </span>
                      <span className="ml-1 text-zinc-400">USDT</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 sm:p-4">
                    <div className="mb-1 text-sm text-zinc-300">
                      Active Investors
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold sm:text-2xl text-white">
                        {poolData.investors.toLocaleString()}
                      </span>
                      <span className="ml-1 text-zinc-400">users</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3 sm:p-4">
                    <div className="mb-1 text-sm text-zinc-300">
                      Lock-up Period
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold sm:text-2xl text-white">
                        {poolData.lockupPeriod}
                      </span>
                      <span className="ml-1 text-zinc-400">days</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <AlertTriangle className={poolDetails.riskColor} />
                    <h3 className="text-lg font-medium text-white">
                      Risk Assessment
                    </h3>
                  </div>
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    <div
                      className={`rounded-lg border text-white ${
                        poolData.type === "low"
                          ? "border-blue-500/20 bg-blue-500/5"
                          : "border-zinc-700 bg-zinc-800/30"
                      } p-3 text-center`}
                    >
                      <div className="text-sm font-medium mb-1">Low</div>
                      {poolData.type === "low" && (
                        <CheckCircle className="mx-auto h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg border text-white ${
                        poolData.type === "medium"
                          ? "border-amber-500/20 bg-amber-500/5"
                          : "border-zinc-700 bg-zinc-800/30"
                      } p-3 text-center`}
                    >
                      <div className="text-sm font-medium mb-1">Medium</div>
                      {poolData.type === "medium" && (
                        <CheckCircle className="mx-auto h-5 w-5 text-amber-400" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg border text-white ${
                        poolData.type === "high"
                          ? "border-red-500/20 bg-red-500/5"
                          : "border-zinc-700 bg-zinc-800/30"
                      } p-3 text-center`}
                    >
                      <div className="text-sm font-medium mb-1">High</div>
                      {poolData.type === "high" && (
                        <CheckCircle className="mx-auto h-5 w-5 text-red-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    {poolData.type === "low"
                      ? "This pool focuses on capital preservation with low-risk investments in established markets. Suitable for conservative investors seeking stable returns."
                      : poolData.type === "high"
                      ? "This pool targets high-growth opportunities with significant volatility. Only suitable for investors with high risk tolerance seeking maximum returns."
                      : "This pool balances growth and stability through diversified investments. Suitable for investors seeking moderate returns with manageable risk."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="projects" className="mt-8">
              <TabsList className="grid w-full grid-cols-4 bg-zinc-800/50">
                <TabsTrigger
                  value="projects"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="allocation"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Allocation
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger
                  value="testimonials"
                  className="text-white data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
                >
                  Testimonials
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="mt-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Funded Projects
                    </CardTitle>
                    <CardDescription className="text-zinc-300">
                      Current and past projects funded through this investment
                      pool
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {poolProjects.map((project, index) => (
                        <Card
                          key={index}
                          className="border-zinc-800 bg-zinc-800/20 overflow-hidden"
                        >
                          <div className="relative h-40 w-full">
                            <Image
                              src={`https://images.unsplash.com/photo-1542336391-ae2936d8efe4?q=80&w=2923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                              alt={project.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute right-2 top-2">
                              <Badge
                                className={`
                                  ${
                                    project.status === "active"
                                      ? "bg-emerald-500 text-white"
                                      : project.status === "completed"
                                      ? "bg-blue-500 text-white"
                                      : "bg-amber-500 text-white"
                                  } 
                                `}
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="text-lg font-medium text-white mb-1">
                              {project.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              >
                                {project.type}
                              </Badge>
                              <span className="text-sm text-zinc-400">
                                {project.location}
                              </span>
                            </div>
                            <p className="text-sm text-zinc-300 mb-4">
                              {project.description}
                            </p>

                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-zinc-400">
                                  Completion
                                </span>
                                <span className="text-zinc-300">
                                  {project.completion}%
                                </span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                                <div
                                  className="h-full rounded-full bg-emerald-500"
                                  style={{ width: `${project.completion}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <div className="text-zinc-400">
                                Started:{" "}
                                <span className="text-zinc-300">
                                  {new Date(
                                    project.startDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="font-medium text-emerald-400">
                                {project.fundingAmount.toLocaleString()} USDT
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="allocation" className="mt-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Pool Allocation
                    </CardTitle>
                    <CardDescription className="text-zinc-300">
                      How funds in this pool are distributed across different
                      investment categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="h-80">
                      <Chart
                        type="pie"
                        data={{
                          labels: poolDetails.allocationBreakdown.map(
                            (item) => item.name
                          ),
                          datasets: [
                            {
                              label: "Allocation",
                              data: poolDetails.allocationBreakdown.map(
                                (item) => item.value
                              ),
                              backgroundColor: [
                                "rgba(16, 185, 129, 0.7)",
                                "rgba(59, 130, 246, 0.7)",
                                "rgba(245, 158, 11, 0.7)",
                                "rgba(239, 68, 68, 0.7)",
                              ],
                              borderColor: [
                                "rgba(16, 185, 129, 1)",
                                "rgba(59, 130, 246, 1)",
                                "rgba(245, 158, 11, 1)",
                                "rgba(239, 68, 68, 1)",
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                              labels: {
                                color: "white",
                                font: {
                                  size: 12,
                                },
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: (context: {
                                  label: string;
                                  raw: number;
                                }) => `${context.label}: ${context.raw}%`,
                              },
                            },
                          },
                        }}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">
                        Lending Criteria
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-4">
                          <Info className="mt-1 h-5 w-5 text-zinc-400" />
                          <div>
                            <h4 className="font-medium text-white">
                              Borrower Requirements
                            </h4>
                            <p className="text-sm text-zinc-300">
                              {poolData.type === "low"
                                ? "Established businesses with strong credit history and substantial collateral"
                                : poolData.type === "high"
                                ? "Innovative startups and high-growth ventures with promising business models"
                                : "Mix of established businesses and growth-oriented companies with solid fundamentals"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-4">
                          <Shield className="mt-1 h-5 w-5 text-zinc-400" />
                          <div>
                            <h4 className="font-medium text-white">
                              Collateral Requirements
                            </h4>
                            <p className="text-sm text-zinc-300">
                              {poolData.type === "low"
                                ? "High collateral ratio (80%+) with liquid assets and strong guarantees"
                                : poolData.type === "high"
                                ? "Lower collateral requirements with focus on business potential and equity options"
                                : "Moderate collateral (50-70%) with mix of assets and business performance guarantees"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="mt-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Historical Performance
                    </CardTitle>
                    <CardDescription className="text-zinc-300">
                      Monthly returns over the past 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Chart
                        type="line"
                        data={{
                          labels: poolDetails.performanceData.map(
                            (item) => item.month
                          ),
                          datasets: [
                            {
                              label: "Monthly Return (%)",
                              data: poolDetails.performanceData.map(
                                (item) => item.return
                              ),
                              borderColor: "rgba(16, 185, 129, 1)",
                              backgroundColor: "rgba(16, 185, 129, 0.1)",
                              tension: 0.3,
                              fill: true,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              grid: {
                                color: "rgba(255, 255, 255, 0.1)",
                              },
                              ticks: {
                                color: "rgba(255, 255, 255, 0.7)",
                              },
                            },
                            x: {
                              grid: {
                                color: "rgba(255, 255, 255, 0.1)",
                              },
                              ticks: {
                                color: "rgba(255, 255, 255, 0.7)",
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              labels: {
                                color: "white",
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: (context: any) =>
                                  `Return: ${context.raw}%`,
                              },
                            },
                          },
                        }}
                      />
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-4 text-center">
                        <div className="text-sm text-zinc-300 mb-1">
                          Avg. Monthly Return
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {(
                            poolDetails.performanceData.reduce(
                              (acc, item) => acc + item.return,
                              0
                            ) / poolDetails.performanceData.length
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                      <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-4 text-center">
                        <div className="text-sm text-zinc-300 mb-1">
                          Best Month
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {Math.max(
                            ...poolDetails.performanceData.map(
                              (item) => item.return
                            )
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                      <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-4 text-center">
                        <div className="text-sm text-zinc-300 mb-1">
                          Worst Month
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {Math.min(
                            ...poolDetails.performanceData.map(
                              (item) => item.return
                            )
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-800/20 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-5 w-5 text-zinc-400" />
                        <h3 className="text-lg font-medium text-white">
                          Performance Disclaimer
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-300">
                        Past performance is not indicative of future results.
                        Investment values can go up and down. The data shown
                        represents historical returns and should not be
                        considered a guarantee of future performance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testimonials" className="mt-4">
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Investor Testimonials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          name: "Alex Thompson",
                          role: "Retail Investor",
                          quote:
                            poolData.type === "low"
                              ? "This pool has been perfect for my retirement savings. Consistent returns without the stress of market volatility."
                              : poolData.type === "high"
                              ? "The high-risk pool delivered exceptional returns during the last quarter. Definitely not for the faint of heart, but the rewards have been worth it."
                              : "A well-balanced option that's given me steady growth without excessive risk. The diversification has protected my investment during market downturns.",
                        },
                        {
                          name: "Jennifer Wu",
                          role: "Financial Advisor",
                          quote:
                            poolData.type === "low"
                              ? "I recommend this pool to clients nearing retirement. The stable returns and low volatility make it an excellent choice for capital preservation."
                              : poolData.type === "high"
                              ? "For clients with a high risk tolerance and long investment horizon, this pool has outperformed traditional options significantly."
                              : "This balanced pool forms the core of many of my clients' portfolios. The risk-adjusted returns have been impressive.",
                        },
                        {
                          name: "Marcus Johnson",
                          role: "Institutional Investor",
                          quote:
                            poolData.type === "low"
                              ? "We've allocated a portion of our foundation's endowment to this pool for stability. The consistent performance has been exactly what we needed."
                              : poolData.type === "high"
                              ? "As part of our alternative investment strategy, this high-yield pool has provided excellent diversification and returns."
                              : "The medium-risk pool has been a reliable performer in our portfolio, offering good returns without excessive correlation to traditional markets.",
                        },
                        {
                          name: "Sophia Rodriguez",
                          role: "Angel Investor",
                          quote:
                            poolData.type === "low"
                              ? "After years of high-risk investments, I've moved a portion of my portfolio here for stability. The peace of mind is worth just as much as the returns."
                              : poolData.type === "high"
                              ? "The exposure to emerging technologies and markets in this pool has been exceptional. The management team has a keen eye for identifying winners."
                              : "This pool strikes the right balance between growth and stability. I've been impressed with the consistent performance through varying market conditions.",
                        },
                      ].map((testimonial, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-zinc-800 bg-zinc-800/20 p-4 sm:p-5 backdrop-blur-sm"
                        >
                          <div className="mb-3 flex items-center gap-1 sm:gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <p className="mb-4 text-sm sm:text-base italic text-zinc-200">
                            &quot;{testimonial.quote}&quot;
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-700">
                              <div className="flex h-full w-full items-center justify-center text-base sm:text-lg font-medium text-white">
                                {testimonial.name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {testimonial.name}
                              </div>
                              <div className="text-xs sm:text-sm text-zinc-300">
                                {testimonial.role}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Investment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-zinc-300">Funding Progress</span>
                    <span className="font-medium text-white">{progress}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 bg-zinc-800"
                    // indicatorClassName={poolDetails.progressColor}
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-zinc-400">
                      {poolData.raised.toLocaleString()} USDT
                    </span>
                    <span className="text-zinc-400">
                      {poolData.target.toLocaleString()} USDT
                    </span>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-zinc-300">
                      Minimum Investment
                    </div>
                    <div className="text-lg font-medium text-white">
                      {poolData.minInvestment} USDT
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-300">
                      Maximum Investment
                    </div>
                    <div className="text-lg font-medium text-white">
                      {poolData.maxInvestment} USDT
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-300">Expected APR</div>
                    <div className="text-lg font-medium text-white">{poolData.apr}%</div>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div>
                  <h3 className="mb-3 text-base font-medium text-white">
                    Investment Terms
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
                      <div className="mb-1 font-medium text-white">
                        Lock-up Period
                      </div>
                      <div className="text-sm text-zinc-300">
                        {poolData.lockupPeriod} days minimum
                      </div>
                    </div>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
                      <div className="mb-1 font-medium text-white">
                        Payout Schedule
                      </div>
                      <div className="text-sm text-zinc-300">
                        Monthly distributions
                      </div>
                    </div>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
                      <div className="mb-1 font-medium text-white">
                        Early Withdrawal
                      </div>
                      <div className="text-sm text-zinc-300">
                        5% fee on principal
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Funding round closing in</span>
                  </div>
                  <div className="font-medium">{poolData.daysLeft} days</div>
                </div>

                <Button
                  className={`w-full bg-oga-green hover:bg-oga-green-dark`}
                >
                  Invest Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Total Projects</span>
                  <span className="font-medium text-white">
                    {poolProjects.length}
                  </span>
                </div>
                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Active Projects</span>
                  <span className="font-medium text-white">
                    {poolProjects.filter((p) => p.status === "active").length}
                  </span>
                </div>
                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Completed Projects</span>
                  <span className="font-medium text-white">
                    {
                      poolProjects.filter((p) => p.status === "completed")
                        .length
                    }
                  </span>
                </div>
                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Pending Projects</span>
                  <span className="font-medium text-white">
                    {poolProjects.filter((p) => p.status === "pending").length}
                  </span>
                </div>
                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Average Funding</span>
                  <span className="font-medium text-white">
                    {Math.round(
                      poolProjects.reduce(
                        (acc, p) => acc + p.fundingAmount,
                        0
                      ) / poolProjects.length
                    ).toLocaleString()}{" "}
                    USDT
                  </span>
                </div>
                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Average Completion</span>
                  <span className="font-medium text-white">
                    {Math.round(
                      poolProjects.reduce((acc, p) => acc + p.completion, 0) /
                        poolProjects.length
                    )}
                    %
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 hover:bg-zinc-800"
                >
                  View All Projects
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
