declare module '@coinbase/onchainkit' {
  import { ReactNode } from 'react';
  
  export interface OnchainKitConfig {
    appearance?: {
      name?: string;
      mode?: 'light' | 'dark';
      theme?: 'light' | 'dark' | 'system';
      accentColor?: string;
    };
    wallet?: {
      display?: 'modal' | 'inline';
      termsUrl?: string;
      privacyUrl?: string;
    };
  }
  
  export interface OnchainKitProviderProps {
    children: ReactNode;
    apiKey?: string;
    chain?: import('viem').Chain; // More specific type for chain
    config?: OnchainKitConfig;
  }
  
  export function OnchainKitProvider(props: OnchainKitProviderProps): JSX.Element;
}

declare module '@coinbase/onchainkit/wallet' {
  import { ReactNode } from 'react';
  
  export interface ConnectWalletProps {
    children?: ReactNode;
  }
  
  export function ConnectWallet(props: ConnectWalletProps): JSX.Element;
  export function Wallet(props: { children: ReactNode }): JSX.Element;
  export function WalletDropdown(props: { children: ReactNode }): JSX.Element;
  export function WalletDropdownDisconnect(): JSX.Element;
}

declare module '@coinbase/onchainkit/identity' {
  import { ReactNode } from 'react';
  
  export interface IdentityProps {
    children?: ReactNode;
    className?: string;
    hasCopyAddressOnClick?: boolean;
  }
  
  export function Identity(props: IdentityProps): JSX.Element;
  export function Avatar(props?: { className?: string }): JSX.Element;
  export function Name(): JSX.Element;
  export function Address(props?: { className?: string }): JSX.Element;
  export function EthBalance(): JSX.Element;
}

declare module '@coinbase/onchainkit/theme' {
  export const color: Record<string, string>;
} 