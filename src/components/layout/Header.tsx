"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import logo from "../../../public/ongrid-logo.png";
import { MobileNav } from "./MobileNav";
import ConnectButton from "./ConnectButton";

interface NavBarProps {
  isHome?: boolean;
  isApp?: boolean;
}

export default function Header({ isHome = false, isApp = false }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-950 bg-opacity-30 backdrop-blur-lg backdrop-filter"
          : "bg-transparent backdrop-blur-lg backdrop-filter pt-5"
      }`}
    >
      <nav className="mx-auto w-full max-w-screen-xl flex items-center justify-between py-4 px-5 md:p-5">
        <Link href="/" className="text-4xl font-bold text-white">
          <Image src={logo} alt="Ongrid-logo" className="w-32 lg:w-40" />
        </Link>
        <div className="hidden md:flex space-x-12 text-white md:text-lg">
          {isApp ? (
            <>
              <Link
                href="/"
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                Discover
              </Link>
              <Link
                href="/"
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                Portfolio
              </Link>
            </>
          ) : isHome ? (
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
              <Link
                href="/impact"
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                Impact
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
              <Link
                href="/impact"
                className="cursor-pointer hover:text-oga-yellow-dark"
              >
                Impact
              </Link>
            </>
          )}
        </div>
      <div className="flex items-center">
      {isApp ? (
          <ConnectButton />
        ) : (
          <Link href="https://forms.gle/moCpCKMtVwCpVa92A" target="blank">
            <Button className="hidden md:inline-flex bg-oga-green p-4 border border-oga-green-dark text-white text-lg rounded-full hover:bg-oga-yellow-dark hover:text-gray-900 lg:text-lg lg:px-6 lg:py-3">
              Build with us
            </Button>
          </Link>
        )}
        <div className="block md:hidden">
          <MobileNav isHome={isHome} />
        </div>
      </div>
        
      </nav>
    </header>
  );
}