"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserType } from "@/providers/userType";
import { usePrivy } from '@privy-io/react-auth';
import { CheckCircle2, Code, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountTypeModal() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'normal' | 'developer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserType, userType, isLoading: userTypeLoading } = useUserType();
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show modal when wallet is connected and user type isn't set
  useEffect(() => {
    // Add a small delay to prevent immediate modal flash
    const timer = setTimeout(() => {
      if (isMounted && ready && authenticated && !userType && !userTypeLoading) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [authenticated, ready, isMounted, userType, userTypeLoading]);

  const handleTypeSelection = async (type: 'normal' | 'developer') => {
    setSelectedType(type);
    setIsLoading(true);
    
    try {
      // Set user type
      setUserType(type);
      
      // Wait a bit for the state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOpen(false);
      
      // Redirect to the appropriate dashboard with a slight delay for smooth transition
      setTimeout(() => {
        if (type === 'developer') {
          router.push('/developer-dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 200);
      
    } catch (error) {
      console.error('Error setting user type:', error);
      setIsLoading(false);
    }
  };

  // Don't render during SSR or if not ready
  if (!isMounted || !ready) return null;

  // Don't show if already has user type
  if (userType) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={() => !isLoading && setOpen(false)}>
          <DialogContent className="dark max-w-[95%] sm:max-w-[420px] mx-auto text-zinc-100 shadow-2xl shadow-black/40 bg-gradient-to-b from-black to-zinc-900/95 border border-emerald-900/30">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white text-center">
                Welcome! Choose Your Account Type
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-center pt-1 text-sm">
                {user?.email?.address ? `Hello ${user.email.address}! ` : ''}
                Select the account type that best fits your needs
              </DialogDescription>
            </DialogHeader>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4 my-4"
            >
              {/* Normal User Option */}
              <motion.div 
                className={`relative rounded-xl overflow-hidden group cursor-pointer transition-all duration-200 ${
                  selectedType === 'normal' 
                    ? 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'border border-zinc-800 hover:border-emerald-800 hover:shadow-md hover:shadow-emerald-900/20'
                } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => !isLoading && handleTypeSelection('normal')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="p-4 sm:p-5 flex items-center space-x-4">
                  {selectedType === 'normal' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                  
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-base sm:text-lg">Standard User</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      Invest in clean energy projects and earn returns
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Developer Option */}
              <motion.div 
                className={`relative rounded-xl overflow-hidden group cursor-pointer transition-all duration-200 ${
                  selectedType === 'developer' 
                    ? 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'border border-zinc-800 hover:border-emerald-800 hover:shadow-md hover:shadow-emerald-900/20'
                } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => !isLoading && handleTypeSelection('developer')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="p-4 sm:p-5 flex items-center space-x-4">
                  {selectedType === 'developer' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                  
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <Code className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-base sm:text-lg">Solar Developer</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      Create and manage solar energy projects
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center space-x-2 py-4"
              >
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span className="text-sm text-zinc-400">Setting up your account...</span>
              </motion.div>
            )}

            <div className="text-center text-xs text-zinc-500 mt-2">
              You can change this later in your profile settings
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 