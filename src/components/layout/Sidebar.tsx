"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Leaf, 
  Settings, 
  FilePlus,
  Wallet,
  CreditCard,
  TreePine,
  LineChart,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

function SidebarNavItem({ href, label, icon, isActive }: SidebarNavItemProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal pl-3 mb-1 text-zinc-300 hover:text-white hover:bg-zinc-800/50",
          isActive && "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
}

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xs uppercase font-semibold text-zinc-400 mb-3 pl-3">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 h-screen fixed left-0 top-16 pb-6 px-3 border-r border-emerald-900/20 bg-black/60 backdrop-blur-md flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-2">
        <SidebarSection title="Investments">
          <SidebarNavItem
            href="/dashboard"
            label="Dashboard"
            icon={<LayoutGrid size={18} />}
            isActive={pathname === "/dashboard"}
          />
          <SidebarNavItem
            href="/dashboard/investments/current"
            label="Current Investments"
            icon={<Wallet size={18} />}
            isActive={pathname === "/dashboard/investments/current"}
          />
          <SidebarNavItem
            href="/dashboard/investments/opportunities"
            label="Investment Opportunities"
            icon={<FilePlus size={18} />}
            isActive={pathname === "/dashboard/investments/opportunities"}
          />
          <SidebarNavItem
            href="/dashboard/investments/pools"
            label="Investment Pools"
            icon={<CreditCard size={18} />}
            isActive={pathname === "/dashboard/investments/pools"}
          />
          <SidebarNavItem
            href="/dashboard/investments/analytics"
            label="ROI Analytics"
            icon={<LineChart size={18} />}
            isActive={pathname === "/dashboard/investments/analytics"}
          />
        </SidebarSection>

        <SidebarSection title="Carbon Credits">
          <SidebarNavItem
            href="/dashboard/carbon-credits"
            label="Carbon Dashboard"
            icon={<TreePine size={18} />}
            isActive={pathname === "/dashboard/carbon-credits"}
          />
          <SidebarNavItem
            href="/dashboard/carbon-credits/device-stats"
            label="Device Energy Stats"
            icon={<BarChart3 size={18} />}
            isActive={pathname === "/dashboard/carbon-credits/device-stats"}
          />
          <SidebarNavItem
            href="/dashboard/carbon-credits/emissions"
            label="CO₂ Emissions Reduced"
            icon={<Leaf size={18} />}
            isActive={pathname === "/dashboard/carbon-credits/emissions"}
          />
        </SidebarSection>
      </div>
      
      <div className="mt-auto">
        <SidebarNavItem
          href="/dashboard/settings"
          label="Settings"
          icon={<Settings size={18} />}
          isActive={pathname === "/dashboard/settings"}
        />
      </div>
    </div>
  );
} 