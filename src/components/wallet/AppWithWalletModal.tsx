'use client';

import { ReactNode } from 'react';

interface AppWithWalletModalProps {
  children: ReactNode;
}

export function AppWithWalletModal({ children }: AppWithWalletModalProps) {
  return (
    <>
      {children}
    </>
  );
} 