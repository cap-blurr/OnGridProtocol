import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect, 
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance, 
} from '@coinbase/onchainkit/identity';

// Component example - move to a separate file for actual use
const WalletComponentExample = () => (
  <Wallet>
    <ConnectWallet>
      <div id="connect-wallet-btn" className="flex items-center gap-2">
        <Avatar className="h-6 w-6" />
        <Name />
      </div>
    </ConnectWallet>
    <WalletDropdown>
      <Identity
        className="px-4 pt-3 pb-2"
        hasCopyAddressOnClick
      >
        <Avatar />
        <Name />
        <Address />
        <EthBalance />
      </Identity>
      <div className="px-4 py-2 text-sm text-gray-600">Base Network</div>
      <a 
        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
        href="https://keys.coinbase.com"
      >
        Wallet
      </a>           
      <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
        Fund
      </div>
      <WalletDropdownDisconnect />
    </WalletDropdown>
  </Wallet>
);

export default WalletComponentExample;