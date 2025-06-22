'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy } from '@privy-io/react-auth';
import UserTypeModal from '@/components/ui/UserTypeModal';
import { useRouter } from 'next/navigation';
import { type } from "os";
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
  const [mounted, setMounted] = useState(false);
  
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

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
  // Handle authentication state changes - split into separate effects
  useEffect(() => {
    if (!mounted || !ready || isStorageLoading) return;

    // Only handle authentication changes - avoid complex logic
    if (authenticated && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      
      const savedType = localStorage.getItem('userType') as UserType;
      
      if (!savedType) {
        setShowModal(true);
      } else {
        setUserTypeValue(savedType);
        // Only redirect from home page - don't interrupt dashboard navigation
        if (window.location.pathname === '/') {
          setTimeout(() => {
            const path = savedType === 'developer' ? '/developer-dashboard' : '/dashboard';
            router.replace(path);
          }, 100);
        }
      }
    }
  }, [authenticated, ready, mounted, hasCheckedAuth, isStorageLoading, router]);

  // Handle disconnection separately
  useEffect(() => {
    if (!authenticated && hasCheckedAuth) {
      setHasCheckedAuth(false);
      setUserTypeValue(null);
      setShowModal(false);
      setIsNavigating(false);
      localStorage.removeItem('userType');
      router.replace('/');
    }
  }, [authenticated, hasCheckedAuth, router]);
  const handleUserTypeSelection = (type: UserType) => {
    setIsNavigating(true);
    
    // Update type in state and storage
    updateUserType(type)
      .then(() => {
        setShowModal(false);
        // Add delay for state update
        return new Promise(resolve => setTimeout(resolve, 200));
      })
      .then(() => {
        // Navigate using replace
        const path = type === 'developer' ? '/developer-dashboard' : '/dashboard';
        return router.replace(path);
      })
      .catch((error) => {
        console.error("Error handling user type selection:", error);
        // Reset on critical error
        setUserTypeValue(null);
        localStorage.removeItem('userType');
      })
      .finally(() => {
        setIsNavigating(false);
      });
  };  // Function to update user type with proper state management
  const updateUserType = (type: UserType) => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Update state
        setUserTypeValue(type);
        
        // Persist to storage
        if (type) {
          localStorage.setItem('userType', type);
        } else {
          localStorage.removeItem('userType');
        }

        // Use requestAnimationFrame for state update confirmation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      } catch (error) {
        console.error("Error saving user type to localStorage:", error);
        reject(error);
      }
    });
  };

  const contextValue = {
    userType: userTypeValue,
    setUserType: updateUserType,
    isLoading: isStorageLoading || !ready,
    showUserTypeModal: showModal,
  };

  return (
    <UserTypeContext.Provider value={contextValue}>
      {children}
      
      {/* User Type Selection Modal */}
      <UserTypeModal
        isOpen={showModal}
        onSelectUserType={handleUserTypeSelection}
      />
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


