import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useRewardDistributor() {
  const { address } = useAccount();
  const [rewardData, setRewardData] = useState({
    currentRewardRate: '0.000001',
    totalContributionScore: 1000000,
    contributionScore: 0,
    claimableRewards: '0',
    paused: false,
    isClaimingRewards: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const fetchRewardData = async () => {
      try {
        // Mock data for now - replace with actual contract calls
        setRewardData({
          currentRewardRate: '0.000025',
          totalContributionScore: 2500000,
          contributionScore: 1250,
          claimableRewards: '125.50',
          paused: false,
          isClaimingRewards: false,
        });
      } catch (error) {
        console.error('Error fetching reward data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewardData();
  }, [address]);

  const claimRewards = async () => {
    if (!address) return;

    setRewardData(prev => ({ ...prev, isClaimingRewards: true }));
    
    try {
      // This would call the actual contract
      console.log('Claiming rewards...');
      
      // Simulate successful claim
      setRewardData(prev => ({ 
        ...prev, 
        claimableRewards: '0',
        isClaimingRewards: false 
      }));
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setRewardData(prev => ({ ...prev, isClaimingRewards: false }));
    }
  };

  return {
    ...rewardData,
    claimRewards,
    isLoading,
  };
} 