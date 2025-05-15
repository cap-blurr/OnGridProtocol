// Contract addresses for different environments
export const CONTRACT_ADDRESSES = {
    // Replace with your actual deployed addresses
    testnet: {
      // TDeveloperRegistryProxy: 0xCb1ACe5a5CBdDDfA9Fcc2e3F5F0bC8417b0F0C28,
        
  DeveloperRegistryProxy: 0xE23e23461dFc75308E49F5Da1abf065a61B3Cc1E,
  DeveloperDepositEscrow: 0x29EC1CfaE65f11D75508e608C51D5AD698D46faf,
  DevEscrowImpl: 0x4e9d1884732eA582A617bA498C444a965394010a,
  DirectProjectVaultImpl: 0x4F46a85840d647D2e1D834bEF312D3C735194742,
  FeeRouterProxy: 0x461f6Ff6eab107c419123A7757b4Ab7eB65526d7,
  RepaymentRouter: 0xA293C08da3715d3c624f84Cf813Da3f023f2A9e9,
  RiskRateOracleAdapterProxy: 0xd941D58aD8aC8f070909C18f7D45Ffa1EDc84D47,
  LiquidityPoolManagerProxy: 0x177cA24a0Fb50363fcD82E609479e3D8e1dC3e90,
  ProjectFactoryProxy: 0x1FB3A0A69e79f3A0d43782C97d2cD11e3ea2eB4e,
  PausableGovernor: 0xfE7030B0C4d0026Cc43eD52d136a3486C51c8Fd1,

    }
  } as const;
  
  // Helper to get addresses based on current chain ID
  export function getAddresses(chainId: number) {
    // Map chain IDs to environment keys
    if ([1, 10, 42161].includes(chainId))
    return CONTRACT_ADDRESSES.testnet;
  }