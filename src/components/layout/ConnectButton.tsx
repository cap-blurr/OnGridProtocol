"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useUserType } from '@/providers/userType';
import { Button } from '@/components/ui/button';

export default function ConnectButton() {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout 
  } = usePrivy();
  
  const { userType, showUserTypeModal } = useUserType();
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle connection state to prevent UI flashing
  useEffect(() => {
    if (authenticated && isConnecting) {
      // Add a small delay to prevent UI flashing on mobile
      setTimeout(() => {
        setIsConnecting(false);
      }, 300);
    }
  }, [authenticated, isConnecting]);

  // Handle wallet connection
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await login();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setIsConnecting(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    setShowDropdown(false);
    await logout();
    setIsConnecting(false);
  };

  // Don't render until everything is ready and mounted
  if (!ready || !mounted) {
    return (
      <Button 
        disabled 
        className="bg-oga-yellow text-black hover:bg-oga-yellow-dark transition-colors opacity-50 cursor-not-allowed min-w-[120px]"
      >
        Loading...
      </Button>
    );
  }

  // Show connecting state
  if (isConnecting || showUserTypeModal) {
    return (
      <Button 
        disabled 
        className="bg-oga-yellow text-black opacity-75 cursor-not-allowed min-w-[120px] flex items-center justify-center"
      >
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
        {showUserTypeModal ? 'Setting up...' : 'Connecting...'}
      </Button>
    );
  }

  // Helper function to copy address to clipboard
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      // Use a more mobile-friendly notification
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      // You could replace this with a toast notification
      console.log('Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Helper function to format address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // If not authenticated, show connect button
  if (!authenticated) {
    return (
      <Button 
        onClick={handleConnect}
        className="bg-oga-yellow text-black hover:bg-oga-yellow-dark transition-colors font-medium min-w-[120px]"
      >
        Connect Wallet
      </Button>
    );
  }

  // If authenticated, show user info with dropdown
  const walletAddress = user?.wallet?.address;
  const emailAddress = user?.email?.address;
  const displayName = emailAddress || (walletAddress ? formatAddress(walletAddress) : 'Connected');

  return (
    <div className="relative">
      <Button 
        onClick={() => setShowDropdown(!showDropdown)}
        variant="outline"
        className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 transition-colors min-w-[120px]"
      >
        <div className="w-6 h-6 bg-oga-yellow text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
          {emailAddress?.charAt(0).toUpperCase() || 
           (walletAddress ? walletAddress.slice(2, 4).toUpperCase() : '??')}
        </div>
        <span className="hidden sm:block truncate">{displayName}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-700 z-20 animate-in slide-in-from-top-2 duration-200">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-oga-yellow text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {emailAddress?.charAt(0).toUpperCase() || 
                   (walletAddress ? walletAddress.slice(2, 4).toUpperCase() : '??')}
                </div>
                <div className="min-w-0 flex-1">
                  {emailAddress && (
                    <p className="text-sm font-medium text-white truncate">{emailAddress}</p>
                  )}
                  {walletAddress && (
                    <p className="text-xs text-gray-400 font-mono">{formatAddress(walletAddress)}</p>
                  )}
                  {userType && (
                    <p className="text-xs text-oga-yellow capitalize">{userType} User</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="py-2">
              {walletAddress && (
                <button
                  onClick={() => {
                    copyAddress(walletAddress);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Address
                </button>
              )}
              
              <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-700">
                Base Sepolia Network
              </div>
              
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
