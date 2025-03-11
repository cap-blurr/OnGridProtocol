"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceData } from "@/types/device";



export function PowerStats({ data }: { data: DeviceData }) {

  const efficiency = (data.power.power_produced / data.pzem.power) * 100

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Power Statistics</CardTitle>
        <CardDescription>Current power metrics and efficiency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Grid Power</p>
              <p className="text-xl sm:text-2xl font-bold">{data.pzem.power.toFixed(2)} W</p>
            </div>
            <div>
              <p className="text-sm font-medium">Efficiency</p>
              <p className="text-xl sm:text-2xl font-bold">{efficiency.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Grid Voltage</p>
              <p className="text-xl sm:text-2xl font-bold">{data.pzem.voltage.toFixed(2)} V</p>
            </div>
            <div>
              <p className="text-sm font-medium">Grid Current</p>
              <p className="text-xl sm:text-2xl font-bold">{data.pzem.current.toFixed(2)} A</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

