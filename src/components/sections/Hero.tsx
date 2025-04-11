import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FloatingSphere } from "../ui/floating-spheres";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <main className="md:min-h-screen  ">
      <div className="py-3 pb-0 px-4">
        <div className="relative md:min-h-screen  overflow-hidden rounded-3xl">
          <div className="absolute inset-0">
            <div className="absolute inset-0  bg-[url('/landing/landing-bg.svg')] bg-bottom bg-no-repeat bg-opacity-20" />
          </div>

          <div className="relative px-6 pb-12 pt-20 md:p-12 md:pt-24">
            <div className="relative px-0 py-12 sm:py-24 sm:px-12 md:py-32">
              <motion.div
                className="mx-auto max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
              >
                <h1 className="relative text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-100 to-gray-500 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                  Enable{" "}
                  <span className="relative inline-block bg-gradient-to-r from-gray-100 to-gray-500 bg-clip-text text-transparent ">
                    Clean
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 300 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 9C71.3333 3.66667 141.667 1 212 1C260 1 288 4.33333 296 6"
                        stroke="#FFD700"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{" "}
                  Energy Transition On-Chain with{" "}
                  <span className="text-oga-green-light">OnGrid</span>
                </h1>
                <p className="mt-6 text-lg text-white/80 sm:text-xl">
                  Unlock capital for clean Energy projects,Onchain!
                </p>
                <Link href="https://forms.gle/weTesyUcPou2Snug9" target="blank">
                  <Button
                    className="mt-8 bg-oga-green px-8 py-3 h-12 border border-oga-green-dark  text-white ext-base md:text-lg rounded-full hover:bg-oga-yellow-dark hover:text-gray-900"
                    size="lg"
                  >
                    Get Access <ArrowRight size={20} className="ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <FloatingSphere
        size={100}
        color="#022c22"
        top="120px"
        left="10%"
        delay={100}
        icon="/landing/bulb-green.png"
        iconSize={100}
      />
      <FloatingSphere
        size={100}
        color="#1a2e05"
        top="20%"
        right="15%"
        delay={50}
        icon="/landing/biomass-green.png"
        iconSize={100}
      />
      <FloatingSphere
        size={90}
        color="#022c22"
        bottom="15%"
        right="50px"
        delay={2500}
        icon="/landing/turbine-green.png"
        iconSize={100}
      />
    </main>
  );
}
