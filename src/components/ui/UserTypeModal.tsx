'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserType } from '@/providers/userType';
import { TrendingUp, Code2 } from 'lucide-react';

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
      // Reduced delay for better mobile UX
      await new Promise(resolve => setTimeout(resolve, 300));
      onSelectUserType(selectedType);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-black/95 backdrop-blur-md border border-oga-green/30 text-white max-w-md mx-4 p-6 rounded-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-oga-green to-oga-green-light flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-oga-yellow" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-oga-green to-oga-yellow bg-clip-text text-transparent mb-2">
            Choose Your Path
          </h2>
          <p className="text-gray-400 text-sm">
            Select your account type to continue
          </p>
        </div>
        
        {/* Options */}
        <div className="space-y-3 mb-6">
          {/* Investor Option */}
          <button 
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
              selectedType === 'normal' 
                ? 'border-oga-green bg-oga-green/10 shadow-lg shadow-oga-green/20' 
                : 'border-gray-700 bg-gray-800/30 hover:border-oga-green/50 hover:bg-gray-800/50'
            }`}
            onClick={() => setSelectedType('normal')}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                selectedType === 'normal' 
                  ? 'bg-oga-green text-white' 
                  : 'bg-gray-700 text-gray-300 group-hover:bg-oga-green/20 group-hover:text-oga-green'
              }`}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Investor</h3>
                <p className="text-sm text-gray-400">
                  Invest in renewable energy projects
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                selectedType === 'normal' 
                  ? 'border-oga-green bg-oga-green' 
                  : 'border-gray-500'
              }`}>
                {selectedType === 'normal' && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>
            </div>
          </button>

          {/* Developer Option */}
          <button 
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
              selectedType === 'developer' 
                ? 'border-oga-yellow bg-oga-yellow/10 shadow-lg shadow-oga-yellow/20' 
                : 'border-gray-700 bg-gray-800/30 hover:border-oga-yellow/50 hover:bg-gray-800/50'
            }`}
            onClick={() => setSelectedType('developer')}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                selectedType === 'developer' 
                  ? 'bg-oga-yellow text-black' 
                  : 'bg-gray-700 text-gray-300 group-hover:bg-oga-yellow/20 group-hover:text-oga-yellow'
              }`}>
                <Code2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Developer</h3>
                <p className="text-sm text-gray-400">
                  Create and manage energy projects
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                selectedType === 'developer' 
                  ? 'border-oga-yellow bg-oga-yellow' 
                  : 'border-gray-500'
              }`}>
                {selectedType === 'developer' && (
                  <div className="w-full h-full rounded-full bg-black scale-50" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleConfirm}
          disabled={!selectedType || isLoading}
          className={`w-full h-12 text-base font-semibold transition-all duration-200 rounded-xl ${
            selectedType === 'normal' 
              ? 'bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white shadow-lg shadow-oga-green/30'
              : selectedType === 'developer'
              ? 'bg-gradient-to-r from-oga-yellow to-oga-yellow-light hover:from-oga-yellow-dark hover:to-oga-yellow text-black shadow-lg shadow-oga-yellow/30'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Setting up...
            </div>
          ) : selectedType ? (
            `Continue as ${selectedType === 'developer' ? 'Developer' : 'Investor'}`
          ) : (
            'Select Account Type'
          )}
        </Button>
        
        {selectedType && !isLoading && (
          <p className="text-gray-500 text-xs text-center mt-3">
            You can change this later in settings
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
} 