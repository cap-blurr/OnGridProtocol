import { Leaf, Coins, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GradientSection from "../ui/gradient-section";
import { IconMoneybag } from "@tabler/icons-react";

export function AboutSection() {
  const advantages = [
    {
      icon: IconMoneybag,
      title: "Invest in Clean Energy",
      description:
        "We bridge the financing gap by matching private investors with solar companies that need capital to scale.",
    },
    {
      icon: Zap,
      title: "Track Energy Data",
      description:
        "Our technology ensures real-time monitoring of energy production and consumption, enhancing transparency and efficiency.",
    },
    {
      icon: Coins,
      title: "Earn & Trade Carbon Credits",
      description:
        "By verifying and issuing carbon credits on-chain, we create a seamless way for companies and investors to benefit from their environmental impact.",
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
        <section className="py-12 md:py-24 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center p-2 bg-green-500/10 rounded-lg mb-6">
                    <Leaf className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-500 font-medium">
                      About OnGrid Protocol
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                    Powering the Future of Clean Energy
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                    Ongrid Protocol is transforming how clean energy is
                    financed, tracked, and scaled in emerging markets. By
                    leveraging blockchain technology, we connect investors with
                    solar companies, ensuring capital flows seamlessly to
                    projects that bring affordable and sustainable energy to
                    underserved regions. Our mission is to accelerate the
                    transition to clean energy while providing transparent,
                    data-driven solutions for carbon credit issuance and
                    trading.
                  </p>
                </div>
              </div>

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
            </div>
          </div>
        </section>
      </section>
    </GradientSection>
  );
}
