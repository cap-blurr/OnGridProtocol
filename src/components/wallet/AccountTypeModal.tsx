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
} from "@/components/ui/dialog";
import { useUserType } from "@/providers/userType";
import { useAccount } from "wagmi";
import { CheckCircle2, Code, UserCheck } from "lucide-react";

export default function AccountTypeModal() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'normal' | 'developer' | null>(null);
  const { setUserType } = useUserType();
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
    setSelectedType(type);
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
      <DialogContent className="dark max-w-[90%] w-[400px] mx-auto text-zinc-100 shadow-2xl shadow-black/40 bg-gradient-to-b from-black to-zinc-900/95 border border-emerald-900/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white text-center">
            Select Your Account Type
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-center pt-1 text-sm">
            Choose the account type that best fits your needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 my-4">
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
            
            <div className="p-4 flex items-center space-x-4">
              {selectedType === 'normal' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </motion.div>
              )}
              
              <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-emerald-500" />
              </div>
              
              <div>
                <h3 className="font-bold text-white">Standard User</h3>
                <p className="text-xs text-zinc-400">
                  Invest in clean energy projects
                </p>
              </div>
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
            
            <div className="p-4 flex items-center space-x-4">
              {selectedType === 'developer' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </motion.div>
              )}
              
              <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center">
                <Code className="w-6 h-6 text-emerald-500" />
              </div>
              
              <div>
                <h3 className="font-bold text-white">Solar Developer</h3>
                <p className="text-xs text-zinc-400">
                  Access APIs for solar projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 