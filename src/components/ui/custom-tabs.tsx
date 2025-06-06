"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DashboardTabsProps {
  tabs: { value: string; label: string }[];
  activeTab: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function DashboardTabs({
  tabs,
  activeTab,
  onValueChange,
  className,
  children
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onValueChange} className={cn("space-y-6", className)}>
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <TabsList className="bg-black/50 border border-[#4CAF50]/20 p-1 min-w-full w-max">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="min-w-[150px] flex-shrink-0 data-[state=active]:bg-[#4CAF50]/10 data-[state=active]:text-[#4CAF50] data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[#4CAF50] px-6 py-2.5 hover:text-[#4CAF50]/80 transition-colors relative"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
} 