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
  usdcToken: `0x${string}`;
  constants: `0x${string}`;
  devEscrowImpl: `0x${string}`;
  directProjectVaultImpl: `0x${string}`;
  riskRateOracleAdapterProxy: `0x${string}`;
  pausableGovernor: `0x${string}`;
};

// NOTE: Replace these placeholder addresses with your actual deployed contract addresses
export const CONTRACT_ADDRESSES: Record<number, NetworkAddresses> = {
  // Base Sepolia (testnet)
  84532: {
    carbonCreditToken: "0xd3D95A6e2a2Ef88F92fb701A40EB358Be2c9be7d",
    rewardDistributor: "0x28e9A8c3da8a05E415cb253A7Faf9Ffe9e195124",
    energyDataBridge: "0x2dCfA53aEfE9F62D4fF13281e72ECE6203D7149A",
    carbonCreditExchange: "0x93b911e9955C4713249bD3e503690a47172CbC55",
    developerRegistry: "0xCb1ACe5a5CBdDDfA9Fcc2e3F5F0bC8417b0F0C28",
    developerRegistryProxy: "0xE23e23461dFc75308E49F5Da1abf065a61B3Cc1E",
    projectFactoryProxy: "0x1FB3A0A69e79f3A0d43782C97d2cD11e3ea2eB4e",
    repaymentRouter: "0xA293C08da3715d3c624f84Cf813Da3f023f2A9e9",
    feeRouterProxy: "0x461f6Ff6eab107c419123A7757b4Ab7eB65526d7",
    liquidityPoolManagerProxy: "0x177cA24a0Fb50363fcD82E609479e3D8e1dC3e90",
    developerDepositEscrow: "0x29EC1CfaE65f11D75508e608C51D5AD698D46faf",
    usdcToken: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    constants: "0xAE26fFB4B09593DdB8BAff280F360F3BCa22F192",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    devEscrowImpl: "0x4e9d1884732eA582A617bA498C444a965394010a",
    directProjectVaultImpl: "0x4F46a85840d647D2e1D834bEF312D3C735194742",
    riskRateOracleAdapterProxy: "0xd941D58aD8aC8f070909C18f7D45Ffa1EDc84D47",
    pausableGovernor: "0xfE7030B0C4d0026Cc43eD52d136a3486C51c8Fd1",
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
