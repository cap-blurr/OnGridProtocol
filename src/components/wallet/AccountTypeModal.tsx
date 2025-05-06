"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserType } from "@/providers/userType";
import { useAccount } from "wagmi";
import { Loader2, User, Code, CheckCircle2, ArrowRight, UserCheck } from "lucide-react";

export default function AccountTypeModal() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'normal' | 'developer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userType, setUserType } = useUserType();
  const { isConnected } = useAccount();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show modal when wallet is connected
  useEffect(() => {
    if (isMounted && isConnected) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isConnected, isMounted]);

  const handleTypeSelection = (type: 'normal' | 'developer') => {
    setUserType(type);
    setOpen(false);
    
    // Redirect to the appropriate dashboard
    if (type === 'developer') {
      router.push('/developer-dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  // Don't render during SSR or if modal shouldn't be shown
  if (!isMounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dark sm:max-w-[550px] text-zinc-100 shadow-2xl shadow-black/40 bg-gradient-to-b from-black to-zinc-900/95 border border-emerald-900/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Select Your Account Type
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-center pt-2">
            Choose the account type that best fits your needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Normal User Option */}
          <div 
            className={`relative rounded-xl overflow-hidden group cursor-pointer ${
              selectedType === 'normal' 
                ? 'border-2 border-emerald-500' 
                : 'border border-zinc-800 hover:border-emerald-800'
            }`}
            onClick={() => handleTypeSelection('normal')}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="p-6 flex flex-col items-center space-y-4">
              {selectedType === 'normal' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </motion.div>
              )}
              
              <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-2 relative">
                <UserCheck className="w-8 h-8 text-emerald-500" />
              </div>
              
              <h3 className="font-bold text-xl text-center">Standard User</h3>
              
              <p className="text-sm text-zinc-400 text-center">
                Invest in clean energy projects and track your carbon credits
              </p>

              <ul className="text-xs text-zinc-500 space-y-2 pt-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  Investment dashboard
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  Portfolio tracking
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  Carbon credit monitoring
                </li>
              </ul>
            </div>
          </div>
          
          {/* Developer Option */}
          <div 
            className={`relative rounded-xl overflow-hidden group cursor-pointer ${
              selectedType === 'developer' 
                ? 'border-2 border-emerald-500' 
                : 'border border-zinc-800 hover:border-emerald-800'
            }`}
            onClick={() => handleTypeSelection('developer')}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="p-6 flex flex-col items-center space-y-4">
              {selectedType === 'developer' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </motion.div>
              )}
              
              <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-2">
                <Code className="w-8 h-8 text-emerald-500" />
              </div>
              
              <h3 className="font-bold text-xl text-center">Developer</h3>
              
              <p className="text-sm text-zinc-400 text-center">
                Access APIs and tools to build on the OnGrid Protocol
              </p>
              
              <ul className="text-xs text-zinc-500 space-y-2 pt-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  API access
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  Developer tools
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  Integration monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 transition-colors flex items-center justify-center gap-2"
            onClick={() => handleTypeSelection(selectedType || 'normal')}
            disabled={!selectedType || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Continue to {selectedType === 'developer' ? 'Developer' : 'Standard'} Dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 