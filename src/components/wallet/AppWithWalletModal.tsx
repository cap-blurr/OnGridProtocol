'use client';

import { ReactNode } from 'react';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Avatar,
  Name,
  Address,
  EthBalance,
  Identity,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import AccountTypeModal from './AccountTypeModal';

interface AppWithWalletModalProps {
  children: ReactNode;
}

export function AppWithWalletModal({ children }: AppWithWalletModalProps) {
  return (
    <>
      {children}
      <div className="my-10 flex justify-center">
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className={color.foregroundMuted} />
              <EthBalance />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
      <AccountTypeModal />
    </>
  );
} 