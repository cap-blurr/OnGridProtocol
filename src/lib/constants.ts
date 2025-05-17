// Global constants, potentially sourced from smart contracts or system configuration

// From OnGrid Finance Constants.sol (or similar)
// The share of the loan amount requested that the developer must deposit.
// YOU MUST VERIFY THIS VALUE AGAINST YOUR ProjectFactory.sol or DeveloperDepositEscrow.sol
// This value is what those contracts will expect for the deposit.
export const DEVELOPER_DEPOSIT_BPS = 2000; // Example: 2000 BPS = 20%. VERIFY THIS!!

// Denominator for basis points calculations.
export const BASIS_POINTS_DENOMINATOR = 10000;

// Add other constants as needed, for example:
// export const USDC_DECIMALS = 6;
// export const IPFS_GATEWAY_PREFIX = "https://ipfs.io/ipfs/"; 