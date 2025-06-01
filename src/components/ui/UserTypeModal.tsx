'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserType } from '@/providers/userType';
import { Code, User, Zap, Building } from 'lucide-react';

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
      await new Promise(resolve => setTimeout(resolve, 500));
      onSelectUserType(selectedType);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl mx-4 max-h-[90vh] overflow-y-auto modal-backdrop">
        <DialogHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-bold">Welcome to OnGrid Protocol!</DialogTitle>
          <DialogDescription className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Please select your account type to get started with the right dashboard and features for your needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Normal User Option */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              selectedType === 'normal' 
                ? 'bg-emerald-900/50 border-emerald-600 ring-2 ring-emerald-600 shadow-lg shadow-emerald-600/20' 
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 hover:shadow-lg'
            }`}
            onClick={() => setSelectedType('normal')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-blue-500/20 border border-blue-500/30">
                <User className="w-10 h-10 text-blue-500" />
              </div>
              <CardTitle className="text-white text-xl">Investor/User</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                I want to invest in clean energy projects and track my portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Access investment opportunities</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Trade carbon credits</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Track portfolio performance</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Monitor environmental impact</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Developer Option */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              selectedType === 'developer' 
                ? 'bg-emerald-900/50 border-emerald-600 ring-2 ring-emerald-600 shadow-lg shadow-emerald-600/20' 
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 hover:shadow-lg'
            }`}
            onClick={() => setSelectedType('developer')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 rounded-full bg-purple-500/20 border border-purple-500/30">
                <Code className="w-10 h-10 text-purple-500" />
              </div>
              <CardTitle className="text-white text-xl">Developer</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                I want to create and manage renewable energy projects
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Create project proposals</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Manage funding campaigns</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Complete KYC verification</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Access project analytics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-8 pt-6 border-t border-gray-700">
          <Button
            onClick={handleConfirm}
            disabled={!selectedType || isLoading}
            className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3 font-semibold transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Setting up your account...
              </>
            ) : (
              <>
                Continue to {selectedType === 'developer' ? 'Developer' : 'Investment'} Dashboard
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </Button>
          
          {selectedType && (
            <p className="text-gray-400 text-sm text-center max-w-md">
              You can change your account type later in your profile settings
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 