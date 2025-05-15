import { useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { useContractAddresses } from './useDeveloperRegistry';
import { useEffect } from 'react';
import { parseUnits } from 'ethers';
import toast from 'react-hot-toast';
import { USDC_DECIMALS } from './useUSDC';

// RepaymentRouter ABI (minimal version for what we need)
const RepaymentRouterABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "processRepayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "payer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalAmountPaid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "netAmountToProject",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "feeAmount",
        "type": "uint256"
      }
    ],
    "name": "RepaymentProcessed",
    "type": "event"
  }
];

// Process repayment
export function useProcessRepayment() {
  const addresses = useContractAddresses();
  
  const { writeContract, data: hash, isPending, error } = useContractWrite();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Show toast notifications for transaction states
  useEffect(() => {
    if (isPending || isConfirming) {
      toast.loading(
        isPending ? 'Processing repayment...' : 'Confirming transaction...',
        { id: 'repaymentTx' }
      );
    } else if (isSuccess) {
      toast.success('Repayment processed successfully!', { id: 'repaymentTx' });
    } else if (error) {
      toast.error(`Error: ${error.message}`, { id: 'repaymentTx' });
    }
  }, [isPending, isConfirming, isSuccess, error]);
  
  return {
    processRepayment: (projectId: string, amount: string) => {
      try {
        const parsedAmount = parseUnits(amount, USDC_DECIMALS);
        writeContract({ 
            address: addresses.repaymentRouter as `0x${string}`,
            abi: RepaymentRouterABI,
            functionName: 'processRepayment',
            args: [BigInt(projectId), parsedAmount] 
        });
      } catch (err) {
        console.error('Error processing repayment:', err);
        toast.error('Invalid repayment data');
      }
    },
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash
  };
} 