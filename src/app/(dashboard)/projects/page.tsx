"use client";
import { ProjectGrid } from "@/components/project/project.grid";
import GradientSection from "@/components/ui/gradient-section";

export default function Projects() {
  return (
    <>
      <GradientSection className="">
        <main className="relative">
          <div className="space-y-6 relative max-w-6xl mx-auto mb-8 mt-6">
            <div className="flex flex-col gap-2 mb-12">
              <h2 className="text-center text-3xl font-bold leading-tight">
                Carbon Credit Projects
              </h2>
              <p className="mx-auto max-w-[800px] text-zinc-300 mt-4 text-center md:text-base">
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
