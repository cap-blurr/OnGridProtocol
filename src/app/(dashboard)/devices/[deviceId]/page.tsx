"use client";

import DeviceOverview from "@/components/project/project-dashboard/device-overview";

export default function DeviceDetails() {
  return (
    <div className="dark">
         <h1 className="mt-8 text-center text-white text-3xl font-bold leading-tight">
           Device Information
            </h1>
        <DeviceOverview/>
    </div>
  );
}
