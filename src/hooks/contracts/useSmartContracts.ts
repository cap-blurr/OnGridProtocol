import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';

// Contract ABIs (these would be imported from actual ABI files)
const ENERGY_DATA_BRIDGE_ABI = [
  {
    "inputs": [],
    "name": "emissionFactor",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requiredConsensusNodes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "batchProcessingDelay",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "batchHash", "type": "bytes32"}],
    "name": "batchSubmissionTimes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "batchHash", "type": "bytes32"}],
    "name": "processedBatchHashes",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "batchHash", "type": "bytes32"},
      {"internalType": "string", "name": "reason", "type": "string"}
    ],
    "name": "challengeBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const REWARD_DISTRIBUTOR_ABI = [
  {
    "inputs": [],
    "name": "currentRewardRate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalContributionScore",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "operator", "type": "address"}],
    "name": "claimableRewards",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "operator", "type": "address"}],
    "name": "nodeInfo",
    "outputs": [{"internalType": "uint256", "name": "contributionScore", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const CARBON_CREDIT_TOKEN_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolTreasury",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const CARBON_CREDIT_EXCHANGE_ABI = [
  {
    "inputs": [],
    "name": "exchangeRate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolFeePercentage",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardDistributorPercentage",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdcToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exchangeEnabled",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalCreditsExchanged",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalUsdcCollected",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalProtocolFees",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRewardsFunded",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "exchangeCreditsForUSDC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract addresses (these would come from environment variables or config)
export const CONTRACT_ADDRESSES = {
  ENERGY_DATA_BRIDGE: '0x1234567890123456789012345678901234567890' as `0x${string}`,
  REWARD_DISTRIBUTOR: '0x2345678901234567890123456789012345678901' as `0x${string}`,
  CARBON_CREDIT_TOKEN: '0x3456789012345678901234567890123456789012' as `0x${string}`,
  CARBON_CREDIT_EXCHANGE: '0x4567890123456789012345678901234567890123' as `0x${string}`,
};

// Constants
const REWARD_PRECISION = 1e18;
const OGCC_DECIMALS = 3;
const USDC_DECIMALS = 6;

// Hook for Energy Data Bridge
export function useEnergyDataBridge() {
  const { address } = useAccount();

  // Read contract data
  const { data: emissionFactor } = useReadContract({
    address: CONTRACT_ADDRESSES.ENERGY_DATA_BRIDGE,
    abi: ENERGY_DATA_BRIDGE_ABI,
    functionName: 'emissionFactor',
  });

  const { data: requiredConsensusNodes } = useReadContract({
    address: CONTRACT_ADDRESSES.ENERGY_DATA_BRIDGE,
    abi: ENERGY_DATA_BRIDGE_ABI,
    functionName: 'requiredConsensusNodes',
  });

  const { data: batchProcessingDelay } = useReadContract({
    address: CONTRACT_ADDRESSES.ENERGY_DATA_BRIDGE,
    abi: ENERGY_DATA_BRIDGE_ABI,
    functionName: 'batchProcessingDelay',
  });

  const { data: paused } = useReadContract({
    address: CONTRACT_ADDRESSES.ENERGY_DATA_BRIDGE,
    abi: ENERGY_DATA_BRIDGE_ABI,
    functionName: 'paused',
  });

  // Write functions
  const { writeContract: challengeBatch, isPending: isChallengingBatch } = useWriteContract();

  return {
    // Read data
    emissionFactor: emissionFactor ? Number(emissionFactor) / 1e6 : 0, // Format considering 1e6 scaling
    requiredConsensusNodes: requiredConsensusNodes ? Number(requiredConsensusNodes) : 0,
    batchProcessingDelay: batchProcessingDelay ? Number(batchProcessingDelay) : 0,
    paused: paused || false,
    
    // Write functions
    challengeBatch: (batchHash: `0x${string}`, reason: string) => 
      challengeBatch({
        address: CONTRACT_ADDRESSES.ENERGY_DATA_BRIDGE,
        abi: ENERGY_DATA_BRIDGE_ABI,
        functionName: 'challengeBatch',
        args: [batchHash, reason],
      }),
    isChallengingBatch,
  };
}

// Hook for Reward Distributor
export function useRewardDistributor() {
  const { address } = useAccount();

  // Read contract data
  const { data: currentRewardRate } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR,
    abi: REWARD_DISTRIBUTOR_ABI,
    functionName: 'currentRewardRate',
  });

  const { data: totalContributionScore } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR,
    abi: REWARD_DISTRIBUTOR_ABI,
    functionName: 'totalContributionScore',
  });

  const { data: rewardToken } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR,
    abi: REWARD_DISTRIBUTOR_ABI,
    functionName: 'rewardToken',
  });

  const { data: paused } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR,
    abi: REWARD_DISTRIBUTOR_ABI,
    functionName: 'paused',
  });

  const { data: claimableRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR,
    abi: REWARD_DISTRIBUTOR_ABI,
    functionName: 'claimableRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: nodeInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR,
    abi: REWARD_DISTRIBUTOR_ABI,
    functionName: 'nodeInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Write functions
  const { writeContract: claimRewards, isPending: isClaimingRewards } = useWriteContract();

  return {
    // Read data
    currentRewardRate: currentRewardRate && typeof currentRewardRate === 'bigint' ? formatUnits(currentRewardRate, 18) : '0',
    totalContributionScore: totalContributionScore && typeof totalContributionScore === 'bigint' ? Number(totalContributionScore) : 0,
    rewardToken: rewardToken as string,
    paused: paused || false,
    claimableRewards: claimableRewards && typeof claimableRewards === 'bigint' ? formatUnits(claimableRewards, USDC_DECIMALS) : '0',
    contributionScore: nodeInfo && typeof nodeInfo === 'bigint' ? Number(nodeInfo) : 0,
    
    // Write functions
    claimRewards: () => 
      claimRewards({
        address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR,
        abi: REWARD_DISTRIBUTOR_ABI,
        functionName: 'claimRewards',
      }),
    isClaimingRewards,
  };
}

