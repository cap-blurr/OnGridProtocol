"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleOff, Cpu, MapPin, Wallet } from "lucide-react";
import { DeviceData } from "@/types/device";

interface DeviceInfoProps {
  data: DeviceData;
}

export function DeviceInfo({ data}: DeviceInfoProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Device Information</CardTitle>
        <CardDescription>Device and location details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Device ID</span>
          </div>
          <span className="text-sm font-mono">{data.device_id.substring(0, 8)}...</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Location</span>
          </div>
          <Badge variant="outline">{data.country_code}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Wallet</span>
          </div>
          <span className="text-sm font-mono">{data.wallet_address.substring(0, 6)}...</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleOff className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Downtime</span>
          </div>
          <span className="text-sm">0h 12m</span>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between py-1">
              <span>Grid Frequency</span>
              <span>{data.pzem.frequency.toFixed(1)} Hz</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Power Factor</span>
              <span>{data.pzem.power_factor.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Last Updated</span>
              <span>Just now</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

