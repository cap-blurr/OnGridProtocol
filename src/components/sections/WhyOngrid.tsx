"use client";

import { Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GradientSection from "../ui/gradient-section";
import { IconChartPie2Filled, IconStackForward } from "@tabler/icons-react";

export default function WhyOngrid() {
  const advantages = [
    {
      icon: Leaf,
      title: "Direct Impact",
      description:
        "Your investment fuels real change—providing electricity to homes, schools, and businesses while cutting CO₂ emissions.",
    },
    {
      icon: IconStackForward,
      title: "Trust & Transparency",
      description:
        "Blockchain-powered tracking ensures security and accountability in all transactions",
    },
    {
      icon: IconChartPie2Filled,
      title: "Sustainable Growth",
      description:
        "Empowering communities with clean energy drives long-term economic development.",
    },
  ];

  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((current) => (current + 1) % advantages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [advantages.length]);

  const cardVariants = {
    initial: {
      opacity: 0.7,
      scale: 1,
      y: 0,
    },
    active: {
      opacity: 1,
      scale: 1.02,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    inactive: {
      opacity: 0.7,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <GradientSection>
      <section className=" relative flex flex-row items-center justify-center">
        {/* <div className="glowing-ellipse h-[100px] w-[100px]"></div> */}
        {/* <div className="glowing-ellipse h-[100px] w-[100px] top-[25%] ml-0 mr-0 left-0 right-0"></div> */}
        <section className="py-12 md:py-24 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid reverse lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="grid gap-6">
                {advantages.map((advantage, index) => (
                  <motion.div
                    initial="initial"
                    animate={activeCard === index ? "active" : "inactive"}
                    variants={cardVariants}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                    key={index}
                  >
                    <Card
                      className={`bg-transparent cursor-pointer border-0 backdrop-blur-sm 
        ${
          activeCard === index
            ? "shadow-xl shadow-green-500/20 border border-green-500/70"
            : ""
        }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <advantage.icon
                              size={36}
                              className="text-green-500"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {advantage.title}
                            </h3>
                            <p className="text-gray-200">
                              {advantage.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center p-2 bg-green-500/10 rounded-lg mb-6">
                    <Leaf className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-500 font-medium">
                      Why OnGrid Protocol
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                  Why Ongrid Protocol?
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                    High energy costs and unreliable power hinder economic
                    growth in emerging markets. Solar companies can bridge this
                    gap, but they need capital to scale. Ongrid Protocol
                    connects these companies with private investors, enabling
                    the expansion of clean, affordable energy while offering
                    investment opportunities that drive real-world
                    impact—powering communities, reducing CO₂ emissions, and
                    fostering sustainable development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </GradientSection>
  );
}
