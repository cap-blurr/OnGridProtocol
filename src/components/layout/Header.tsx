"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import { MobileNav } from "./MobileNav";
import ConnectButton from "./ConnectButton";
import { usePathname, useRouter } from "next/navigation";

interface NavBarProps {
  isHome?: boolean;
}

export default function Header({ isHome = false }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we're on a dashboard page
  const isDashboard = pathname.includes('/dashboard') || pathname.includes('/developer-dashboard');

  // Handle navigation to homepage sections
  const handleSectionNavigation = (section: string) => {
    // If we're already on the homepage, just scroll
    if (pathname === '/') {
      const element = document.getElementById(section);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we're on another page, navigate to homepage then scroll
      router.push('/?section=' + section);
    }
  };

  // Effect to handle scrolling after navigation
  useEffect(() => {
    if (pathname === '/' && window.location.search.includes('section=')) {
      const section = new URLSearchParams(window.location.search).get('section');
      if (section) {
        setTimeout(() => {
          const element = document.getElementById(section);
          element?.scrollIntoView({ behavior: 'smooth' });
          // Clean up the URL
          window.history.replaceState({}, '', '/');
        }, 100);
      }
    }
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isDashboard
          ? "bg-black/20 h-16"
          : "bg-transparent h-16"
      }`}
    >
      <nav className="mx-auto w-full max-w-screen-xl flex items-center justify-between h-full px-5">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Image 
            src="/ongrid-logo.png" 
            alt="OnGrid Protocol" 
            width={120} 
            height={48}
            className="w-20 md:w-28 lg:w-32" 
          />
        </Link>
        <div className="hidden md:flex space-x-8 text-white md:text-lg">
          {isHome ? (
            <>
              <ScrollLink
                to="about"
                smooth={true}
                duration={800}
                offset={-100}
                className="cursor-pointer hover:text-oga-green transition-colors font-medium"
              >
                About
              </ScrollLink>
              <ScrollLink
                to="how-it-works"
                smooth={true}
                duration={800}
                offset={-100}
                className="cursor-pointer hover:text-oga-green transition-colors font-medium"
              >
                How It Works
              </ScrollLink>
              <Link
                href="/projects"
                className="cursor-pointer hover:text-oga-green transition-colors font-medium"
              >
                Projects
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => handleSectionNavigation('about')}
                className="font-medium cursor-pointer hover:text-oga-green transition-colors"
              >
                About
              </button>
              <button
                onClick={() => handleSectionNavigation('how-it-works')}
                className="font-medium cursor-pointer hover:text-oga-green transition-colors"
              >
                How It Works
              </button>
              <Link
                href="/projects"
                className="cursor-pointer hover:text-oga-green transition-colors font-medium"
              >
                Projects
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center">
          <ConnectButton />
          <div className="block md:hidden">
            <MobileNav isHome={isHome} />
          </div>
        </div>
      </nav>
    </header>
  );
}