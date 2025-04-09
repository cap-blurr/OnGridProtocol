import { ArrowRight, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  IconBrandCodesandbox,
  IconCpu,
  IconDatabaseDollar,
  IconSpeakerphone,
} from "@tabler/icons-react";
import Link from "next/link";

export default function JoinOngrid() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-950 bg-opacity-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-bold mb-8 leading-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-center mt-8 mx-auto max-w-[700px] text-gray-300 text-lg md:text-xl/relaxed  lg:text-2xl/relaxed">
              Invest in clean energy. Make an impact.
            </p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3 mt-12 px-4 md:px-0">
          <div className="w-full bg-zinc-900 rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <IconDatabaseDollar className="w-16 h-16 md:w-24 md:h-24 -rotate-45 text-blue-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Investors
            </h2>
            <p className="text-gray-400 text-base">
              Invest in vetted clean energy projects across emerging markets.
              Your capital helps fund solar companies that bring stable,
              affordable electricity to communities while generating measurable
              environmental and social impact.
            </p>
          </div>

          <div className="w-full bg-zinc-900 rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <SunIcon className="w-16 h-16 md:w-24 md:h-24 -rotate-45 text-yellow-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              For Solar Companies
            </h2>
            <p className="text-gray-400 text-base">
              Access the capital needed to scale clean energy solutions. Whether
              serving households, schools, hospitals, or businesses, your
              company can expand its reach and accelerate the transition to
              sustainable power.
            </p>
          </div>

          <div className="w-full  bg-zinc-900 rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <IconCpu className="w-16 h-16 md:w-24 md:h-24  text-green-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Powered by EdmondX
            </h2>
            <p className="text-gray-400 text-base">
              EdmondX enables real-time energy data tracking and on-chain carbon
              credit issuance. By integrating your renewable infrastructure with
              EdmondX, you ensure full transparency and unlock new revenue
              streams through carbon credit trading
            </p>
          </div>
        </div>

        <p className="text-center mt-8 mx-auto max-w-[700px] text-gray-300 text-lg md:text-xl/relaxed  lg:text-2xl/relaxed">
          Join the movement.
        </p>

        <div className="flex justify-center mt-8 ">
          <Link href="https://forms.gle/moCpCKMtVwCpVa92A" target="blank">
            <Button
              size="lg"
              className=" bg-oga-green p-4  border border-oga-green-dark  text-white text-lg rounded-full hover:bg-oga-yellow-dark hover:text-gray-900  md:text-lg md:px-6 md:py-3"
            >
              Build with us <ArrowRight size={20} className="ml-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
