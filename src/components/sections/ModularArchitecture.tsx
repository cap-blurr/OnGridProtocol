"use client";

import Image from "next/image";
import stack from "../../../public/landing/stack.png";
import eth from "../../../public/landing/eth.png";
import decentralized from "../../../public/landing/decentralized.png";

export default function ModularArchitecture() {
  return (
    <div className="relative mx-auto px-4 pb-12 pt-16 lg:pt-24 md:min-h-screen bg-green-950 bg-opacity-20 overflow-hidden">
      <h2 className="text-center text-3xl md:text-5xl font-bold mb-16 leading-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
        Verifying Onchain Credits
      </h2>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center h-full max-w-7xl pt-16 md:pt-28 lg:pt-40 mx-auto px-4">
          <div className="mr-auto place-self-center ">
            <h1 className="mb-4 max-w-3xl text-2xl md:text-4xl font-extrabold leading-none tracking-tight text-white">
              Generation Layer
            </h1>

            <div>
              <p className="text-base md:text-xl lg:mb-8 mb-6 max-w-2xl font-light text-gray-500 lg:text-2xl">
                Edmond X data monitoring and reporting
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute aspect-square bg-yellow-700 rounded-full blur-[122px] flex-none left-1/2 top-[37px] -translate-x-1/2 w-[85%]"></div>
            <div className="relative">
              <Image
                src={decentralized}
                alt=""
                width={500}
                height={500}
                className="w-[250px] "
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row-reverse  justify-between items-center h-full max-w-7xl pt-16 md:pt-28 lg:pt-40 mx-auto px-4">
          <div className="ml-6 md:ml-12 ">
            <h1 className="mb-4 max-w-3xl text-2xl md:text-4xl font-extrabold leading-none tracking-tight text-white ">
              Verification Layer
            </h1>

            <div>
              <p className="text-base md:text-xl lg:mb-8 mb-6 max-w-2xl font-light text-gray-500 lg:text-2xl">
                P2P enabled network verification
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute aspect-square bg-blue-700 rounded-full blur-[122px] flex-none left-1/2 top-[37px] -translate-x-1/2 w-[85%]"></div>
            <div className="relative">
              <Image
                src={stack}
                alt=""
                width={500}
                height={500}
                className="w-[250px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center h-full pt-6 md:pt-16 mx-auto px-4">
          <div className="mr-auto place-self-center ">
            <h1 className="mb-4 max-w-3xl text-2xl md:text-4xl font-extrabold leading-none tracking-tight text-white">
              Consensus Layer
            </h1>

            <div>
              <p className="md:text-xl lg:mb-8 mb-6 max-w-2xl font-light text-gray-500 lg:text-2xl">
                Onchain Record settlement
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute aspect-square bg-green-700 rounded-full blur-[122px] flex-none left-1/2 top-[37px] -translate-x-1/2 w-[85%]"></div>
            <div className="relative">
              <Image
                src={eth}
                alt=""
                width={400}
                height={400}
                className="w-[250px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