// Hook for Carbon Credit Token (OGCC)
export function useCarbonCreditToken() {
  const { address } = useAccount();

  // Read contract data
  const { data: name } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_TOKEN,
    abi: CARBON_CREDIT_TOKEN_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_TOKEN,
    abi: CARBON_CREDIT_TOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: decimals } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_TOKEN,
    abi: CARBON_CREDIT_TOKEN_ABI,
    functionName: 'decimals',
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_TOKEN,
    abi: CARBON_CREDIT_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const { data: protocolTreasury } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_TOKEN,
    abi: CARBON_CREDIT_TOKEN_ABI,
    functionName: 'protocolTreasury',
  });

  const { data: userBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_TOKEN,
    abi: CARBON_CREDIT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: treasuryBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_TOKEN,
    abi: CARBON_CREDIT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: protocolTreasury ? [protocolTreasury] : undefined,
    query: {
      enabled: !!protocolTreasury,
    },
  });

  // Write functions
  const { writeContract: approve, isPending: isApproving } = useWriteContract();

  return {
    // Read data
    name: name as string,
    symbol: symbol as string,
    decimals: decimals && typeof decimals === 'number' ? Number(decimals) : OGCC_DECIMALS,
    totalSupply: totalSupply && typeof totalSupply === 'bigint' ? formatUnits(totalSupply, OGCC_DECIMALS) : '0',
    protocolTreasury: protocolTreasury as string,
    userBalance: userBalance && typeof userBalance === 'bigint' ? formatUnits(userBalance, OGCC_DECIMALS) : '0',
    treasuryBalance: treasuryBalance && typeof treasuryBalance === 'bigint' ? formatUnits(treasuryBalance, OGCC_DECIMALS) : '0',
    
    // Write functions
    approve: (spender: `0x${string}`, amount: bigint) => 
      approve({
        address: CONTRACT_ADDRESSES.CARBON_CREDIT_TOKEN,
        abi: CARBON_CREDIT_TOKEN_ABI,
        functionName: 'approve',
        args: [spender, amount],
      }),
    isApproving,
  };
}

