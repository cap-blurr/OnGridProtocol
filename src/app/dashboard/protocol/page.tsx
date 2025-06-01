'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { usePrivy } from '@privy-io/react-auth';
import { useUserType } from '@/providers/userType';
import { useOnGridProtocol, useCarbonCreditExchange, useRewardDistributor, useCarbonCreditToken } from '@/hooks/contracts/useSmartContracts';
import {
  Zap,
  Leaf,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Database,
  Shield,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/hooks/contracts/useSmartContracts';

export default function ProtocolDashboard() {
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [isExchanging, setIsExchanging] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);
  
  const { authenticated, ready } = usePrivy();
  const { userType } = useUserType();
  
  // Smart contract hooks
  const protocol = useOnGridProtocol();
  const carbonExchange = useCarbonCreditExchange();
  const rewardDistributor = useRewardDistributor();
  const carbonToken = useCarbonCreditToken();

  const handleExchangeCredits = async () => {
    if (!exchangeAmount || !carbonExchange.exchangeCreditsForUSDC) return;
    
    setIsExchanging(true);
    try {
      // Convert exchangeAmount to bigint for the contract call
      const exchangeAmountBigInt = parseUnits(exchangeAmount, 3); // OGCC has 3 decimals
      
      // First approve the exchange contract to spend tokens
      if (carbonToken.approve) {
        await carbonToken.approve(CONTRACT_ADDRESSES.CARBON_CREDIT_EXCHANGE as `0x${string}`, exchangeAmountBigInt);
      }
      
      // Then exchange credits for USDC
      await carbonExchange.exchangeCreditsForUSDC(exchangeAmountBigInt);
      
      setExchangeSuccess(true);
      setExchangeAmount('');
      
      setTimeout(() => {
        setExchangeSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Exchange failed:', error);
    } finally {
      setIsExchanging(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!rewardDistributor.claimRewards) return;
    
    try {
      await rewardDistributor.claimRewards();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
        <p className="text-gray-400">Please connect your wallet to access the OnGrid Protocol dashboard</p>
      </div>
    );
  }

  const exchangePreview = carbonExchange.calculateExchangePreview(exchangeAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">OnGrid Protocol Dashboard</h1>
        <p className="text-zinc-400">
          Monitor protocol metrics, manage carbon credits, and claim rewards
        </p>
      </div>

      {/* Protocol Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total OGCC Supply
            </CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {parseFloat(carbonToken.totalSupply).toLocaleString()}
            </div>
            <p className="text-xs text-green-400">
              {carbonToken.symbol} tokens
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Exchange Rate
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${carbonExchange.exchangeRate}
            </div>
            <p className="text-xs text-blue-400">
              USDC per OGCC
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Credits Exchanged
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {parseFloat(carbonExchange.totalCreditsExchanged).toLocaleString()}
            </div>
            <p className="text-xs text-emerald-400">
              OGCC tokens
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Protocol Status
            </CardTitle>
            <Activity className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {!protocol.energyDataBridge.paused && !protocol.carbonCreditExchange.paused ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-400 font-semibold">Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-yellow-400 font-semibold">Paused</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400">
              System operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="credits" className="data-[state=active]:bg-emerald-600">
            Carbon Credits
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-emerald-600">
            Rewards
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-emerald-600">
            Energy Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Protocol Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Protocol Metrics</CardTitle>
                <CardDescription className="text-gray-400">
                  Key performance indicators for the OnGrid Protocol
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Total USDC Collected</p>
                    <p className="text-lg font-semibold text-white">
                      ${parseFloat(carbonExchange.totalUsdcCollected).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Protocol Fees</p>
                    <p className="text-lg font-semibold text-white">
                      ${parseFloat(carbonExchange.totalProtocolFees).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Rewards Funded</p>
                    <p className="text-lg font-semibold text-white">
                      ${parseFloat(carbonExchange.totalRewardsFunded).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Fee Percentage</p>
                    <p className="text-lg font-semibold text-white">
                      {carbonExchange.protocolFeePercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Holdings</CardTitle>
                <CardDescription className="text-gray-400">
                  Your current carbon credit balance and rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">OGCC Balance</p>
                    <p className="text-lg font-semibold text-green-400">
                      {parseFloat(carbonToken.userBalance).toLocaleString()} OGCC
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Claimable Rewards</p>
                    <p className="text-lg font-semibold text-blue-400">
                      ${parseFloat(rewardDistributor.claimableRewards).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contribution Score</p>
                    <p className="text-lg font-semibold text-white">
                      {rewardDistributor.contributionScore.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Estimated Value</p>
                    <p className="text-lg font-semibold text-emerald-400">
                      ${(parseFloat(carbonToken.userBalance) * parseFloat(carbonExchange.exchangeRate)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Exchange Credits
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Exchange OGCC for USDC</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Convert your carbon credits to USDC
                      </DialogDescription>
                    </DialogHeader>
                    
                    {exchangeSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Exchange Successful!</h3>
                        <p className="text-gray-400">Your OGCC has been exchanged for USDC.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            OGCC Amount
                          </label>
                          <Input
                            type="number"
                            placeholder="Enter OGCC amount"
                            value={exchangeAmount}
                            onChange={(e) => setExchangeAmount(e.target.value)}
                            className="bg-gray-800 border-gray-600 text-white"
                            max={carbonToken.userBalance}
                          />
                        </div>
                        
                        {exchangeAmount && (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Exchange Preview</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">OGCC Amount:</span>
                                <span className="text-white">{exchangeAmount} OGCC</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Gross USDC:</span>
                                <span className="text-white">${exchangePreview.usdcReceived}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Protocol Fee:</span>
                                <span className="text-red-400">-${exchangePreview.protocolFee}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span className="text-gray-400">Net USDC:</span>
                                <span className="text-emerald-400">${exchangePreview.netAmount}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          onClick={handleExchangeCredits}
                          disabled={!exchangeAmount || parseFloat(exchangeAmount) > parseFloat(carbonToken.userBalance) || isExchanging}
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          {isExchanging ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing Exchange...
                            </>
                          ) : (
                            'Confirm Exchange'
                          )}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleClaimRewards}
                  disabled={parseFloat(rewardDistributor.claimableRewards) === 0 || rewardDistributor.isClaimingRewards}
                  variant="outline" 
                  className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                >
                  {rewardDistributor.isClaimingRewards ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Award className="w-4 h-4 mr-2" />
                  )}
                  Claim Rewards
                </Button>

                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Carbon Credit Token (OGCC)</CardTitle>
                <CardDescription className="text-gray-400">
                  Information about the OnGrid Carbon Credit token
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Token Name</p>
                    <p className="text-white font-semibold">{carbonToken.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Symbol</p>
                    <p className="text-white font-semibold">{carbonToken.symbol}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Decimals</p>
                    <p className="text-white font-semibold">{carbonToken.decimals}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Supply</p>
                    <p className="text-white font-semibold">{parseFloat(carbonToken.totalSupply).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Your Balance</span>
                    <span className="text-green-400 font-semibold">{parseFloat(carbonToken.userBalance).toLocaleString()} OGCC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Treasury Balance</span>
                    <span className="text-white font-semibold">{parseFloat(carbonToken.treasuryBalance).toLocaleString()} OGCC</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Exchange Statistics</CardTitle>
                <CardDescription className="text-gray-400">
                  Carbon credit exchange performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Exchange Enabled</span>
                    <Badge className={carbonExchange.exchangeEnabled ? 'bg-green-500' : 'bg-red-500'}>
                      {carbonExchange.exchangeEnabled ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Rate</span>
                    <span className="text-white font-semibold">${carbonExchange.exchangeRate} USDC/OGCC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Protocol Fee</span>
                    <span className="text-white font-semibold">{carbonExchange.protocolFeePercentage.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reward Distribution</span>
                    <span className="text-white font-semibold">{carbonExchange.rewardDistributorPercentage.toFixed(2)}%</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="font-semibold text-white mb-2">Volume Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Credits Exchanged</span>
                      <span className="text-white">{parseFloat(carbonExchange.totalCreditsExchanged).toLocaleString()} OGCC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total USDC Collected</span>
                      <span className="text-white">${parseFloat(carbonExchange.totalUsdcCollected).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Reward System</CardTitle>
                <CardDescription className="text-gray-400">
                  Information about the OnGrid reward distribution system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Current Reward Rate</p>
                    <p className="text-white font-semibold">{parseFloat(rewardDistributor.currentRewardRate).toFixed(6)} USDC</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Contribution Score</p>
                    <p className="text-white font-semibold">{rewardDistributor.totalContributionScore.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">System Status</p>
                    <Badge className={!rewardDistributor.paused ? 'bg-green-500' : 'bg-red-500'}>
                      {!rewardDistributor.paused ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400">Reward Token</p>
                    <p className="text-white font-semibold">USDC</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Rewards</CardTitle>
                <CardDescription className="text-gray-400">
                  Your contribution and claimable rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-blue-900/20 rounded-lg">
                  <Award className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Claimable Rewards</h3>
                  <p className="text-blue-400 text-3xl font-bold">${parseFloat(rewardDistributor.claimableRewards).toFixed(2)}</p>
                  <p className="text-gray-400 text-sm mt-2">USDC available to claim</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Your Contribution Score</p>
                    <p className="text-white font-semibold">{rewardDistributor.contributionScore.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Share of Total</p>
                    <p className="text-white font-semibold">
                      {rewardDistributor.totalContributionScore > 0 
                        ? ((rewardDistributor.contributionScore / rewardDistributor.totalContributionScore) * 100).toFixed(4)
                        : '0'
                      }%
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleClaimRewards}
                  disabled={parseFloat(rewardDistributor.claimableRewards) === 0 || rewardDistributor.isClaimingRewards}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {rewardDistributor.isClaimingRewards ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Claiming Rewards...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Claim ${parseFloat(rewardDistributor.claimableRewards).toFixed(2)} USDC
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Energy Data Bridge</CardTitle>
              <CardDescription className="text-gray-400">
                Information about the energy data submission and validation system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <Database className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Emission Factor</h3>
                  <p className="text-emerald-400 text-lg font-bold">{protocol.energyDataBridge.emissionFactor.toFixed(6)}</p>
                  <p className="text-gray-400 text-xs">kg CO2/kWh</p>
                </div>
                
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Consensus Nodes</h3>
                  <p className="text-blue-400 text-lg font-bold">{protocol.energyDataBridge.requiredConsensusNodes}</p>
                  <p className="text-gray-400 text-xs">Required for validation</p>
                </div>
                
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Processing Delay</h3>
                  <p className="text-yellow-400 text-lg font-bold">{protocol.energyDataBridge.batchProcessingDelay}</p>
                  <p className="text-gray-400 text-xs">Seconds</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${!protocol.energyDataBridge.paused ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-white font-semibold">
                    Bridge Status: {!protocol.energyDataBridge.paused ? 'Active' : 'Paused'}
                  </span>
                </div>
                <Badge className={!protocol.energyDataBridge.paused ? 'bg-green-500' : 'bg-red-500'}>
                  {!protocol.energyDataBridge.paused ? 'Operational' : 'Maintenance'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 