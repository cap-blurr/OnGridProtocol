import { useAccount, useReadContract, useSimulateContract } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useUSDCBalance, useUSDCAllowance } from './useUSDC';
import { formatUnits, parseUnits } from 'viem';
import DeveloperRegistryABI from '@/contracts/abis/DeveloperRegistry.json';
import ProjectFactoryABI from '@/contracts/abis/ProjectFactory.json';
import MockUSDCABI from '@/contracts/abis/MockUSDC.json';

export function useContractDebugger() {
  const { address } = useAccount();
  const addresses = useContractAddresses();

  // Test 1: KYC Verification with detailed error handling
  const { 
    data: kycStatus, 
    isLoading: kycLoading, 
    error: kycError,
    status: kycStatus_enum 
  } = useReadContract({
    address: addresses.developerRegistryProxy as `0x${string}`,
    abi: DeveloperRegistryABI.abi,
    functionName: 'isVerified',
    args: address ? [address] : undefined,
    chainId: 84532,
    query: {
      enabled: !!address && !!addresses.developerRegistryProxy,
      retry: 1, // Only retry once
      retryDelay: 2000,
    },
  });

  // Test 2: USDC Balance
  const { balance: usdcBalance, formattedBalance, isLoading: balanceLoading, error: balanceError } = 
    useUSDCBalance(address);

  // Test 3: USDC Allowance for DepositEscrow
  const { allowance: usdcAllowance, formattedAllowance, isLoading: allowanceLoading, error: allowanceError } = 
    useUSDCAllowance(address, addresses.developerDepositEscrow as `0x${string}`);

  // Test 4: ProjectFactory accessibility
  const { data: projectCounter, isLoading: factoryLoading, error: factoryError } = useReadContract({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    functionName: 'projectCounter',
    chainId: 84532,
    query: {
      enabled: !!addresses.projectFactoryProxy,
    },
  });

  // Test 5: USDC Contract accessibility
  const { data: usdcName, isLoading: usdcLoading, error: usdcError } = useReadContract({
    address: addresses.usdc as `0x${string}`,
    abi: MockUSDCABI.abi,
    functionName: 'name',
    chainId: 84532,
    query: {
      enabled: !!addresses.usdc,
    },
  });

  // ENHANCED Test 6: ProjectFactory pause status
  const { data: isPaused, isLoading: pauseLoading, error: pauseError } = useReadContract({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    functionName: 'paused',
    chainId: 84532,
    query: {
      enabled: !!addresses.projectFactoryProxy,
    },
  });

  // ENHANCED Test 7: Simulate createProject to detect revert reason
  const testProjectParams = address ? {
    loanAmountRequested: parseUnits("200", 6), // 200 USDC
    requestedTenor: BigInt(365),
    fundingDeadline: BigInt(Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)), // 30 days from now
    metadataCID: "ipfs://QmTestCID12345"
  } : undefined;

  const { 
    data: simulateResult, 
    isLoading: simulateLoading, 
    error: simulateError 
  } = useSimulateContract({
    address: addresses.projectFactoryProxy as `0x${string}`,
    abi: ProjectFactoryABI.abi,
    functionName: 'createProject',
    args: testProjectParams ? [testProjectParams] : undefined,
    chainId: 84532,
    query: {
      enabled: !!address && !!addresses.projectFactoryProxy && !!testProjectParams && !!kycStatus,
    },
  });

  const runDebugReport = () => {
    console.log("🔍 ENHANCED CONTRACT DIAGNOSTICS");
    console.log("======================================");
    
    console.log("🌐 RPC Configuration:");
    console.log("  Using Alchemy only:", "https://base-sepolia.g.alchemy.com/v2/TjWdEzlbzj1Xr_Bj5K6Z2");
    console.log("  Chain ID: 84532 (Base Sepolia)");
    
    console.log("\n📋 Contract Test Results:");
    console.log(`  🔐 KYC Check: ${kycStatus_enum} | Data: ${kycStatus} | Error: ${kycError?.message || 'None'}`);
    console.log(`  💰 USDC Balance: ${formattedBalance} | Error: ${balanceError?.message || 'None'}`);
    console.log(`  🔓 Allowance: ${formattedAllowance} | Error: ${allowanceError?.message || 'None'}`);
    console.log(`  🏭 Project Counter: ${projectCounter} | Error: ${factoryError?.message || 'None'}`);
    console.log(`  ⏸️  Factory Paused: ${isPaused} | Error: ${pauseError?.message || 'None'}`);
    console.log(`  💻 USDC Contract: ${usdcName} | Error: ${usdcError?.message || 'None'}`);
    
    console.log("\n📍 Contract Addresses:");
    console.log(`  Registry: ${addresses.developerRegistryProxy}`);
    console.log(`  Factory: ${addresses.projectFactoryProxy}`);
    console.log(`  Escrow: ${addresses.developerDepositEscrow}`);
    console.log(`  USDC: ${addresses.usdc}`);
    
    console.log("\n🧪 Contract Simulation Test:");
    if (simulateError) {
      console.log(`  ❌ SIMULATION FAILED: ${simulateError.message}`);
      console.log("  📋 Full Simulation Error:", simulateError);
      
      // Parse specific revert reasons
      if (simulateError.message.includes('InsufficientBalance')) {
        console.log("  💡 CAUSE: Insufficient USDC balance for deposit");
      } else if (simulateError.message.includes('KYCNotVerified')) {
        console.log("  💡 CAUSE: Developer KYC not verified");
      } else if (simulateError.message.includes('InvalidAmount')) {
        console.log("  💡 CAUSE: Invalid loan amount");
      } else if (simulateError.message.includes('Pausable: paused')) {
        console.log("  💡 CAUSE: ProjectFactory contract is paused");
      } else if (simulateError.message.includes('InvalidDeadline')) {
        console.log("  💡 CAUSE: Invalid funding deadline");
      } else {
        console.log("  💡 CAUSE: Unknown contract validation failure");
      }
    } else if (simulateResult) {
      console.log("  ✅ SIMULATION SUCCESS: Contract call would succeed");
      console.log("  📊 Simulation Result:", simulateResult);
    } else if (simulateLoading) {
      console.log("  ⏳ SIMULATION IN PROGRESS...");
    } else {
      console.log("  ⚠️  SIMULATION NOT AVAILABLE (missing prerequisites)");
    }
    
    console.log("\n🔍 RPC Connection Test:");
    if (kycError?.message?.includes('403') || kycError?.message?.includes('sepolia.base.org')) {
      console.log("  ❌ DETECTED: App is still trying to use sepolia.base.org!");
      console.log("  🔧 ACTION: Need to eliminate all RPC fallbacks");
    } else if (kycStatus !== undefined) {
      console.log("  ✅ Contract reads working via Alchemy");
    } else {
      console.log("  ⚠️  Contract read status unclear");
    }
    
    console.log("======================================");
  };

  return {
    kycStatus,
    kycError,
    usdcBalance,
    balanceError,
    usdcAllowance,
    allowanceError,
    projectCounter,
    factoryError,
    usdcName,
    usdcError,
    isPaused,
    pauseError,
    simulateResult,
    simulateError,
    runDebugReport,
    isLoading: kycLoading || balanceLoading || allowanceLoading || factoryLoading || usdcLoading || pauseLoading || simulateLoading,
  };
} 