// Hook for Carbon Credit Exchange
export function useCarbonCreditExchange() {
  const { address } = useAccount();

  // Read contract data
  const { data: exchangeRate } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'exchangeRate',
  });

  const { data: protocolFeePercentage } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'protocolFeePercentage',
  });

  const { data: rewardDistributorPercentage } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'rewardDistributorPercentage',
  });

  const { data: usdcToken } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'usdcToken',
  });

  const { data: exchangeEnabled } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'exchangeEnabled',
  });

  const { data: paused } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'paused',
  });

  const { data: totalCreditsExchanged } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'totalCreditsExchanged',
  });

  const { data: totalUsdcCollected } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'totalUsdcCollected',
  });

  const { data: totalProtocolFees } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'totalProtocolFees',
  });

  const { data: totalRewardsFunded } = useReadContract({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    functionName: 'totalRewardsFunded',
  });

  // Write functions
  const { writeContract: exchangeCreditsForUSDC, isPending: isExchanging } = useWriteContract();

  // Helper function to calculate exchange preview
  const calculateExchangePreview = (creditAmount: string) => {
    if (!exchangeRate || !protocolFeePercentage || !creditAmount) {
      return { usdcReceived: '0', protocolFee: '0', netAmount: '0' };
    }

    const credits = parseFloat(creditAmount);
    const rate = Number(exchangeRate);
    const feePercentage = Number(protocolFeePercentage) / 1_000_000; // Convert from basis points

    const grossUSDC = credits * rate;
    const protocolFee = grossUSDC * feePercentage;
    const netAmount = grossUSDC - protocolFee;

    return {
      usdcReceived: grossUSDC.toFixed(6),
      protocolFee: protocolFee.toFixed(6),
      netAmount: netAmount.toFixed(6),
    };
  };

  return {
    // Read data
    exchangeRate: exchangeRate && typeof exchangeRate === 'bigint' ? formatUnits(exchangeRate, USDC_DECIMALS) : '0',
    protocolFeePercentage: protocolFeePercentage && typeof protocolFeePercentage === 'bigint' ? (Number(protocolFeePercentage) / 1_000_000 * 100) : 0,
    rewardDistributorPercentage: rewardDistributorPercentage && typeof rewardDistributorPercentage === 'bigint' ? (Number(rewardDistributorPercentage) / 1_000_000 * 100) : 0,
    usdcToken: usdcToken as string,
    exchangeEnabled: exchangeEnabled || false,
    paused: paused || false,
    totalCreditsExchanged: totalCreditsExchanged && typeof totalCreditsExchanged === 'bigint' ? formatUnits(totalCreditsExchanged, OGCC_DECIMALS) : '0',
    totalUsdcCollected: totalUsdcCollected && typeof totalUsdcCollected === 'bigint' ? formatUnits(totalUsdcCollected, USDC_DECIMALS) : '0',
    totalProtocolFees: totalProtocolFees && typeof totalProtocolFees === 'bigint' ? formatUnits(totalProtocolFees, USDC_DECIMALS) : '0',
    totalRewardsFunded: totalRewardsFunded && typeof totalRewardsFunded === 'bigint' ? formatUnits(totalRewardsFunded, USDC_DECIMALS) : '0',
    
    // Write functions
    exchangeCreditsForUSDC: (amount: bigint) => 
      exchangeCreditsForUSDC({
        address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
        abi: CARBON_CREDIT_EXCHANGE_ABI,
        functionName: 'exchangeCreditsForUSDC',
        args: [amount],
      }),
    isExchanging,
    
    // Helper functions
    calculateExchangePreview,
  };
}

// Combined hook for system overview
export function useOnGridProtocol() {
  const energyDataBridge = useEnergyDataBridge();
  const rewardDistributor = useRewardDistributor();
  const carbonCreditToken = useCarbonCreditToken();
  const carbonCreditExchange = useCarbonCreditExchange();

  return {
    energyDataBridge,
    rewardDistributor,
    carbonCreditToken,
    carbonCreditExchange,
  };
}

// Event listening hook
export function useOnGridEvents() {
  const [events, setEvents] = useState<any[]>([]);

  // Listen to EnergyDataSubmitted events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.ENERGY_DATA_BRIDGE,
    abi: ENERGY_DATA_BRIDGE_ABI,
    eventName: 'EnergyDataSubmitted',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: 'EnergyDataSubmitted',
        data: log,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 100)); // Keep last 100 events
    },
  });

  // Listen to RewardsClaimed events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR,
    abi: REWARD_DISTRIBUTOR_ABI,
    eventName: 'RewardsClaimed',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: 'RewardsClaimed',
        data: log,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 100));
    },
  });

  // Listen to CreditsExchanged events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE,
    abi: CARBON_CREDIT_EXCHANGE_ABI,
    eventName: 'CreditsExchanged',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: 'CreditsExchanged',
        data: log,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 100));
    },
  });

  return { events };
} 