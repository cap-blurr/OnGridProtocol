"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";

interface InvestmentModalProps {
  project: {
    id: string;
    title: string;
    chain: "solana" | "base";
    availableAmount: number;
    returns: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

type Step = "amount" | "review" | "processing" | "complete";

export function InvestmentModal({
  project,
  isOpen,
  onClose,
}: InvestmentModalProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const estimatedGas =
    project.chain === "solana" ? "0.000005 SOL" : "0.0003 ETH";
  const estimatedReturns = Number.parseFloat(amount) * (project.returns / 100);

  const handleSubmit = async () => {
    setIsLoading(true);
    setStep("processing");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep("complete");
      toast.success(
        `You have successfully invested ${amount} in ${project.title}`
      );
    } catch (error) {
        console.log(error);
        
      toast.error(
        `There was an error processing your investment. Please try again.`
      );
      setStep("amount");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("amount");
    setAmount("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] text-white dark bg-[#0f0f0f]">
        <DialogHeader className="text-white">
          <DialogTitle className="">Invest in {project.title}</DialogTitle>
          <DialogDescription className="">
            {step === "amount" && "Enter the amount you want to invest"}
            {step === "review" && "Review your investment details"}
            {step === "processing" && "Processing your investment"}
            {step === "complete" && "Investment Complete!"}
          </DialogDescription>
        </DialogHeader>

        {step === "amount" && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Investment Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min={0}
                max={project.availableAmount}
                className="border-green-600/20 focus-visible:ring-green-500"
              />
              <p className="text-sm text-muted-foreground">
                Available: ${project.availableAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span>Investment Amount</span>
                <span className="font-medium">
                  ${Number.parseFloat(amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estimated Gas Fee</span>
                <span className="font-medium">{estimatedGas}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expected Annual Returns</span>
                <span className="font-medium">
                  ${estimatedReturns.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm text-muted-foreground">
                Processing your investment...
              </p>
              <Progress value={66} className="w-full" />
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-center text-sm text-muted-foreground">
                Your investment of ${Number.parseFloat(amount).toLocaleString()}{" "}
                has been processed successfully.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "amount" && (
            <Button
              onClick={() => setStep("review")}
              disabled={
                !amount ||
                Number.parseFloat(amount) <= 0 ||
                Number.parseFloat(amount) > project.availableAmount
              }
              className="bg-oga-green p-4 border border-oga-green-dark rounded-xl text-white hover:bg-oga-yellow-dark hover:text-gray-900"
            >
              Review Investment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {step === "review" && (
            <div className="flex w-full gap-2">
              <Button variant="outline" onClick={() => setStep("amount")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1 bg-oga-green p-4 border border-oga-green-dark rounded-xl text-white hover:bg-oga-yellow-dark hover:text-gray-900"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Confirm Investment
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          )}

          {step === "complete" && <Button onClick={handleClose}>Close</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
