"use client"

import { Globe, ExternalLink, TrendingUp, Shield, Users, Clock, Percent } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface InvestmentPoolCardProps {
  name: string
  type: "low" | "medium" | "high"
  apr: number
  raised: number
  target: number
  minInvestment: number
  maxInvestment: number
  investors: number
  daysLeft: number
}

export default function InvestmentPoolCard({
  name = "Medium-Risk Pool",
  type = "medium",
  apr = 12.5,
  raised = 850000,
  target = 1000000,
  minInvestment = 100,
  maxInvestment = 10000,
  investors = 1234,
  daysLeft = 2,
}: Partial<InvestmentPoolCardProps>) {
  const progress = Math.round((raised / target) * 100)

  const getPoolDetails = (type: string) => {
    switch (type) {
      case "low":
        return {
          tags: ["Stable", "Secure"],
          description:
            "Conservative investment pool focused on stable returns with minimal risk exposure. Ideal for long-term capital preservation with consistent yields.",
          riskColor: "bg-green-700 text-white",
        }
      case "high":
        return {
          tags: ["High-Yield", "Growth"],
          description:
            "High-risk investment pool targeting maximum returns through innovative projects and emerging markets with significant growth potential.",
          riskColor: "bg-red-500 text-white",
        }
      default: // medium
        return {
          tags: ["Balanced", "Diversified"],
          description:
            "Balanced investment pool offering moderate risk exposure with attractive returns. Diversified across multiple sectors for optimal performance.",
          riskColor: "bg-amber-500 text-white",
        }
    }
  }

  const poolDetails = getPoolDetails(type)

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-emerald-900/10">
      <div className="relative h-48 w-full">
        <Image
          src={`https://images.unsplash.com/photo-1542336391-ae2936d8efe4?q=80&w=2923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
          alt={`${name} background`}
          fill
          className="object-cover"
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <Badge className="bg-emerald-500 text-white">Live</Badge>
          <Badge className="bg-zinc-700 text-white">Solana</Badge>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-white">{name}</h3>
            <div className="mt-1">
              <Badge className={`${poolDetails.riskColor} px-3 py-0.5 text-xs font-medium capitalize rounded-full`}>
                {type} Risk
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Globe className="h-5 w-5" />
            </button>
            <button className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <ExternalLink className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {poolDetails.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="mb-6 text-sm text-zinc-300">{poolDetails.description}</p>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-zinc-300">Funding Progress</span>
            <span className="font-medium text-white">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-oga-green "
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-zinc-400">
            <span>{raised.toLocaleString()} USDT</span>
            <span>{target.toLocaleString()} USDT</span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Shield className="h-4 w-4 text-zinc-300" />
              Min Investment
            </div>
            <div className="text-lg font-medium text-white">{minInvestment} USDT</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <TrendingUp className="h-4 w-4 text-zinc-300" />
              Max Investment
            </div>
            <div className="text-lg font-medium text-white">{maxInvestment} USDT</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Percent className="h-4 w-4 text-zinc-300" />
              Expected APR
            </div>
            <div className="text-lg font-medium text-white">{apr}%</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Users className="h-4 w-4 text-zinc-300" />
              Active Investors
            </div>
            <div className="text-lg font-medium text-white">{investors.toLocaleString()}</div>
          </div>
        </div>

        <div className="mb-6 flex justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Clock className="h-4 w-4" />
            <span>{daysLeft} days left</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Percent className="h-4 w-4" />
            <span>Payout: Monthly</span>
          </div>
        </div>

        <Link href={`/investments/${type}-risk`} className="block w-full">
          <Button className="w-full bg-gradient-to-r from-[#28a745] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#28a745] text-white">
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

