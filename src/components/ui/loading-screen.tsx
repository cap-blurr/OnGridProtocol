'use client';

import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 relative mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-pulse opacity-50"></div>
      </div>
      <h2 className="text-xl font-medium text-white mb-2">Loading</h2>
      <p className="text-zinc-400 text-sm">Please wait while we set up your account</p>
    </div>
  );
} 