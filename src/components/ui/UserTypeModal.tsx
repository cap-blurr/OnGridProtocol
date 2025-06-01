'use client';

import { useState } from 'react';
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

  const handleConfirm = async () => {
    if (!selectedType) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onSelectUserType(selectedType);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-black/95 backdrop-blur-md border border-oga-green/30 text-white max-w-lg w-full mx-4 p-8 rounded-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-oga-green to-oga-yellow flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-black" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-oga-green to-oga-yellow bg-clip-text text-transparent">
            Choose Dashboard
          </h2>
        </div>
        
        {/* Options */}
        <div className="space-y-4 mb-8">
          {/* Standard Dashboard Option */}
          <button 
            className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-center group ${
              selectedType === 'normal' 
                ? 'border-oga-green bg-oga-green/10 shadow-lg shadow-oga-green/20' 
                : 'border-gray-700 bg-gray-800/30 hover:border-oga-green/50 hover:bg-gray-800/50'
            }`}
            onClick={() => setSelectedType('normal')}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                selectedType === 'normal' 
                  ? 'bg-oga-green text-white' 
                  : 'bg-gray-700 text-gray-300 group-hover:bg-oga-green/20 group-hover:text-oga-green'
              }`}>
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white">Standard Dashboard</h3>
            </div>
          </button>

          {/* Solar Projects Option */}
          <button 
            className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-center group ${
              selectedType === 'developer' 
                ? 'border-oga-yellow bg-oga-yellow/10 shadow-lg shadow-oga-yellow/20' 
                : 'border-gray-700 bg-gray-800/30 hover:border-oga-yellow/50 hover:bg-gray-800/50'
            }`}
            onClick={() => setSelectedType('developer')}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                selectedType === 'developer' 
                  ? 'bg-oga-yellow text-black' 
                  : 'bg-gray-700 text-gray-300 group-hover:bg-oga-yellow/20 group-hover:text-oga-yellow'
              }`}>
                <LayoutGrid className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white">Solar Projects</h3>
            </div>
          </button>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleConfirm}
          disabled={!selectedType || isLoading}
          className={`w-full h-14 text-lg font-semibold transition-all duration-200 rounded-xl ${
            selectedType === 'normal' 
              ? 'bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white shadow-lg shadow-oga-green/30'
              : selectedType === 'developer'
              ? 'bg-gradient-to-r from-oga-yellow to-oga-yellow-light hover:from-oga-yellow-dark hover:to-oga-yellow text-black shadow-lg shadow-oga-yellow/30'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Loading...
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