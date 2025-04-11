/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  SidebarIcon,
  ArrowRightLeft,
  X,
  FileText,
  Truck,
  Compass,
} from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { IconBrandTelegram, IconBrandX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  const bottomRoutes = [
    {
      name: "Docs",
      href: "/docs",
      icon: FileText,
    },
    {
      name: "X",
      href: "/contracts",
      icon: IconBrandX,
    },
    {
      name: "Telegram",
      href: "https://github.com",
      icon: IconBrandTelegram,
      external: true,
    },
  ];

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-base rounded-md transition-colors text-gray-300 hover:text-white hover:bg-oga-green"
      >
        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      <div className="lg:hidden flex fixed mt-4  left-4 z-[70]">
        <button
          type="button"
          className=" p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <SidebarIcon className="w-6 h-6 text-white" />
        </button>
      </div>
      <nav
        className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-[#0f0f0f]  transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:w-64 border-r border-white/20
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
    `}
      >
        <div className="h-full flex flex-col">
          <div className="flex">
            <button
              type="button"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <Image
              src="/ongrid-logo.png"
              alt="Ongrid-logo"
              width={955}
              height={1060}
              priority
              quality={100}
              className="w-24 md:32 lg:w-36 py-6 pl-4"
            />
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-8">
              <div>
                <div className="space-y-6 mt-2">
                  <NavItem href="/dashboard" icon={Home}>
                    Overview
                  </NavItem>
                  <NavItem href="/projects" icon={Compass}>
                    Explore Projects
                  </NavItem>
                  <NavItem href="/investments" icon={ArrowRightLeft}>
                    Investment pools
                  </NavItem>
                  <NavItem href="/suppliers" icon={Truck}>
                    Suppliers
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4  border-t border-white/20">
            <nav className="space-y-1 px-2">
              {bottomRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  target={route.external ? "_blank" : undefined}
                  rel={route.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    pathname === route.href
                      ? " text-gray-300"
                      : "text-gray-300 hover:bg-oga-green hover:text-white"
                  )}
                >
                  <route.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="transition-opacity duration-200">
                    {route.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-[65] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
