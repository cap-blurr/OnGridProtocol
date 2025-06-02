"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3,
  Settings, 
  FilePlus,
  ClipboardCheck,
  UserCheck,
  LineChart,
  LayoutGrid,
  FileText,
  Monitor,
  DollarSign,
  BarChart4,
  Sun
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

export default function DeveloperSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 h-screen fixed left-0 top-16 pb-6 px-3 border-r border-emerald-900/20 bg-black/60 backdrop-blur-md flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-2">
        <SidebarSection title="Solar Projects">
          <SidebarNavItem
            href="/developer-dashboard"
            label="Dashboard"
            icon={<LayoutGrid size={18} />}
            isActive={pathname === "/developer-dashboard"}
          />
          <SidebarNavItem
            href="/developer-dashboard/kyc"
            label="Conduct KYC"
            icon={<UserCheck size={18} />}
            isActive={pathname === "/developer-dashboard/kyc"}
          />
          <SidebarNavItem
            href="/developer-dashboard/projects/create-low"
            label="Create Residential"
            icon={<FilePlus size={18} />}
            isActive={pathname === "/developer-dashboard/projects/create-low"}
          />
          <SidebarNavItem
            href="/developer-dashboard/projects/create-high"
            label="Create Commercial"
            icon={<Sun size={18} />}
            isActive={pathname === "/developer-dashboard/projects/create-high"}
          />
        </SidebarSection>

        <SidebarSection title="DePIN Monitoring">
          <SidebarNavItem
            href="/developer-dashboard/repayment"
            label="Repayment Tracking"
            icon={<DollarSign size={18} />}
            isActive={pathname === "/developer-dashboard/repayment"}
          />
          <SidebarNavItem
            href="/developer-dashboard/funding"
            label="Solar Funding Levels"
            icon={<BarChart3 size={18} />}
            isActive={pathname === "/developer-dashboard/funding"}
          />
          <SidebarNavItem
            href="/developer-dashboard/analytics"
            label="Energy Production"
            icon={<LineChart size={18} />}
            isActive={pathname === "/developer-dashboard/analytics"}
          />
          <SidebarNavItem
            href="/developer-dashboard/status"
            label="Installation Status"
            icon={<Monitor size={18} />}
            isActive={pathname === "/developer-dashboard/status"}
          />
        </SidebarSection>
      </div>
      
      <div className="mt-auto">
        <SidebarNavItem
          href="/developer-dashboard/settings"
          label="Settings"
          icon={<Settings size={18} />}
          isActive={pathname === "/developer-dashboard/settings"}
        />
      </div>
    </div>
  );
} 