"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconBrandTelegram, IconBrandX } from "@tabler/icons-react";
import { ArrowRight, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";

interface NavBarProps {
  isHome?: boolean;
}

export function MobileNav({ isHome }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close the sheet after a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <MenuIcon
          className="text-6xl block ml-2 cursor-pointer text-white"
          size={24}
        />
      </SheetTrigger>
      <SheetContent className="bg-zinc-900 text-white border-0">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-10 mt-12">
          {isHome ? (
            <>
              <ScrollLink
                to="about"
                smooth={true}
                duration={800}
                offset={-100}
                className="text-lg cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={handleLinkClick}
              >
                About
              </ScrollLink>
              <ScrollLink
                to="how-it-works"
                smooth={true}
                duration={800}
                offset={-100}
                className="text-lg cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={handleLinkClick}
              >
                How It Works
              </ScrollLink>
            </>
          ) : (
            <>
              <Link
                href="/?#about"
                className="text-lg cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={handleLinkClick}
              >
                About
              </Link>
              <Link
                href="/?#how-it-works"
                className="text-lg cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={handleLinkClick}
              >
                How It Works
              </Link>
            </>
          )}
          <Link
            href="/projects"
            className="text-lg cursor-pointer hover:text-emerald-400 transition-colors"
            onClick={handleLinkClick}
          >
            Projects
          </Link>

          <Link
            href="https://forms.gle/moCpCKMtVwCpVa92A"
            target="_blank"
            rel="noopener noreferrer" 
            onClick={handleLinkClick}
          >
            <Button className="bg-emerald-700 border border-emerald-600 text-white text-lg rounded-md hover:bg-emerald-600 transition-colors duration-200 w-full flex items-center justify-center">
              Build with us <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>

        <div className="flex gap-6 text-white mt-12">
          <Link
            href="https://t.me/ongridprotocol"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            <IconBrandTelegram className="h-6 w-6" />
            <span className="sr-only">Telegram</span>
          </Link>
          <Link
            href="https://x.com/OngridProtocol"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            <IconBrandX className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
