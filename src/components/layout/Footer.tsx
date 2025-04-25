"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/ongrid-logo.png";
import { ArrowRight } from "lucide-react";
import { IconBrandTelegram, IconBrandX } from "@tabler/icons-react";

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  return (
    <footer 
      ref={footerRef}
      className="relative py-16 md:py-24 bg-black border-t border-zinc-800/30 overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Logo and brand */}
          <motion.div 
            className="md:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block mb-6">
              <Image src={logo} alt="Ongrid-logo" className="w-32 md:w-40" />
            </Link>
            <p className="text-zinc-400 mb-6 max-w-md">
            Empowering clean energy in emerging markets through blockchain-driven financing, transparent carbon credit solutions, and sustainable impact. 
            Join us in accelerating the global energy transition.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://t.me/ongridprotocol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 hover:bg-emerald-900/30 transition-colors duration-200"
              >
                <IconBrandTelegram className="h-5 w-5 text-white" />
                <span className="sr-only">Telegram</span>
              </Link>
              <Link
                href="https://x.com/OngridProtocol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 hover:bg-emerald-900/30 transition-colors duration-200"
              >
                <IconBrandX className="h-5 w-5 text-white" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div 
            className="md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-medium mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="https://ongrid-protocol.gitbook.io/ongrid-protocol" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-zinc-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-zinc-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="https://forms.gle/moCpCKMtVwCpVa92A" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  Partnership Requests
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Newsletter */}
          <motion.div 
            className="md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white font-medium mb-6 text-lg">Join Our Newsletter</h4>
            <p className="text-zinc-400 mb-6">
              Stay updated on Ongrid Protocol's latest news and developments.
            </p>
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-emerald-700 focus:ring-0 focus:outline-none py-3 px-4 text-white rounded-md transition-colors duration-200"
              />
              <button className="absolute right-2 top-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white p-1.5 rounded-md transition-all duration-200">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-zinc-500 text-sm">
              We respect your privacy. No spam, ever.
            </p>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          className="pt-8 border-t border-zinc-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Ongrid Protocol. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                href="/privacy-policy" 
                className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link 
                href="/terms-of-service" 
                className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors duration-200"
              >
                Terms
              </Link>
              <Link 
                href="mailto:info@ongridprotocol.com" 
                className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
