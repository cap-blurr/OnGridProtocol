"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import SidebarToggle from "@/components/layout/SidebarToggle";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Add client-side rendering guard
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      <Header />
      <div className="flex flex-1 w-full overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 md:ml-64 pb-8 w-full overflow-x-hidden">
          <div className="p-3 md:p-6">
            <div className="md:hidden mb-4">
              <SidebarToggle />
            </div>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
