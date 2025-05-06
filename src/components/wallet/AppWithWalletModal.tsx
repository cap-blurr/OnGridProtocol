'use client';

import { ReactNode } from 'react';
import AccountTypeModal from './AccountTypeModal';

interface AppWithWalletModalProps {
  children: ReactNode;
}

export function AppWithWalletModal({ children }: AppWithWalletModalProps) {
  return (
    <>
      {children}
      <AccountTypeModal />
    </>
  );
} 