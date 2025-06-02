'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserType } from '@/providers/userType';
import { TrendingUp, LayoutGrid } from 'lucide-react';

interface UserTypeModalProps {
  isOpen: boolean;
  onSelectUserType: (type: UserType) => void;
}

export default function UserTypeModal({ isOpen, onSelectUserType }: UserTypeModalProps) {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging for modal state
  useEffect(() => {
    console.log('🎭 UserTypeModal: isOpen changed to:', isOpen);
  }, [isOpen]);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedType(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedType) return;
    
    console.log('🎯 UserTypeModal: User confirmed selection:', selectedType);
    setIsLoading(true);
    
    try {
      // Minimal delay for smooth UI transition
      await new Promise(resolve => setTimeout(resolve, 100));
      onSelectUserType(selectedType);
    } catch (error) {
      console.error('Error in handleConfirm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-black/95 backdrop-blur-md border border-oga-green/20 text-white max-w-sm w-full mx-4 p-6 rounded-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-black" />
          </div>
          <h2 className="text-xl font-bold gradient-text gradient-primary">
            Choose Dashboard
          </h2>
        </div>
        
        {/* Options */}        <div className="space-y-3 mb-6">
          {/* Standard Dashboard Option */}
          <button 
            className={`w-full p-4 rounded-lg border transition-all duration-200 text-center group ${
              selectedType === 'normal' 
                ? 'border-oga-green bg-oga-green/5 shadow-sm shadow-oga-green/10' 
                : 'border-gray-800 hover:border-oga-green/30 hover:bg-black/40'
            }`}
            onClick={() => setSelectedType('normal')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                selectedType === 'normal' 
                  ? 'gradient-primary text-white' 
                  : 'bg-black/40 text-gray-400 group-hover:text-oga-green'
              }`}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-medium text-white">Standard Dashboard</h3>
            </div>
          </button>

          {/* Solar Projects Option */}
          <button 
            className={`w-full p-4 rounded-lg border transition-all duration-200 text-center group ${
              selectedType === 'developer' 
                ? 'border-oga-yellow bg-oga-yellow/5 shadow-sm shadow-oga-yellow/10' 
                : 'border-gray-800 hover:border-oga-yellow/30 hover:bg-black/40'
            }`}
            onClick={() => setSelectedType('developer')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                selectedType === 'developer' 
                  ? 'gradient-secondary text-black' 
                  : 'bg-black/40 text-gray-400 group-hover:text-oga-yellow'
              }`}>
                <LayoutGrid className="w-5 h-5" />
              </div>
              <h3 className="text-base font-medium text-white">Solar Projects</h3>
            </div>
          </button>
        </div>

        {/* Action Button */}        <Button
          onClick={handleConfirm}
          disabled={!selectedType || isLoading}
          className={`w-full h-11 text-sm font-medium transition-all duration-200 rounded-lg ${
            selectedType === 'normal' 
              ? 'gradient-primary text-white shadow-sm shadow-oga-green/20'
              : selectedType === 'developer'
              ? 'gradient-secondary text-black shadow-sm shadow-oga-yellow/20'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          ) : selectedType ? (
            'Continue'
          ) : (
            'Select Dashboard'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
} 