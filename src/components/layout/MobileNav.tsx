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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <MenuIcon
          className="text-6xl block ml-2  cursor-pointer text-white"
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
            </>
          ) : (
            <>
              <Link
                href="/?#about"
                className="font-medium cursor-pointer hover:text-oga-yellow-dark"
              >
                About
              </Link>

              <Link
                href="/?#how-it-works"
                className="font-medium cursor-pointer hover:text-oga-yellow-dark"
              >
                How It Works
              </Link>
            </>
          )}
          <Link
            href="/projects"
            className="text-lg cursor-pointer hover:text-oga-yellow-dark"
          >
            Projects
          </Link>

          <Link
            href="/impact"
            className="text-lg cursor-pointer hover:text-oga-yellow-dark"
          >
            Impact
          </Link>

          <Link href="https://forms.gle/moCpCKMtVwCpVa92A" target="blank">
            <Button className=" bg-oga-green p-4  border border-oga-green-dark  text-white text-lg rounded-full hover:bg-oga-yellow-dark hover:text-gray-900  md:text-lg md:px-6 md:py-3">
              Build with us <ArrowRight className="ml-4" />
            </Button>
          </Link>
        </div>

        <div className=" flex gap-6 text-white mt-12">
          <Link
            href="https://t.me/ongridprotocol"
            target="blank"
            className="hover:text-white transition-colors"
          >
            <IconBrandTelegram className="h-6 w-6" />
            <span className="sr-only">Discord</span>
          </Link>
          <Link
            href="https://x.com/OngridProtocol"
            target="blank"
            className="hover:text-white transition-colors"
          >
            <IconBrandX className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
