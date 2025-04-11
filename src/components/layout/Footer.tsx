import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/ongrid-logo.png";
import { IconBrandTelegram, IconBrandX } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="w-full py-12 sm:py-20 bg-[#0f0f0f]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex lg:flex-row pb-12 gap-7 lg:gap-0 ">
          <Link href="/" className="text-4xl font-bold text-white">
            <Image src={logo} alt="Ongrid-logo" className="w-36 lg:w-52" />
          </Link>
        </div>
        <div className="flex justify-between flex-col py-4 min-[500px]:py-14 gap-8 min-[500px]:gap-16 lg:gap-0 md:flex-row">
          <div className="flex items-start flex-row gap-8 sm:gap-12 xl:gap-24">
            <div className="block">
              <h4 className="text-gray-200 mb-8 text-lg">Quick Links</h4>
              <ul className="grid text-gray-400 gap-4 min-[500px]:gap-6 min-[500px]:text-left">
                <li>
                  <Link href="https://ongrid-protocol.gitbook.io/ongrid-protocol" target="blank" className="hover:text-white transition-colors">
                    Docs
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="https://forms.gle/moCpCKMtVwCpVa92A" target="blank" className="hover:text-white transition-colors">
                    Partnership Requests
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="block my-8 lg:max-w-md">
            <h3 className=" font-semibold text-xl md:text-2xl text-gray-300 leading-9 mb-4 text-center md:text-left">
              Sign-Up to Our Newsletter
            </h3>
            <p className="text-gray-400 mb-8 text-center md:text-left">
              Stay updated on Ongrid Protocol latest updates.
            </p>

            <div className="space-y-2">
              <div className="relative max-w-lg mx-auto w-full">
                <input
                  className="flex h-12 w-full md:w-96 rounded-full border border-input px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:outline-none"
                  placeholder="Enter your email"
                  type="email"
                />
                <button
                  className="absolute inset-y-0 end-0 flex h-10 mt-1 mr-1 w-28 text-white bg-oga-green items-center justify-center rounded-full border border-transparent"
                  aria-label="Subscribe"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="py-9 border-t border-gray-700">
          <div className="flex items-center justify-center flex-col gap-8 lg:gap-0 lg:flex-row lg:justify-between">
            <span className="text-sm text-gray-500 ">
              ©2025 Ongrid Protocol All Rights Reserved.
            </span>
            <div className="flex gap-4 text-white max-w-[200px]">
              <Link
                href="https://t.me/ongridprotocol"
                target="blank"
                className="hover:text-white transition-colors"
              >
                <IconBrandTelegram className="h-6 w-6" />
                <span className="sr-only">Telegram</span>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
