'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy } from '@privy-io/react-auth';
import UserTypeModal from '@/components/ui/UserTypeModal';
import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast'; // Optional: if you want to add toast notifications for errors

export type UserType = 'normal' | 'developer' | null;

interface UserTypeContextProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isLoading: boolean;
  showUserTypeModal: boolean;
}

const UserTypeContext = createContext<UserTypeContextProps | undefined>(undefined);

export function UserTypeProvider({ children }: { children: ReactNode }) {
  const [userTypeValue, setUserTypeValue] = useState<UserType>(null);
  const [isStorageLoading, setIsStorageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();

  // Load user type from localStorage on mount
  useEffect(() => {
    const loadUserType = () => {
      try {
        const savedType = localStorage.getItem('userType') as UserType;
        console.log('🏁 Initial load - saved type:', savedType);
        if (savedType) {
          setUserTypeValue(savedType);
        }
      } catch (error) {
        console.error("Error loading user type from localStorage:", error);
      } finally {
        setIsStorageLoading(false);
      }
    };

    // Only load after component is ready
    if (ready) {
      loadUserType();
    }
  }, [ready]);

  // Test function for manual modal testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testUserTypeModal = () => {
        console.log('🧪 MANUAL TEST: Showing UserTypeModal');
        localStorage.removeItem('userType');
        setUserTypeValue(null);
        setShowModal(true);
      };
      
      (window as any).resetUserType = () => {
        console.log('🔄 RESET: Clearing all user type data');
        localStorage.removeItem('userType');
        setUserTypeValue(null);
        setShowModal(false);
        setHasCheckedAuth(false);
      };
    }
  }, []);

  // Handle authentication state changes and user type modal
  useEffect(() => {
    console.log('🔍 Auth State:', { ready, isStorageLoading, authenticated, hasCheckedAuth, userTypeValue });
    
    if (!ready || isStorageLoading) return;

    // If user just authenticated and we haven't checked their auth state yet
    if (authenticated && !hasCheckedAuth) {
      console.log('✅ User authenticated for first time - checking saved type...');
      setHasCheckedAuth(true);
      
      // Check if user has a saved user type
      const savedType = localStorage.getItem('userType') as UserType;
      console.log('💾 Saved user type found:', savedType);
      
      // If no saved type, show the modal IMMEDIATELY
      if (!savedType) {
        console.log('🎭 No saved type - showing modal IMMEDIATELY!');
        setShowModal(true);
        // No delay - show immediately for best UX
      } else {
        console.log('✅ Found saved type, using it:', savedType);
        setUserTypeValue(savedType);
        setIsNavigating(false);
      }
    }

    // If user disconnected, reset everything
    if (!authenticated && hasCheckedAuth) {
      console.log('❌ User disconnected - resetting everything');
      setHasCheckedAuth(false);
      setUserTypeValue(null);
      setShowModal(false);
      setIsNavigating(false);
      try {
        localStorage.removeItem('userType');
      } catch (error) {
        console.error("Error removing user type from localStorage:", error);
      }
    }
  }, [authenticated, ready, hasCheckedAuth, isStorageLoading]);

  // Function to handle user type selection with immediate navigation
  const handleUserTypeSelection = (type: UserType) => {
    console.log('🎯 User selected type:', type);
    updateUserType(type);
    setShowModal(false);
    
    // Navigate immediately for best UX
    if (type === 'developer') {
      console.log('🚀 Navigating to developer dashboard...');
      router.push('/developer-dashboard');
    } else {
      console.log('🚀 Navigating to standard dashboard...');
      router.push('/dashboard');
    }
  };

  // Function to update user type
  const updateUserType = (type: UserType) => {
    try {
      if (type) {
        localStorage.setItem('userType', type);
      } else {
        localStorage.removeItem('userType');
      }
      setUserTypeValue(type);
    } catch (error) {
      console.error("Error saving user type to localStorage:", error);
      // toast.error("Failed to save account type preference. Please try again."); // Optional
      // If localStorage fails, userTypeValue (React state) does NOT get updated to the new 'type'.
      // It will retain its value from the last successful set or load.
      // This means the UI will reflect the persisted state, not an optimistic unpersisted one.
    }
  };

  return (
    <UserTypeContext.Provider
      value={{
        userType: userTypeValue,
        setUserType: updateUserType,
        isLoading: isStorageLoading || !ready,
        showUserTypeModal: showModal,
      }}
    >
      {children}
      
      {/* User Type Selection Modal */}
      <UserTypeModal
        isOpen={showModal}
        onSelectUserType={handleUserTypeSelection}
      />
      
      {/* Debug Panel - TEMPORARY for testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/90 text-white p-3 text-xs rounded-lg z-[9999] font-mono border border-green-500">
          <div className="text-green-400 font-bold mb-2">🔍 UserType Debug</div>
          <div>Ready: <span className={ready ? 'text-green-400' : 'text-red-400'}>{String(ready)}</span></div>
          <div>Auth: <span className={authenticated ? 'text-green-400' : 'text-red-400'}>{String(authenticated)}</span></div>
          <div>UserType: <span className="text-yellow-400">{userTypeValue || 'null'}</span></div>
          <div>ShowModal: <span className={showModal ? 'text-green-400' : 'text-red-400'}>{String(showModal)}</span></div>
          <div>HasChecked: <span className={hasCheckedAuth ? 'text-green-400' : 'text-red-400'}>{String(hasCheckedAuth)}</span></div>
          <div className="mt-2 space-y-1">
            <button 
              onClick={() => (window as any).testUserTypeModal?.()}
              className="block w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
            >
              Test Modal
            </button>
            <button 
              onClick={() => (window as any).resetUserType?.()}
              className="block w-full px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </UserTypeContext.Provider>
  );
}

export function useUserType() {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error("useUserType must be used within a UserTypeProvider");
  }
  return context;
}