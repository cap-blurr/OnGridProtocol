"use client"

import { Globe, ExternalLink, CheckCircle, Users, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SupplierCard() {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-zinc-800 bg-oga-black backdrop-blur-sm transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-emerald-900/10">
      <div className="relative h-48 w-full">
        <Image
          src="https://images.unsplash.com/photo-1592263904934-b00851dc93eb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c29sYXIlMjBpbnN0YWxsYXRpb258ZW58MHx8MHx8fDA%3D"
          alt="SolarTech Solutions installation"
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
          <h3 className="text-2xl font-bold text-white">SolarTech Solutions</h3>
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
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            Certified
          </Badge>
          <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400">
            Experienced
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
            Green Energy
          </Badge>
        </div>

        <p className="mb-6 text-sm text-zinc-300">
          Premium solar installation company specializing in residential and commercial photovoltaic systems with
          integrated battery storage solutions and smart energy management.
        </p>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-zinc-300">Installations Completed</span>
            <span className="font-medium text-white">85%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-[#28a745]"
              style={{ width: "85%" }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-zinc-400">
            <span>850,000 USDT</span>
            <span>1,000,000 USDT</span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
      
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <CheckCircle className="h-4 w-4 text-zinc-300" />
              Avg. Installation Cost
            </div>
            <div className="text-lg font-medium text-white">0.85 USDT</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <CheckCircle className="h-4 w-4 text-zinc-300" />
              Total Capacity
            </div>
            <div className="text-lg font-medium text-white">100,000,000</div>
          </div>
        </div>

        <div className="mb-6 flex justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Users className="h-4 w-4" />
            <span>1,234 clients</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Clock className="h-4 w-4" />
            <span>2 days left</span>
          </div>
        </div>

        <Link href="/suppliers/solartech" className="block w-full">
          <Button className="w-full bg-gradient-to-r from-[#28a745] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#28a745] text-white">
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

