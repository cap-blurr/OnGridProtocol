import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const Statistics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 basis-[40%]">
      <Card className=" bg-gradient-to-br border-0 rounded-lg text-white from-oga-green to-oga-green-dark py-1 md:py-5">
        <CardHeader>
          <CardTitle className="text-3xl lg:text-4xl md:text-5xl font-bold">
            {" "}
            7,400
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold md:text-lg">
            GW of renewable capacity projected by 2028, with up to 11,000 GW
            needed by 2030 (COP28 goals)
          </p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/70 border-0 rounded-2xl text-white py-2 md:py-3 px-1 row-span-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Key Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-300 md:text-base">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="font-semibold">
              {" "}
              46% of global electricity could come from renewables by 2030
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <p className="font-semibold">
              Up to 10 million new jobs in the clean energy sector by 2030
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="font-semibold">
              Over $1.5 trillion in annual investments required to meet net-zero
              targets
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/70 border-0 rounded-2xl py-1 md:py-5 text-white">
        <CardHeader>
          <CardTitle className="text-3xl lg:text-4xl md:text-5xl font-bold">
            80%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 font-semibold md:text-lg">
            of new capacity growth driven by solar PV
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
