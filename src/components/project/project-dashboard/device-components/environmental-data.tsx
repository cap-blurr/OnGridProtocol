"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Sun } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { DeviceData } from "@/types/device";

interface EnvironmentalDataProps {
    data: DeviceData;
  }

export function EnvironmentalData({
    data
  }: EnvironmentalDataProps) {

  const avgTemp = (data.temperature.sensor1 + data.temperature.sensor2) / 2

  const lightIntensityMap = {
    dark: 10,
    dim: 30,
    normal: 50,
    bright: 80,
    "very bright": 100,
  }

  const lightIntensityPercent = lightIntensityMap[data.ldr.intensity as keyof typeof lightIntensityMap] || 50

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Environmental Data</CardTitle>
        <CardDescription>Temperature and light conditions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-orange-500 dark:text-orange-400" />
              <span className="text-sm font-medium">Temperature</span>
            </div>
            <span className="text-sm font-bold">{avgTemp.toFixed(1)}°C</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Sensor 1: {data.temperature.sensor1.toFixed(1)}°C</div>
            <div>Sensor 2: {data.temperature.sensor2.toFixed(1)}°C</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sun className="h-4 w-4 mr-2 text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm font-medium">Light Intensity</span>
            </div>
            <span className="text-sm font-bold capitalize">{data.ldr.intensity}</span>
          </div>
          <Progress value={lightIntensityPercent} className="h-2" />
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Raw: {data.ldr.raw_value}</div>
            <div>Voltage: {data.ldr.voltage.toFixed(2)}V</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

