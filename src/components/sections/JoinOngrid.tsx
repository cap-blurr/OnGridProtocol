import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  IconBrandCodesandbox,
  IconDatabaseDollar,
  IconSpeakerphone,
} from "@tabler/icons-react";

export default function JoinOngrid() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-950 bg-opacity-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-center text-3xl md:text-5xl font-bold mb-8 leading-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              ONLY One Earth Invest to keep it GREEN
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl/relaxed  lg:text-2xl/relaxed">
              Join OnGrid: Powering Clean Energy Together
            </p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3 mt-12">
          <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <IconDatabaseDollar className="w-24 h-24 -rotate-45 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Investors</h2>
            <p className="text-gray-400 text-base">
              Support the transition to renewables, earning potential returns
              and aiding carbon reduction.
            </p>
          </div>

          <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <IconBrandCodesandbox className="w-24 h-24 -rotate-45 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Developers</h2>
            <p className="text-gray-400 text-base">
              Integrate AI, DePin devices, and decentralized green financing
              within your applications on OnGrid.
            </p>
          </div>

          <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <IconSpeakerphone className="w-24 h-24 -rotate-45 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Advocates</h2>
            <p className="text-gray-400 text-base">
              Promote clean energy initiatives, engage in environmental
              advocacy, and inspire community action.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8 ">
          <Button
            className=" bg-oga-green  border border-oga-green-dark  text-white text-lg rounded-full hover:bg-oga-yellow-dark hover:text-gray-900"
            size="lg"
          >
            Build with us <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
