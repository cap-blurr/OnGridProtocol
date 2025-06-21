export type NetworkAddresses = {
  usdc: `0x${string}`;
  carbonCreditToken: `0x${string}` | undefined;
  carbonCreditExchange: `0x${string}` | undefined;
  developerRegistry: `0x${string}`;
  rewardDistributor: `0x${string}`;
  energyDataBridge: `0x${string}`;
  developerRegistryProxy: `0x${string}`;
  projectFactoryProxy: `0x${string}`;
  repaymentRouter: `0x${string}`;
  feeRouterProxy: `0x${string}`;
  liquidityPoolManagerProxy: `0x${string}`;
  developerDepositEscrow: `0x${string}`;
  devEscrowImpl: `0x${string}`;
  directProjectVaultImpl: `0x${string}`;
  riskRateOracleAdapterProxy: `0x${string}`;
  pausableGovernor: `0x${string}`;
};

// Updated with correct deployed contract addresses from Base Sepolia
export const CONTRACT_ADDRESSES: Record<number, NetworkAddresses> = {
  // Base Sepolia (testnet)
  84532: {
    // MockUSDC contract address for testnet (provided by contract developer)
    usdc: "0x145aA83e713BBc200aB08172BE9e347442a6c33E", // MockUSDC on Base Sepolia
    // These should be updated with actual deployed addresses when available
    carbonCreditToken: undefined, // Update when deployed
    carbonCreditExchange: undefined, // Update when deployed
    // Legacy placeholder - update with actual when available
    developerRegistry: "0x8C7b1B4423B396016c6ec3c872eC7ab7Ce1Cf67B", // Using proxy address
    rewardDistributor: "0x8C7b1B4423B396016c6ec3c872eC7ab7Ce1Cf67B", // Update with actual
    energyDataBridge: "0x8C7b1B4423B396016c6ec3c872eC7ab7Ce1Cf67B", // Update with actual
    // Correct deployed addresses from integration guide
    developerRegistryProxy: "0x8C7b1B4423B396016c6ec3c872eC7ab7Ce1Cf67B",
    developerDepositEscrow: "0xA1A2e73903d084623C93f9d0c3fC19093921F169",
    devEscrowImpl: "0x4835Df28C725Cb98961b97677de813E5E434c856",
    directProjectVaultImpl: "0xC43E475c36f8C8AFb87280A76ba9B0456B53dd7B",
    feeRouterProxy: "0xf5d976Ab4aFe651849C0b28A777176ea4200EB95",
    repaymentRouter: "0xa2c78a53bc6D9Be0769E4eE5eb7dAF93c7F27F6b",
    riskRateOracleAdapterProxy: "0xE4F5Cd8eF3C73BCcfD725Bc9290b27dFD4877D41",
    liquidityPoolManagerProxy: "0x1D025E099503356491702CAdD32Cd7dFe1B74425",
    projectFactoryProxy: "0xdE3c3bAD342CDD661F50698Be8459083d166AEC2",
    pausableGovernor: "0xfb00757cd8Ade9ccdCFDb9C64b11eEfE0f6b1812",
  },
};

// Helper to get addresses for current chain
export function getAddresses(chainId: number): NetworkAddresses {
  const addresses = CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}. Please connect to a supported network.`);
  }
  return addresses;
}

// Helper to get a specific contract address
export function getContractAddress(chainId: number, contractName: keyof NetworkAddresses): `0x${string}` {
  const addresses = getAddresses(chainId);
  const address = addresses[contractName];
  if (!address) {
    throw new Error(`Contract address for ${contractName} not found on chain ${chainId}`);
  }
  return address;
}
