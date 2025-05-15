'use client';

import { KYCForm } from '@/components/developer/KYCForm';

export default function KYCPage() {
  return (
    <div className="w-full min-h-[calc(100vh-var(--header-height,80px))] flex flex-col items-center justify-center p-4 bg-zinc-900">
      {/* Adjust var(--header-height) if your actual header height is different or remove if no fixed header */}
      <div className="w-full max-w-2xl">
        <KYCForm />
      </div>
    </div>
  );
}
