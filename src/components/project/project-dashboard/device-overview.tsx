"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PowerStats } from "./device-components/power-stats";
import { EnvironmentalData } from "./device-components/environmental-data";
import { DeviceInfo } from "./device-components/device-info";
import { DeviceData } from "@/types/device";
import Spinner from "@/components/ui/spinner";

const DeviceOverview = () => {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const REFRESH_INTERVAL = 5 * 60 * 1000;

  useEffect(() => {
    // Fetch data every 5 minutes
    const fetchData = async () => {
      const currentTime = Date.now();
      if (deviceData && currentTime - lastFetchTime < REFRESH_INTERVAL) {
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/data");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        const extractedData = Object.values(data)[0] as DeviceData;
        setDeviceData(extractedData);
        setLastFetchTime(currentTime);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const carbonOffset = (Number(deviceData?.power.power_produced) * 0.7).toFixed(
    2
  );

  if (loading && !deviceData) return <Spinner />;
  if (error) return <p>Error: {error}</p>;
  if (!deviceData) return <p>No data available</p>;

  return (
    <div className="mx-auto bg-transparent md:px-6 py-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
           <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Power Produced
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-xl sm:text-2xl font-bold">{deviceData.power.power_produced.toFixed(2)} W</div> */}
              <p className="text-xl font-bold">
                {deviceData.current.power_produced_ma.toFixed(2)} mA /{" "}
                {deviceData.voltage.power_produced_mv.toFixed(2)} mV
              </p>
            </CardContent>
          </Card>

           <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Power Consumed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {deviceData.power.power_consumed.toFixed(2)} W
              </div>
              <p className="text-xs text-muted-foreground">
                {deviceData.current.power_consumed_ma.toFixed(2)} mA /{" "}
                {deviceData.voltage.power_consumed_mv.toFixed(2)} mV
              </p>
            </CardContent>
          </Card>

           <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Battery Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {deviceData.power.battery_storage.toFixed(2)} W
              </div>
              <p className="text-xs text-muted-foreground">
                {deviceData?.current.battery_storage_ma.toFixed(2)} mA /{" "}
                {deviceData.voltage.battery_storage_mv.toFixed(2)} mV
              </p>
            </CardContent>
          </Card>

           <Card className="bg-card/50 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Carbon Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600 dark:text-green-500">
                {carbonOffset} kg
              </div>
              <p className="text-xs text-muted-foreground">
                CO₂ equivalent offset
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PowerStats data={deviceData} />
          <EnvironmentalData data={deviceData} />
          <DeviceInfo data={deviceData} />
        </div>
      </div>
    </div>
  );
};

export default DeviceOverview;
