"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import KycForm from "./kyc-form";
import { ArrowRight, Shield } from "lucide-react";

export function KYCModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-between items-center px-6 py-3 text-white hover:text-oga-yellow font-bold cursor-pointer">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            KYC
          </span>
          <ArrowRight className="w-5 h-5" />
        </div>
      </DialogTrigger>
      <DialogContent className="dark sm:max-w-[600px] max-h-[90vh] overflow-y-auto text-zinc-100 shadow-2xl shadow-black/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            KYC
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Securing your account with a quick verification. Your information
            stays protected while we keep things safe and compliant
          </DialogDescription>
        </DialogHeader>
        <KycForm />
      </DialogContent>
    </Dialog>
  );
}
