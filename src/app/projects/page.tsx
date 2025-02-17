"use client";
import { ProjectGrid } from "@/components/project/project.grid";
import GradientSection from "@/components/ui/gradient-section";

export default function Projects() {
  return (
    <>
      <GradientSection>
        <main className="min-h-screen relative pt-40">
          {/* <div className="relative min-h-screen  overflow-scroll">
          <div className="fixed inset-0">
            <div className="absolute inset-0  bg-[url('/landing/landing-bg.svg')] bg-bottom bg-no-repeat bg-opacity-20" />
          </div> */}
          <div className="space-y-6 relative max-w-6xl mx-auto">
            <div className="flex flex-col gap-2 mb-20">
              <h2 className="text-center text-3xl md:text-5xl font-bold  leading-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                Carbon Credit Projects
              </h2>
              <p className="mx-auto max-w-[800px] mt-4 mb-2 text-center md:text-xl text-gray-400">
                Explore and support high-impact carbon credit projects across
                multiple blockchain networks. Contribute to global
                sustainability efforts while benefiting from eco-friendly
                investments.
              </p>
            </div>
            <ProjectGrid />
          </div>
          {/* </div> */}
        </main>
      </GradientSection>
    </>
  );
}
