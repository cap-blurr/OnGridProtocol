import { useState, useEffect } from 'react';

export function useOnGridProtocol() {
  const [protocolData, setProtocolData] = useState({
    energyDataBridge: {
      emissionFactor: 0.5,
      requiredConsensusNodes: 3,
      batchProcessingDelay: 300,
      paused: false,
    },
    carbonCreditExchange: {
      paused: false,
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual contract calls
    const fetchProtocolData = async () => {
      try {
        // This would fetch from actual contracts
        setProtocolData({
          energyDataBridge: {
            emissionFactor: 0.000421,
            requiredConsensusNodes: 5,
            batchProcessingDelay: 300,
            paused: false,
          },
          carbonCreditExchange: {
            paused: false,
          },
        });
      } catch (error) {
        console.error('Error fetching protocol data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProtocolData();
  }, []);

  return {
    ...protocolData,
    isLoading,
  };
} 