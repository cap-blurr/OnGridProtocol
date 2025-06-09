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
  // Handle authentication state changes and user type modal
  useEffect(() => {
    if (!mounted || !ready || isStorageLoading) return;

    console.log('🔍 Auth effect running:', {
      authenticated,
      hasCheckedAuth,
      userTypeValue,
      showModal,
      isStorageLoading,
      ready
    });

    const handleAuth = async () => {
      // If user just authenticated and we haven't checked their auth state yet
      if (authenticated && !hasCheckedAuth) {
        setHasCheckedAuth(true);
        
        try {
          const savedType = localStorage.getItem('userType') as UserType;
          console.log('🎯 Auth check - savedType:', savedType);
          
          if (!savedType) {
            if (!showModal) {
              console.log('🎭 No saved type, showing modal');
              setShowModal(true);
            }
          } else {
            console.log('✅ Found saved type, setting and navigating:', savedType);
            setUserTypeValue(savedType);
            // Use a promise chain instead of await
            new Promise(resolve => setTimeout(resolve, 100))
              .then(() => {
                const path = savedType === 'developer' ? '/developer-dashboard' : '/dashboard';
                console.log('🚀 Navigating to:', path);
                router.replace(path);
              });
          }
        } catch (error) {
          console.error("Error checking user type:", error);
        } finally {
          setIsNavigating(false);
        }
      }
    };

    handleAuth();    // Handle disconnection
    if (!authenticated && hasCheckedAuth) {
      const cleanup = () => {
        try {
          console.log('🧹 Cleaning up - user disconnected');
          // Reset all state
          setHasCheckedAuth(false);
          setUserTypeValue(null);
          setShowModal(false);
          setIsNavigating(false);
          localStorage.removeItem('userType');
          
          // Redirect to home page
          router.replace('/');
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      };
      
      cleanup();
    }

    // Cleanup function for unmounting
    return () => {
      if (isNavigating) {
        setIsNavigating(false);
      }
    };
  }, [authenticated, ready, mounted, hasCheckedAuth, isStorageLoading, router, isNavigating]);
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


