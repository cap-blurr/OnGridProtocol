'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserType } from '@/providers/userType';
import { Zap, TrendingUp, Code2 } from 'lucide-react';

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
      // Add a small delay to prevent UI flashing
      await new Promise(resolve => setTimeout(resolve, 800));
      onSelectUserType(selectedType);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-gradient-to-b from-gray-900 to-black border-[#3D9970]/30 text-white max-w-2xl mx-4">
        <DialogHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-[#3D9970] to-[#4CAF50] flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#3D9970] to-[#FFDC00] bg-clip-text text-transparent">
            Welcome to OnGrid
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-lg">
            Choose your path to clean energy
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Investor Option */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border-2 ${
              selectedType === 'normal' 
                ? 'border-[#3D9970] bg-gradient-to-br from-[#3D9970]/20 to-[#4CAF50]/10 shadow-lg shadow-[#3D9970]/20' 
                : 'border-gray-700 bg-gray-800/50 hover:border-[#3D9970]/50 hover:bg-gray-800/70'
            }`}
            onClick={() => setSelectedType('normal')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-[#3D9970] to-[#4CAF50] flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl font-bold">Investor</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-center">
              <p className="text-gray-300 text-sm mb-4">
                Invest in renewable energy projects and earn returns
              </p>
              <div className="space-y-2 text-xs text-gray-400">
                <div>✓ Investment opportunities</div>
                <div>✓ Carbon credit trading</div>
                <div>✓ Portfolio tracking</div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Option */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border-2 ${
              selectedType === 'developer' 
                ? 'border-[#FFDC00] bg-gradient-to-br from-[#FFDC00]/20 to-[#FFEB3B]/10 shadow-lg shadow-[#FFDC00]/20' 
                : 'border-gray-700 bg-gray-800/50 hover:border-[#FFDC00]/50 hover:bg-gray-800/70'
            }`}
            onClick={() => setSelectedType('developer')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-[#FFDC00] to-[#FFEB3B] flex items-center justify-center">
                <Code2 className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-white text-xl font-bold">Developer</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-center">
              <p className="text-gray-300 text-sm mb-4">
                Create and manage renewable energy projects
              </p>
              <div className="space-y-2 text-xs text-gray-400">
                <div>✓ Project creation</div>
                <div>✓ Funding management</div>
                <div>✓ Analytics dashboard</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-8">
          <Button
            onClick={handleConfirm}
            disabled={!selectedType || isLoading}
            className={`w-full max-w-sm py-4 text-lg font-semibold transition-all duration-200 ${
              selectedType === 'normal' 
                ? 'bg-gradient-to-r from-[#3D9970] to-[#4CAF50] hover:from-[#2d7355] hover:to-[#388e3c] text-white'
                : selectedType === 'developer'
                ? 'bg-gradient-to-r from-[#FFDC00] to-[#FFEB3B] hover:from-[#e6c500] hover:to-[#f9d71c] text-black'
                : 'bg-gray-700 text-gray-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
                Setting up...
              </>
            ) : selectedType ? (
              `Enter ${selectedType === 'developer' ? 'Developer' : 'Investment'} Dashboard`
            ) : (
              'Select Account Type'
            )}
          </Button>
          
          {selectedType && !isLoading && (
            <p className="text-gray-400 text-sm text-center">
              You can change this later in settings
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 