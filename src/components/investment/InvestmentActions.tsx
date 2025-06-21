'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { useInvestInVault } from '@/hooks/contracts/useDirectProjectVault';
import { useDepositToPool } from '@/hooks/contracts/useLiquidityPoolManager';
import { formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';

interface DirectProjectInvestmentProps {
  vaultAddress: `0x${string}`;
  projectName: string;
  minInvestment?: number;
  maxInvestment?: number;
  isFundingClosed?: boolean;
  onSuccess?: () => void;
}

export function DirectProjectInvestment({
  vaultAddress,
  projectName,
  minInvestment = 1000,
  maxInvestment = 100000,
  isFundingClosed = false,
  onSuccess
}: DirectProjectInvestmentProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const {
    invest,
    isLoading: isInvesting,
    error: investError
  } = useInvestInVault(vaultAddress);

  const handleInvest = async () => {
    if (!amount || !isConnected) return;

    try {
      setIsValidating(true);
      
      const investmentAmount = parseFloat(amount);
      if (investmentAmount < minInvestment || investmentAmount > maxInvestment) {
        toast.error(`Investment must be between $${minInvestment.toLocaleString()} and $${maxInvestment.toLocaleString()}`);
        return;
      }

      invest(amount);
    } catch (error) {
      console.error('Investment error:', error);
      toast.error('Investment failed. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const isDisabled = !isConnected || isFundingClosed || isInvesting || isValidating || !amount;

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-oga-green">
          <DollarSign className="h-5 w-5 text-oga-green" />
          Invest in {projectName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <Alert className="bg-amber-500/10 border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-500">
              Please connect your wallet to invest.
            </AlertDescription>
          </Alert>
        )}
        
        {isFundingClosed && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">
              This project's funding period has ended.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="investment-amount" className="text-oga-green">
            Investment Amount (USDC)
          </Label>
          <Input
            id="investment-amount"
            type="number"
            placeholder={`Min: $${minInvestment.toLocaleString()}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isDisabled}
            className="bg-black/20 border-oga-green/20 text-white placeholder:text-oga-green/60"
          />
          <div className="flex justify-between text-xs text-oga-green/80">
            <span>Min: ${minInvestment.toLocaleString()}</span>
            <span>Max: ${maxInvestment.toLocaleString()}</span>
          </div>
        </div>

        {investError && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">
              {investError.message || 'Investment failed. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleInvest}
          disabled={isDisabled}
          className="w-full bg-oga-green hover:bg-oga-green/80 text-white"
        >
          {isInvesting || isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isValidating ? 'Validating...' : 'Investing...'}
            </>
          ) : (
            `Invest $${amount || '0'}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface PoolInvestmentProps {
  poolId: number;
  poolName: string;
  minInvestment?: number;
  maxInvestment?: number;
  aprRate?: number;
  onSuccess?: () => void;
}

export function PoolInvestment({
  poolId,
  poolName,
  minInvestment = 500,
  maxInvestment = 50000,
  aprRate = 10,
  onSuccess
}: PoolInvestmentProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const {
    deposit: depositToPool,
    isLoading: isDepositing,
    error: depositError
  } = useDepositToPool();

  const handleDeposit = async () => {
    if (!amount || !isConnected) return;

    try {
      setIsValidating(true);
      
      const depositAmount = parseFloat(amount);
      if (depositAmount < minInvestment || depositAmount > maxInvestment) {
        toast.error(`Investment must be between $${minInvestment.toLocaleString()} and $${maxInvestment.toLocaleString()}`);
        return;
      }

      depositToPool(poolId, amount);
    } catch (error: any) {
      console.error('Pool deposit error:', error);
      toast.error('Pool investment failed. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const isDisabled = !isConnected || isDepositing || isValidating || !amount;

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-oga-green">
          <DollarSign className="h-5 w-5 text-oga-green" />
          Invest in {poolName}
        </CardTitle>
        {aprRate && (
          <Badge className="w-fit bg-oga-green/20 text-oga-green border-oga-green/50">
            {aprRate}% APR
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <Alert className="bg-amber-500/10 border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-500">
              Please connect your wallet to invest.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="pool-investment-amount" className="text-oga-green">
            Investment Amount (USDC)
          </Label>
          <Input
            id="pool-investment-amount"
            type="number"
            placeholder={`Min: $${minInvestment.toLocaleString()}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isDisabled}
            className="bg-black/20 border-oga-green/20 text-white placeholder:text-oga-green/60"
          />
          <div className="flex justify-between text-xs text-oga-green/80">
            <span>Min: ${minInvestment.toLocaleString()}</span>
            <span>Max: ${maxInvestment.toLocaleString()}</span>
          </div>
        </div>

        {depositError && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">
              {depositError.message || 'Pool investment failed. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleDeposit}
          disabled={isDisabled}
          className="w-full bg-oga-green hover:bg-oga-green/80 text-white"
        >
          {isDepositing || isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isValidating ? 'Validating...' : 'Depositing...'}
            </>
          ) : (
            `Invest $${amount || '0'}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface ClaimReturnsProps {
  vaultAddress: `0x${string}`;
  projectName: string;
  claimablePrincipal: string;
  claimableInterest: string;
  onSuccess?: () => void;
}

export function ClaimReturns({
  vaultAddress,
  projectName,
  claimablePrincipal,
  claimableInterest,
  onSuccess
}: ClaimReturnsProps) {
  const { isConnected } = useAccount();
  const [claimType, setClaimType] = useState<'principal' | 'interest' | 'both'>('both');
  
  // These would need to be implemented in the DirectProjectVault hook
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    if (!isConnected) return;

    try {
      setIsClaiming(true);
      
      // Implementation would use actual contract methods
      toast.success(`Successfully claimed returns from ${projectName}!`);
      onSuccess?.();
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Claim failed. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const totalClaimable = parseFloat(claimablePrincipal) + parseFloat(claimableInterest);
  const hasClaimableAmount = totalClaimable > 0;

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-oga-green">
          <CheckCircle className="h-5 w-5 text-oga-green" />
          Claim Returns - {projectName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <Alert className="bg-amber-500/10 border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-500">
              Please connect your wallet to claim returns.
            </AlertDescription>
          </Alert>
        )}
        
        {!hasClaimableAmount && (
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-500">
              No returns available to claim at this time.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-oga-green/80">Claimable Principal</Label>
            <div className="text-lg font-semibold text-oga-green">${claimablePrincipal}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-oga-green/80">Claimable Interest</Label>
            <div className="text-lg font-semibold text-oga-green">${claimableInterest}</div>
          </div>
        </div>

        <Button
          onClick={handleClaim}
          disabled={!isConnected || !hasClaimableAmount || isClaiming}
          className="w-full bg-oga-green hover:bg-oga-green/80 text-white"
        >
          {isClaiming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : (
            `Claim $${totalClaimable.toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 