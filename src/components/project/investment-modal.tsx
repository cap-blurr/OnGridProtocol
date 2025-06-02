"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, Check, CreditCard, DollarSign, InfoIcon, Leaf, Wallet } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InvestmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectData?: any;
  poolData?: any;
  type: "project" | "pool";
}

export function InvestmentModal({
  open,
  onOpenChange,
  projectData,
  poolData,
  type,
}: InvestmentModalProps) {
  const data = type === "project" ? projectData : poolData;
  const [amount, setAmount] = useState<number>(data?.minInvestment || 1000);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("wallet");

  const handleInvest = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 3000);
    }, 2000);
  };

  const minInvestment = data?.minInvestment || 1000;
  const maxInvestment = type === "project" ? data?.remaining || 100000 : 500000;
  const apr = data?.apr || data?.roi || 12.5;
  
  // Calculate returns
  const annualReturn = (amount * apr) / 100;
  const monthlyReturn = annualReturn / 12;

  // Reset state when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAmount(data?.minInvestment || 1000);
      setLoading(false);
      setSuccess(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="dark sm:max-w-md md:max-w-xl w-[95%] sm:w-auto text-zinc-100 shadow-2xl shadow-black/40 bg-gradient-to-b from-black to-zinc-900/95 border border-oga-green/30">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white text-center">
                Invest in {data?.name}
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-center pt-2">
                {type === "project" 
                  ? "Support this renewable energy project and earn returns from energy generation" 
                  : "Invest in a diversified pool of renewable energy projects"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-2">
              <div className="flex flex-col md:flex-row justify-between gap-6 p-4 bg-zinc-900/50 rounded-lg border border-oga-green/20">
                <div className="space-y-1">
                  <span className="text-zinc-400 text-sm">Expected APR</span>
                  <div className="font-medium text-oga-green text-xl">{apr}%</div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-zinc-400 text-sm">Min Investment</span>
                  <div className="font-medium text-white text-xl">${minInvestment.toLocaleString()}</div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-zinc-400 text-sm">Type</span>
                  <div className="font-medium text-white text-xl">
                    {type === "project" ? (
                      <Badge variant="outline" className="bg-oga-green/20 border-oga-green/50 text-oga-green">
                        Direct Project
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-oga-green/20 border-oga-green/50 text-oga-green">
                        Investment Pool
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="amount">Investment Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={minInvestment}
                    max={maxInvestment}
                    step={100}
                    className="pl-10 bg-zinc-900 border-oga-green/30 focus:border-oga-green"
                  />
                </div>
                <Slider
                  value={[amount]}
                  min={minInvestment}
                  max={maxInvestment}
                  step={100}
                  onValueChange={(value) => setAmount(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>${minInvestment.toLocaleString()}</span>
                  <span>${maxInvestment.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/50 space-y-3 border border-oga-green/20">
                <h3 className="font-medium text-white">Estimated Returns</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-zinc-400 text-sm">Annual Return</span>
                    <div className="font-medium text-oga-green">${annualReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-zinc-400 text-sm">Monthly Return</span>
                    <div className="font-medium text-oga-green">${monthlyReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
                
                <Alert className="bg-oga-yellow/20 border border-oga-yellow/50 text-oga-yellow flex items-start p-3">
                  <InfoIcon className="h-4 w-4 mr-2 mt-0.5" />
                  <AlertDescription className="text-xs">
                    Returns are estimates based on projected performance and may vary depending on actual generation results.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className={`justify-start gap-3 py-6 ${
                      paymentMethod === "wallet"
                        ? "border-oga-green bg-oga-green/20"
                        : "border-zinc-700 hover:border-oga-green/50 hover:bg-oga-green/10"
                    }`}
                    onClick={() => setPaymentMethod("wallet")}
                  >
                    <Wallet className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Crypto Wallet</div>
                      <div className="text-xs text-zinc-400">Pay with your connected wallet</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={`justify-start gap-3 py-6 ${
                      paymentMethod === "card"
                        ? "border-oga-green bg-oga-green/20"
                        : "border-zinc-700 hover:border-oga-green/50 hover:bg-oga-green/10"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Credit Card</div>
                      <div className="text-xs text-zinc-400">Pay with credit or debit card</div>
                    </div>
                  </Button>
                </div>
              </div>
              
              {amount < minInvestment && (
                <Alert className="bg-red-900/20 border border-red-900/50 text-red-500 flex items-start p-3">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                  <AlertDescription className="text-xs">
                    The minimum investment amount is ${minInvestment.toLocaleString()}.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-3">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvest}
                disabled={loading || amount < minInvestment}
                className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white px-8 flex-1 sm:flex-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>Confirm Investment</>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-oga-green/30 flex items-center justify-center mb-2">
              <Check className="w-8 h-8 text-oga-green" />
            </div>
            <h2 className="text-2xl font-bold text-white">Investment Successful!</h2>
            <p className="text-zinc-400 max-w-md">
              Your investment of ${amount.toLocaleString()} in {data?.name} has been processed successfully.
            </p>
            <div className="flex items-center pt-4 gap-2">
              <Leaf className="text-oga-green h-5 w-5" />
              <span className="text-oga-green text-sm">
                You're helping build a sustainable future
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
