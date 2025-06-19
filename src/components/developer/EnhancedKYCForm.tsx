import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  FileText, 
  User,
  Clock,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import toast from 'react-hot-toast';

// Import hooks
import { useIsVerified, useSubmitKYC } from '@/hooks/contracts/useDeveloperRegistry';

interface KYCFormData {
  fullName: string;
  businessName: string;
  businessAddress: string;
  businessRegistrationNumber: string;
  phoneNumber: string;
  email: string;
  projectDescription: string;
  experienceYears: string;
  estimatedProjectValue: string;
  documents: {
    businessRegistration?: File;
    identity?: File;
    addressProof?: File;
    technicalCertificates?: File;
  };
}

enum KYCStep {
  FORM = 0,
  DOCUMENTS = 1,
  UPLOAD = 2,
  SUBMIT = 3,
  COMPLETE = 4
}

interface EnhancedKYCFormProps {
  onComplete?: () => void;
}

export default function EnhancedKYCForm({ onComplete }: EnhancedKYCFormProps) {
  const { address: userAddress } = useAccount();
  const [currentStep, setCurrentStep] = useState<KYCStep>(KYCStep.FORM);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ipfsCID, setIpfsCID] = useState<string>('');
  
  const [formData, setFormData] = useState<KYCFormData>({
    fullName: '',
    businessName: '',
    businessAddress: '',
    businessRegistrationNumber: '',
    phoneNumber: '',
    email: '',
    projectDescription: '',
    experienceYears: '',
    estimatedProjectValue: '',
    documents: {}
  });

  // Get current KYC status
  const { data: kycStatus, isLoading: isLoadingKyc, refetch: refetchKycStatus } = useIsVerified(userAddress);
  
  // Submit KYC function
  const { submitKYC, isLoading: isSubmittingKyc, isSuccess: isKycSubmitted } = useSubmitKYC();

  // Update form data
  const updateFormData = (field: keyof KYCFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file uploads
  const handleFileUpload = (documentType: keyof KYCFormData['documents'], file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  // Validate form data
  const validateForm = () => {
    const required = ['fullName', 'businessName', 'businessAddress', 'email', 'projectDescription'];
    return required.every(field => formData[field as keyof KYCFormData]?.toString().trim());
  };

  // Validate documents
  const validateDocuments = () => {
    return Object.keys(formData.documents).length >= 2; // At least 2 documents required
  };

  // Mock IPFS upload function (replace with actual IPFS integration)
  const uploadToIPFS = async (): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Create metadata object
      const metadata = {
        timestamp: Date.now(),
        version: '1.0',
        developerAddress: userAddress,
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        },
        businessInfo: {
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
          businessRegistrationNumber: formData.businessRegistrationNumber,
        },
        projectInfo: {
          description: formData.projectDescription,
          experienceYears: formData.experienceYears,
          estimatedProjectValue: formData.estimatedProjectValue,
        },
        documents: {
          count: Object.keys(formData.documents).length,
          types: Object.keys(formData.documents),
          // In real implementation, upload files to IPFS and store their CIDs
          documentHashes: Object.keys(formData.documents).map(type => `mock-hash-${type}`),
        }
      };
      
      // Mock IPFS CID generation
      const mockCID = `Qm${Math.random().toString(36).substring(2, 48)}`;
      
      console.log('KYC metadata uploaded to IPFS:', metadata);
      toast.success('Documents uploaded to IPFS successfully!');
      
      return mockCID;
    } catch (error) {
      console.error('IPFS upload error:', error);
      toast.error('Failed to upload documents to IPFS');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate KYC hash
  const calculateKYCHash = (cid: string) => {
    // Create a hash of the KYC data for on-chain verification
    const dataToHash = encodeAbiParameters(
      parseAbiParameters('string, address, uint256'),
      [cid, userAddress!, BigInt(Date.now())]
    );
    return keccak256(dataToHash);
  };

  // Handle KYC submission
  const handleSubmitKYC = async () => {
    if (!userAddress) {
      toast.error('Wallet not connected');
      return;
    }

    if (!ipfsCID) {
      toast.error('No IPFS CID available');
      return;
    }

    try {
      const kycHash = calculateKYCHash(ipfsCID);
      const ipfsUrl = `ipfs://${ipfsCID}`;
      
      submitKYC(userAddress, kycHash, ipfsUrl);
    } catch (error) {
      console.error('KYC submission error:', error);
      toast.error('Failed to submit KYC');
    }
  };

  // Handle step navigation
  const handleNextStep = async () => {
    if (currentStep === KYCStep.FORM && !validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (currentStep === KYCStep.DOCUMENTS && !validateDocuments()) {
      toast.error('Please upload at least 2 documents');
      return;
    }
    
    if (currentStep === KYCStep.UPLOAD) {
      try {
        const cid = await uploadToIPFS();
        setIpfsCID(cid);
        setCurrentStep(KYCStep.SUBMIT);
      } catch (error) {
        return; // Error already handled in uploadToIPFS
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Effect to handle KYC submission success
  useEffect(() => {
    if (isKycSubmitted) {
      setCurrentStep(KYCStep.COMPLETE);
      refetchKycStatus();
      toast.success('KYC submitted successfully! Awaiting admin approval.');
      if (onComplete) onComplete();
    }
  }, [isKycSubmitted, onComplete, refetchKycStatus]);

  // If already verified, show status
  if (kycStatus === true) {
    return (
      <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-oga-green" />
            KYC Verification Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-oga-green/20 border-oga-green/50 text-oga-green">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Verified Developer</AlertTitle>
            <AlertDescription>
              Your KYC verification is complete. You can now create and manage projects on the platform.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case KYCStep.FORM:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-zinc-300">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                  placeholder="Enter your full legal name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-zinc-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName" className="text-zinc-300">Business/Company Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => updateFormData('businessName', e.target.value)}
                  className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                  placeholder="Your Company Ltd."
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="businessAddress" className="text-zinc-300">Business Address *</Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => updateFormData('businessAddress', e.target.value)}
                className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                placeholder="Complete business address including city, state, country"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="regNumber" className="text-zinc-300">Business Registration Number</Label>
                <Input
                  id="regNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={(e) => updateFormData('businessRegistrationNumber', e.target.value)}
                  className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                  placeholder="Company registration/license number"
                />
              </div>
              <div>
                <Label htmlFor="experience" className="text-zinc-300">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => updateFormData('experienceYears', e.target.value)}
                  className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                  placeholder="5"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="projectDesc" className="text-zinc-300">Project Description *</Label>
              <Textarea
                id="projectDesc"
                value={formData.projectDescription}
                onChange={(e) => updateFormData('projectDescription', e.target.value)}
                className="bg-black/20 border-oga-green/30 text-white focus:border-oga-green"
                placeholder="Describe your renewable energy project plans and expertise"
                rows={4}
              />
            </div>
          </div>
        );
        
      case KYCStep.DOCUMENTS:
        return (
          <div className="space-y-6">
            <Alert className="bg-blue-500/20 border-blue-500/50 text-blue-300">
              <FileText className="h-4 w-4" />
              <AlertTitle>Document Requirements</AlertTitle>
              <AlertDescription>
                Please upload at least 2 of the following documents. All files should be in PDF, PNG, or JPG format and under 5MB each.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'businessRegistration', label: 'Business Registration Certificate', required: true },
                { key: 'identity', label: 'Government-issued ID', required: true },
                { key: 'addressProof', label: 'Address Proof (Utility Bill/Bank Statement)', required: false },
                { key: 'technicalCertificates', label: 'Technical Certificates/Qualifications', required: false },
              ].map(({ key, label, required }) => (
                <div key={key} className="p-4 border border-oga-green/30 rounded-lg bg-black/20">
                  <Label className="text-zinc-300 flex items-center gap-2">
                    {label}
                    {required && <span className="text-red-400">*</span>}
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(key as keyof KYCFormData['documents'], file);
                    }}
                    className="mt-2 bg-black/20 border-oga-green/30 text-white file:text-oga-green file:border-0 file:bg-oga-green/20 file:rounded file:px-3 file:py-1"
                  />
                  {formData.documents[key as keyof KYCFormData['documents']] && (
                    <p className="text-oga-green text-sm mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      File selected: {formData.documents[key as keyof KYCFormData['documents']]?.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case KYCStep.UPLOAD:
        return (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center">
              <Upload className="w-16 h-16 text-oga-green mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Ready to Upload</h3>
              <p className="text-zinc-400 mb-6">
                Your KYC data and documents will be securely uploaded to IPFS for verification.
              </p>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-zinc-400">Uploading documents... {uploadProgress}%</p>
              </div>
            )}
            
            <Alert className="bg-oga-yellow/20 border-oga-yellow/50 text-oga-yellow">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your documents will be encrypted and stored on IPFS. Only authorized administrators can access them for verification.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case KYCStep.SUBMIT:
        return (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-oga-green mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Documents Uploaded Successfully</h3>
              <p className="text-zinc-400 mb-6">
                Ready to submit your KYC application for review.
              </p>
            </div>
            
            <div className="bg-black/20 border border-oga-green/30 rounded-lg p-4">
              <div className="text-sm text-zinc-400 mb-2">IPFS CID:</div>
              <div className="text-white font-mono text-xs break-all bg-black/30 p-2 rounded">
                {ipfsCID}
              </div>
            </div>
            
            <Alert className="bg-blue-500/20 border-blue-500/50 text-blue-300">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                After submission, your application will be reviewed by our administrators. This typically takes 1-3 business days.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case KYCStep.COMPLETE:
        return (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-oga-green mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">KYC Application Submitted</h3>
              <p className="text-zinc-400 mb-6">
                Your KYC application has been successfully submitted and is under review.
              </p>
            </div>
            
            <Badge className="bg-oga-yellow/20 text-oga-yellow border-oga-yellow/50">
              Pending Administrator Approval
            </Badge>
            
            <Alert className="bg-oga-green/20 border-oga-green/50 text-oga-green">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You will be notified once your verification is complete. You can then start creating projects on the platform.
              </AlertDescription>
            </Alert>
          </div>
        );
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-oga-green/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-oga-green" />
          Developer KYC Verification
        </CardTitle>
        <div className="flex items-center gap-2 mt-4">
          {[
            'Personal Info',
            'Documents',
            'Upload',
            'Submit',
            'Complete'
          ].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                index <= currentStep 
                  ? 'bg-oga-green text-white' 
                  : 'bg-zinc-700 text-zinc-400'
              }`}>
                {index + 1}
              </div>
              {index < 4 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  index < currentStep 
                    ? 'bg-oga-green' 
                    : 'bg-zinc-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStepContent()}
        
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0 || currentStep === KYCStep.COMPLETE}
            className="border-oga-green/30 text-oga-green hover:bg-oga-green/10"
          >
            Previous
          </Button>
          
          {currentStep < KYCStep.SUBMIT ? (
            <Button
              onClick={handleNextStep}
              disabled={isUploading}
              className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  {currentStep === KYCStep.UPLOAD ? 'Upload Documents' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : currentStep === KYCStep.SUBMIT ? (
            <Button
              onClick={handleSubmitKYC}
              disabled={isSubmittingKyc}
              className="bg-gradient-to-r from-oga-green to-oga-green-light hover:from-oga-green-dark hover:to-oga-green text-white"
            >
              {isSubmittingKyc ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit KYC Application'
              )}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}