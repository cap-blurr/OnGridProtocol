'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi'; // Keep for developer_address, though not strictly for on-chain here
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Supabase URL or Anon Key is missing. KYC form will not connect to database.');
  // You could potentially show a toast error here globally or disable the form
}

interface KYCFormData {
  name: string;
  companyName: string; // This is from the form
  email: string;
  description: string;
}

export function KYCForm() {
  const { address: developerAddress, isConnected } = useAccount(); // To associate submission with a wallet
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<KYCFormData>({
    defaultValues: { name: '', companyName: '', email: '', description: '' }
  });
  
  const onSubmit = async (formData: KYCFormData) => {
    setSubmissionError(null);
    setSubmissionSuccess(false);

    if (!isConnected || !developerAddress) {
      toast.error('Please connect your wallet first.');
      return;
    }

    if (!supabase) {
      toast.error('Database connection is not available. Please try again later.');
      console.error('Supabase client not initialized in KYCForm onSubmit');
      return;
    }
    
    setIsSavingToDb(true);
    const kycDbToastId = 'kycDbSave';

    try {
      toast.loading('Submitting KYC information to database...', { id: kycDbToastId });
      
      // Map form field `companyName` to `company_name` for Supabase table
      const dataToInsert = {
        developer_address: developerAddress,
        name: formData.name,
        company_name: formData.companyName, // Ensure this matches your DB column name
        email: formData.email,
        description: formData.description,
      };

      const { error: dbError } = await supabase
        .from('kyc_submissions') // Ensure this table name is correct
        .insert(dataToInsert);

      if (dbError) {
        throw new Error(dbError.message);
      }
      
      toast.success('KYC information submitted to database successfully!', { id: kycDbToastId });
      console.log('KYC data saved to Supabase for address:', developerAddress);
      setSubmissionSuccess(true);
      reset(); // Reset form on success

    } catch (err: any) {
      toast.error(`Error: ${err.message || 'Failed to submit KYC information.'}`, { id: kycDbToastId });
      console.error('Error submitting KYC to Database:', err);
      setSubmissionError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSavingToDb(false);
    }
  };
  
  return (
    <Card className="w-full bg-black/40 backdrop-blur-sm border border-emerald-800/30">
      <CardHeader>
        <CardTitle className="text-white">Developer KYC Information</CardTitle>
        <CardDescription className="text-zinc-400">
          Submit your identification details. This information will be stored for review.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form id="kyc-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-zinc-300">Full Name</label>
            <Input {...register('name', { required: 'Name is required' })} placeholder="John Doe" className="w-full bg-black/30 border-emerald-900/50 text-white" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-zinc-300">Company Name (Optional)</label>
            <Input {...register('companyName')} placeholder="Your Company" className="w-full bg-black/30 border-emerald-900/50 text-white" />
            {/* No error display for optional companyName needed unless you add specific validation */}
          </div>
          <div className="space-y-2">
            <label className="block text-zinc-300">Email Address</label>
            <Input {...register('email', {  required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }})} placeholder="you@example.com" className="w-full bg-black/30 border-emerald-900/50 text-white" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-zinc-300">Brief Project/Company Description (Optional)</label>
            <Textarea {...register('description')} placeholder="Tell us about your clean energy project or company focus" className="w-full min-h-[100px] bg-black/30 border-emerald-900/50 text-white" />
          </div>
          <p className="text-xs text-zinc-500">
            This information will be submitted to our database for review.
          </p>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3">
        <Button 
          type="submit"
          form="kyc-form"
          disabled={!isConnected || isSavingToDb}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isSavingToDb ? 'Submitting to Database...' : 'Submit KYC Information'}
        </Button>
        
        {submissionError && (
          <p className="text-red-500 text-sm text-center">Error: {submissionError}</p>
        )}
        {submissionSuccess && (
          <p className="text-emerald-500 text-sm text-center">
            KYC information submitted successfully! Application pending review.
          </p>
        )}
        {!isConnected && (
          <p className="text-amber-500 text-sm text-center">Please connect your wallet to submit information.</p>
        )}
      </CardFooter>
    </Card>
  );
} 