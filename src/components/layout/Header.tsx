"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import { MobileNav } from "./MobileNav";
import ConnectButton from "./ConnectButton";
import { usePathname } from "next/navigation";

interface NavBarProps {
  isHome?: boolean;
}

export default function Header({ isHome = false }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we're on a dashboard page
  const isDashboard = pathname.includes('/dashboard') || pathname.includes('/developer-dashboard');

  return (    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isDashboard
          ? "bg-gray-950 bg-opacity-30 backdrop-blur-lg backdrop-filter h-16"
          : "bg-transparent backdrop-blur-lg backdrop-filter h-16"
      }`}
    >
      <nav className="mx-auto w-full max-w-screen-xl flex items-center justify-between h-full px-5">        <Link href="/" className="text-4xl font-bold text-white hover:opacity-90 transition-opacity">
        <Image 
          src="/ongrid-logo.png" 
          alt="Ongrid-logo" 
          width={120} 
          height={48}
          className="w-20 md:w-28 lg:w-32" 
        />
        </Link>
        <div className="hidden md:flex space-x-12 text-white md:text-lg">
          {isHome ? (
            <>
              <ScrollLink
                to={"about"}
                smooth={true}
                duration={800}
                offset={-100}
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                About
              </ScrollLink>
              <ScrollLink
                to={"how-it-works"}
                smooth={true}
                duration={800}
                offset={-100}
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                How It Works
              </ScrollLink>
              <Link
                href="/projects"
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                Projects
              </Link>
             
            </>
          ) : (
            <>
              <Link
                href="/?#about"
                className="hidden md:block font-medium cursor-pointer hover:text-oga-yellow-dark"
              >
                About
              </Link>
              <Link
                href="/?#how-it-works"
                className="hidden md:block font-medium cursor-pointer hover:text-oga-yellow-dark"
              >
                How It Works
              </Link>
              <Link
                href="/projects"
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                Projects
              </Link>
            </>
          )}
        </div>
      <div className="flex items-center">
      <ConnectButton />
        <div className="block md:hidden">
          <MobileNav isHome={isHome}/>
        </div>
      </div>
        
      </nav>
    </header>
  );
}