export type NetworkAddresses = {
  usdc: `0x${string}`;
  carbonCreditToken: `0x${string}` | undefined;
  carbonCreditExchange: `0x${string}` | undefined;
  developerRegistry: `0x${string}`;
  rewardDistributor: `0x${string}`;
  energyDataBridge: `0x${string}`;
  developerRegistryProxy: string;
  projectFactoryProxy: string;
  repaymentRouter: string;
  feeRouterProxy: string;
  
  liquidityPoolManagerProxy: string;
  developerDepositEscrow: string;
  usdcToken: string;
  constants: string;
};

// NOTE: Replace these placeholder addresses with your actual deployed contract addresses
export const CONTRACT_ADDRESSES: Record<number, NetworkAddresses> = {
  // Base Sepolia (testnet)
  84532: {
    carbonCreditToken: "0xd3D95A6e2a2Ef88F92fb701A40EB358Be2c9be7d",
    rewardDistributor: "0x28e9A8c3da8a05E415cb253A7Faf9Ffe9e195124",
    energyDataBridge: "0x2dCfA53aEfE9F62D4fF13281e72ECE6203D7149A ",
    carbonCreditExchange: "0x93b911e9955C4713249bD3e503690a47172CbC55",
    developerRegistry: "0xCb1ACe5a5CBdDDfA9Fcc2e3F5F0bC8417b0F0C28",
    developerRegistryProxy: "0xCb1ACe5a5CBdDDfA9Fcc2e3F5F0bC8417b0F0C28",
    projectFactoryProxy: "0x047a20446BE6367f035bAcfdfC74B8Dd5048338E",
    repaymentRouter: "0x74d034BD4279e3E8E4c8DEac2D3009e50f452C9a",
    feeRouterProxy: "0x8aa6edc5D61554A9b0B9f0165e36fB1faf933187",
    liquidityPoolManagerProxy: "0xbe5efbC0ffA8EeFb1B84DE3E1032a09bbAD6F8F1",
    developerDepositEscrow: "0x5838fC56b28b636Bc02b377300ba228A7693423F",
    usdcToken: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    constants: "0xAE26fFB4B09593DdB8BAff280F360F3BCa22F192",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
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
