"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "wagmi";
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove, USDC_DECIMALS, isApprovalNeeded } from "@/hooks/contracts/useUSDC";
import { useContractAddresses, useIsVerified } from "@/hooks/contracts/useDeveloperRegistry";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatUnits, parseUnits } from "ethers";
import { 
  ArrowRight, 
  AlertCircle, 
  Check, 
  Loader2, 
  FileText,
  DollarSign, 
  Clock,
  RefreshCw,
  ShieldCheck
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";
import { useProjectFactory } from "@/hooks/contracts/useProjectFactory";
import { DEVELOPER_DEPOSIT_BPS, BASIS_POINTS_DENOMINATOR } from "@/lib/constants";
import { ipfsService, ProjectMetadata } from '@/lib/ipfs-service';

// Steps in the project creation flow
enum ProjectCreationStep {
  KYC_CHECK = 0,
  DETAILS = 1,
  APPROVE = 2,
  CREATE = 3,
  COMPLETE = 4
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void; // Optional callback to refresh dashboard
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  // Enhanced form state for comprehensive project metadata
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectLocation, setProjectLocation] = useState<string>("");
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [tenorDays, setTenorDays] = useState<string>("365");
  
  // New technical fields
  const [capacity, setCapacity] = useState<string>(""); // MW
  const [expectedGeneration, setExpectedGeneration] = useState<string>(""); // MWh per year
  const [carbonCredits, setCarbonCredits] = useState<string>(""); // per year
  const [equipment, setEquipment] = useState<string>("Solar Panels, Inverters, Mounting Systems");
  const [installationTimeline, setInstallationTimeline] = useState<string>("6 months");
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<string>("Annual inspections");
  const [expectedROI, setExpectedROI] = useState<string>("12.5");
  const [paybackPeriod, setPaybackPeriod] = useState<string>("36");
  const [contactEmail, setContactEmail] = useState<string>("");
  
  // Auto-generated metadata CID - will be populated automatically
  const [metadataCID, setMetadataCID] = useState<string>("");
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>("0");
  const [depositPercentage, setDepositPercentage] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<ProjectCreationStep>(ProjectCreationStep.KYC_CHECK);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [vaultAddress, setVaultAddress] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  
  // Get connected account
  const { address: developerAddress, isConnected } = useAccount();
  
  // Get contract addresses
  const addresses = useContractAddresses();

  // Check KYC verification status
  const { data: isKycVerified, isLoading: isCheckingKyc } = useIsVerified(developerAddress);

  // Get USDC balance
  const { balance: usdcBalance, formattedBalance: formattedUsdcBalance, refetch: refetchBalance } =
    useUSDCBalance(developerAddress);

  // Get USDC allowance for DeveloperDepositEscrow
  const { allowance: usdcAllowance, formattedAllowance, refetch: refetchAllowance } = 
    useUSDCAllowance(developerAddress, addresses.developerDepositEscrow as `0x${string}`);

  // USDC approve function
  const { approve, isLoading: isApproving, isSuccess: isApproveSuccess } = useUSDCApprove();

  // Use the updated hook for project creation
  const { 
    createProject, 
    isLoading: isCreating, 
    isSuccess: isCreateSuccess,
    projectEvents,
    isKycVerified: hookKycVerified
  } = useProjectFactory().useCreateProject();

  // Monitor project events for completion
  useEffect(() => {
    if (projectEvents.length > 0 && currentStep === ProjectCreationStep.CREATE) {
      const latestEvent = projectEvents[projectEvents.length - 1];
      
      if (latestEvent.type === 'high-value') {
        const { projectId, vaultAddress: highValueVaultAddress } = latestEvent.data;
        setNewProjectId(projectId.toString());
        setVaultAddress(highValueVaultAddress);
        setProjectStatus("High-value Project Created");
        setCurrentStep(ProjectCreationStep.COMPLETE);
        // Trigger dashboard refresh
        onProjectCreated?.();
      } else if (latestEvent.type === 'low-value') {
        const { projectId, success, poolId } = latestEvent.data;
        setNewProjectId(projectId.toString());
        
        if (success && poolId.toString() !== "0") {
          setProjectStatus(`Low-value Project Funded by Pool ${poolId}`);
        } else {
          setProjectStatus("Low-value Project Pending Funding");
        }
        
        setCurrentStep(ProjectCreationStep.COMPLETE);
        // Trigger dashboard refresh
        onProjectCreated?.();
      }
    }
  }, [projectEvents, currentStep]);

  // Calculate deposit amount and percentage when loan amount changes
  useEffect(() => {
    if (loanAmount && parseFloat(loanAmount) > 0 && DEVELOPER_DEPOSIT_BPS && BASIS_POINTS_DENOMINATOR) {
      try {
        const developerDepositBpsBigInt = BigInt(DEVELOPER_DEPOSIT_BPS);
        const basisPointsDenominatorBigInt = BigInt(BASIS_POINTS_DENOMINATOR);

        const loanAmountBigInt = parseUnits(loanAmount, USDC_DECIMALS);
        const calculatedDeposit = (loanAmountBigInt * developerDepositBpsBigInt) / basisPointsDenominatorBigInt;
        setDepositAmount(formatUnits(calculatedDeposit, USDC_DECIMALS));

        const percentage = (Number(developerDepositBpsBigInt) * 100) / Number(basisPointsDenominatorBigInt);
        setDepositPercentage(percentage);

      } catch (err) {
        setDepositAmount("0"); 
        setDepositPercentage(null);
      }
    } else if (loanAmount === "" || parseFloat(loanAmount) <= 0) {
        setDepositAmount("0");
        setDepositPercentage(null);
    }
  }, [loanAmount]); 

  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setProjectName("");
        setProjectDescription("");
        setProjectLocation("");
        setLoanAmount("");
        setTenorDays("365");
        setCapacity("");
        setExpectedGeneration("");
        setCarbonCredits("");
        setEquipment("Solar Panels, Inverters, Mounting Systems");
        setInstallationTimeline("6 months");
        setMaintenanceSchedule("Annual inspections");
        setExpectedROI("12.5");
        setPaybackPeriod("36");
        setContactEmail("");
        setMetadataCID("");
        setDepositAmount("0");
        setDepositPercentage(null);
        setCurrentStep(ProjectCreationStep.KYC_CHECK);
        setNewProjectId(null);
        setVaultAddress(null);
        setProjectStatus(null);
      }, 300);
    } else {
      refetchBalance();
      refetchAllowance();
    }
  }, [isOpen, refetchBalance, refetchAllowance]);

  // Auto-advance past KYC check if verified
  useEffect(() => {
    if (isKycVerified && currentStep === ProjectCreationStep.KYC_CHECK) {
      setCurrentStep(ProjectCreationStep.DETAILS);
    }
  }, [isKycVerified, currentStep]);

  // Move to next step when approval succeeds
  useEffect(() => {
    if (isApproveSuccess && currentStep === ProjectCreationStep.APPROVE) {
      refetchAllowance();
      setCurrentStep(ProjectCreationStep.CREATE);
    }
  }, [isApproveSuccess, currentStep, refetchAllowance]);

  const handleKycCheck = () => {
    if (isKycVerified) {
      setCurrentStep(ProjectCreationStep.DETAILS);
    } else {
      toast.error("Please complete KYC verification before creating a project");
    }
  };
  
  // Enhanced validation function
  const validateProjectDetails = () => {
    const errors: string[] = [];
    
    if (!projectName.trim()) errors.push("Project name is required");
    if (!projectDescription.trim()) errors.push("Project description is required");
    if (!projectLocation.trim()) errors.push("Project location is required");
    if (!loanAmount || parseFloat(loanAmount) <= 0) errors.push("Valid loan amount is required");
    if (!capacity || parseFloat(capacity) <= 0) errors.push("Project capacity (MW) is required");
    if (!expectedGeneration || parseFloat(expectedGeneration) <= 0) errors.push("Expected annual generation (MWh) is required");
    if (!carbonCredits || parseFloat(carbonCredits) < 0) errors.push("Carbon credits estimate is required");
    if (!contactEmail.trim() || !contactEmail.includes('@')) errors.push("Valid contact email is required");
    
    const tenorValue = parseInt(tenorDays);
    if (isNaN(tenorValue) || tenorValue <= 0 || tenorValue > 10000) {
      errors.push("Tenor must be between 1 and 10,000 days");
    }
    
    return errors;
  };

  // Auto-generate comprehensive IPFS metadata
  const generateProjectMetadata = async (): Promise<string> => {
    setIsGeneratingMetadata(true);
    
    try {
      const metadata: ProjectMetadata = {
        name: projectName.trim(),
        description: projectDescription.trim(),
        location: projectLocation.trim(),
        projectType: 'solar',
        capacity: parseFloat(capacity),
        expectedAnnualGeneration: parseFloat(expectedGeneration),
        carbonCreditsExpected: parseFloat(carbonCredits),
        developer: {
          name: projectName.trim(), // Could be enhanced with separate developer name field
          address: developerAddress || '',
          contact: contactEmail.trim(),
        },
        technical: {
          equipment: equipment.split(',').map(item => item.trim()),
          installationTimeline: installationTimeline.trim(),
          maintenanceSchedule: maintenanceSchedule.trim(),
        },
        financial: {
          totalCost: parseFloat(loanAmount),
          loanAmount: parseFloat(loanAmount),
          tenor: parseInt(tenorDays),
          expectedROI: parseFloat(expectedROI),
          paybackPeriod: parseFloat(paybackPeriod),
        },
        images: [], // Could be enhanced with image upload
        documents: [], // Could be enhanced with document upload
        created: Date.now(),
        version: '1.0.0',
      };

      const cid = await ipfsService.uploadProjectMetadata(metadata);
      console.log('✅ Metadata uploaded to IPFS:', cid);
      return cid;
    } catch (error) {
      console.error('❌ Error generating metadata:', error);
      throw new Error('Failed to generate project metadata');
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  // Enhanced details submission with automatic metadata generation
  const handleDetailsSubmit = async () => {
    try {
      // Validate all inputs
      const validationErrors = validateProjectDetails();
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]);
        return;
      }

      // Generate IPFS metadata automatically
      toast.loading("Generating project metadata...", { id: "metadata-gen" });
      const metadataCID = await generateProjectMetadata();
      toast.success("Project metadata generated successfully!", { id: "metadata-gen" });

      // Store the generated CID for project creation
      setMetadataCID(metadataCID);

      // Check if approval is needed
      if (parseFloat(depositAmount) > 0) {
        const needsApproval = isApprovalNeeded(usdcAllowance, depositAmount);
        if (needsApproval) {
          setCurrentStep(ProjectCreationStep.APPROVE);
        } else {
          setCurrentStep(ProjectCreationStep.CREATE);
        }
      } else {
        setCurrentStep(ProjectCreationStep.CREATE);
      }
    } catch (error) {
      toast.error("Error preparing project details");
      console.error(error);
    }
  };

  const handleApprove = () => {
    if (!developerAddress) {
      toast.error("Wallet not connected");
      return;
    }
    if (!addresses.developerDepositEscrow) {
      toast.error("Developer Deposit Escrow address not found");
      return;
    }
    if (parseFloat(depositAmount) <= 0) {
      toast.error("Deposit amount is zero or invalid");
      setCurrentStep(ProjectCreationStep.CREATE);
      return;
    }
    
    approve(
      addresses.developerDepositEscrow as `0x${string}`, 
      depositAmount
    );
  };

  // Handle project creation
  const handleCreateProject = async () => {
    if (!developerAddress) {
      toast.error("Wallet not connected");
      return;
    }
    
    let formattedCID = metadataCID.trim();
    if (!formattedCID || formattedCID.length < 5) { 
      toast.error("Metadata CID is required");
      setCurrentStep(ProjectCreationStep.DETAILS);
      return;
    }
    
    // Remove 'ipfs://' prefix if present as the hook will add it
    if (formattedCID.startsWith('ipfs://')) {
      formattedCID = formattedCID.replace('ipfs://', '');
    }
    
    try {
      const loanAmountParsed = parseFloat(loanAmount);
      const tenorDaysParsed = parseInt(tenorDays);

      if (isNaN(loanAmountParsed) || loanAmountParsed <= 0) {
        toast.error("Invalid loan amount");
        setCurrentStep(ProjectCreationStep.DETAILS);
        return;
      }
      if (isNaN(tenorDaysParsed) || tenorDaysParsed <= 0 || tenorDaysParsed > 10000) {
        toast.error("Invalid loan tenor");
        setCurrentStep(ProjectCreationStep.DETAILS);
        return;
      }

      // Calculate intelligent funding deadline based on project size
      // Larger projects get more time to attract investors
      let fundingDeadlineSeconds: number;
      if (loanAmountParsed >= 1000000) {
        // Large projects (>= $1M): 60 days
        fundingDeadlineSeconds = 60 * 24 * 60 * 60;
      } else if (loanAmountParsed >= 500000) {
        // Medium projects ($500K - $1M): 45 days
        fundingDeadlineSeconds = 45 * 24 * 60 * 60;
      } else if (loanAmountParsed >= 100000) {
        // Small projects ($100K - $500K): 30 days
        fundingDeadlineSeconds = 30 * 24 * 60 * 60;
      } else {
        // Very small projects (<$100K): 21 days
        fundingDeadlineSeconds = 21 * 24 * 60 * 60;
      }

      // Create parameters in the format expected by the hook (as per integration guide)
      const params = {
        loanAmountRequested: loanAmount, // Keep as string, hook will convert
        requestedTenor: tenorDays, // Keep as string, hook will convert
        fundingDeadline: fundingDeadlineSeconds.toString(), // Dynamic deadline in seconds
        metadataCID: formattedCID
      };
      
      console.log('🚀 Creating project with intelligent funding deadline:', {
        loanAmount: `$${loanAmountParsed.toLocaleString()}`,
        fundingDeadlineDays: Math.ceil(fundingDeadlineSeconds / (24 * 60 * 60)),
        metadataCID: formattedCID
      });
      
      createProject(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to create project: ${errorMessage}`);
    }
  };

  // Content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case ProjectCreationStep.KYC_CHECK:
        return (
          <div className="space-y-6">
            <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <AlertTitle>KYC Check</AlertTitle>
              <AlertDescription>
                Please complete KYC verification before proceeding.
              </AlertDescription>
            </Alert>
            
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleKycCheck}
              disabled={isCheckingKyc}
            >
              {isCheckingKyc ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking KYC...
                </>
              ) : (
                <>
                  Proceed
                </>
              )}
            </Button>
          </div>
        );
        
      case ProjectCreationStep.DETAILS:
        return (
          <div className="space-y-6">
            <Alert className="bg-blue-900/30 border-blue-700 text-blue-300">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>Project Details</AlertTitle>
              <AlertDescription>
                Provide comprehensive details about your solar energy project. All information will be stored securely on IPFS.
              </AlertDescription>
            </Alert>
            
            {/* Basic Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-zinc-300">Project Name *</Label>
                  <Input 
                    id="projectName" 
                    value={projectName} 
                    onChange={(e) => setProjectName(e.target.value)} 
                    placeholder="e.g., Sunny Valley Solar Farm" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectLocation" className="text-zinc-300">Location *</Label>
                  <Input 
                    id="projectLocation" 
                    value={projectLocation} 
                    onChange={(e) => setProjectLocation(e.target.value)} 
                    placeholder="e.g., California, USA" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectDescription" className="text-zinc-300">Project Description *</Label>
                <Textarea 
                  id="projectDescription" 
                  value={projectDescription} 
                  onChange={(e) => setProjectDescription(e.target.value)} 
                  placeholder="Describe your solar energy project, its impact, and goals..." 
                  className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600 min-h-[100px]" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-zinc-300">Contact Email *</Label>
                <Input 
                  id="contactEmail" 
                  type="email"
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)} 
                  placeholder="your@email.com" 
                  className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Technical Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-zinc-300">Capacity (MW) *</Label>
                  <Input 
                    id="capacity" 
                    type="number" 
                    step="0.1"
                    value={capacity} 
                    onChange={(e) => setCapacity(e.target.value)} 
                    placeholder="e.g., 5.0" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedGeneration" className="text-zinc-300">Annual Generation (MWh) *</Label>
                  <Input 
                    id="expectedGeneration" 
                    type="number"
                    value={expectedGeneration} 
                    onChange={(e) => setExpectedGeneration(e.target.value)} 
                    placeholder="e.g., 12000" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carbonCredits" className="text-zinc-300">Carbon Credits/Year *</Label>
                  <Input 
                    id="carbonCredits" 
                    type="number"
                    value={carbonCredits} 
                    onChange={(e) => setCarbonCredits(e.target.value)} 
                    placeholder="e.g., 5000" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="installationTimeline" className="text-zinc-300">Installation Timeline</Label>
                  <Input 
                    id="installationTimeline" 
                    value={installationTimeline} 
                    onChange={(e) => setInstallationTimeline(e.target.value)} 
                    placeholder="e.g., 6 months" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maintenanceSchedule" className="text-zinc-300">Maintenance Schedule</Label>
                  <Input 
                    id="maintenanceSchedule" 
                    value={maintenanceSchedule} 
                    onChange={(e) => setMaintenanceSchedule(e.target.value)} 
                    placeholder="e.g., Annual inspections" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equipment" className="text-zinc-300">Equipment List</Label>
                <Input 
                  id="equipment" 
                  value={equipment} 
                  onChange={(e) => setEquipment(e.target.value)} 
                  placeholder="e.g., Solar Panels, Inverters, Mounting Systems" 
                  className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                />
                <p className="text-xs text-zinc-500">Separate items with commas</p>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Financial Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="text-zinc-300">Total Project Cost (USDC) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input 
                      id="loanAmount" 
                      value={loanAmount} 
                      onChange={(e) => setLoanAmount(e.target.value)} 
                      type="number" 
                      placeholder="e.g., 500000" 
                      className="h-10 pl-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                    />
                  </div>
                  {depositPercentage && (
                    <p className="text-xs text-zinc-500">
                      Required deposit: {depositAmount} USDC ({depositPercentage}%)
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tenorDays" className="text-zinc-300">Loan Tenor (Days) *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input 
                      id="tenorDays" 
                      value={tenorDays} 
                      onChange={(e) => setTenorDays(e.target.value)} 
                      type="number" 
                      placeholder="365" 
                      className="h-10 pl-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedROI" className="text-zinc-300">Expected ROI (%)</Label>
                  <Input 
                    id="expectedROI" 
                    type="number" 
                    step="0.1"
                    value={expectedROI} 
                    onChange={(e) => setExpectedROI(e.target.value)} 
                    placeholder="12.5" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paybackPeriod" className="text-zinc-300">Payback Period (Months)</Label>
                  <Input 
                    id="paybackPeriod" 
                    type="number"
                    value={paybackPeriod} 
                    onChange={(e) => setPaybackPeriod(e.target.value)} 
                    placeholder="36" 
                    className="bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                  />
                </div>
              </div>
            </div>

            <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300">
              <Check className="h-4 w-4 mr-2" />
              <AlertTitle>Automatic IPFS Metadata</AlertTitle>
              <AlertDescription>
                Your project metadata will be automatically generated and stored on IPFS. No need to manually create or input a metadata CID.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case ProjectCreationStep.APPROVE:
        return (
          <div className="space-y-6">
            <Alert className="bg-yellow-900/30 border-yellow-700 text-yellow-300">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>USDC Approval Required</AlertTitle>
              <AlertDescription>
                You need to approve the DeveloperDepositEscrow contract to spend your USDC.
              </AlertDescription>
            </Alert>
            
            <div className="p-4 border border-zinc-800 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Amount to Approve:</span>
                <span className="text-white">{depositAmount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Contract to Approve:</span>
                <span className="text-white truncate max-w-[200px]">{addresses.developerDepositEscrow}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  Approve USDC
                </>
              )}
            </Button>
          </div>
        );
        
      case ProjectCreationStep.CREATE:
        return (
          <div className="space-y-6">
            <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300">
              <Check className="h-4 w-4 mr-2" />
              <AlertTitle>Ready to Create Project</AlertTitle>
              <AlertDescription>
                Your USDC is approved. You can now create your project.
              </AlertDescription>
            </Alert>
            
            <div className="p-4 border border-zinc-800 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Project Name:</span>
                <span className="text-white font-medium">{projectName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Capacity:</span>
                <span className="text-white">{capacity} MW</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Loan Amount:</span>
                <span className="text-white">${parseFloat(loanAmount).toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Required Deposit:</span>
                <span className="text-white">{depositAmount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Loan Tenor:</span>
                <span className="text-white">{tenorDays} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Funding Deadline:</span>
                <span className="text-white">
                  {(() => {
                    const amount = parseFloat(loanAmount);
                    if (amount >= 1000000) return "60 days";
                    if (amount >= 500000) return "45 days";
                    if (amount >= 100000) return "30 days";
                    return "21 days";
                  })()} (auto-calculated)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Expected Generation:</span>
                <span className="text-white">{expectedGeneration} MWh/year</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">IPFS Metadata:</span>
                <span className="text-emerald-400 text-xs">✅ Generated automatically</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleCreateProject}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  Create Project
                </>
              )}
            </Button>
          </div>
        );
        
      case ProjectCreationStep.COMPLETE:
        return (
          <div className="space-y-6">
            <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300">
              <Check className="h-4 w-4 mr-2" />
              <AlertTitle>Project Created Successfully!</AlertTitle>
              <AlertDescription>
                Your project has been created and is now {projectStatus?.toLowerCase()}.
              </AlertDescription>
            </Alert>
            
            <div className="p-4 border border-zinc-800 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Project ID:</span>
                <span className="text-white font-mono">{newProjectId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Project Name:</span>
                <span className="text-white font-medium">{projectName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total Funding:</span>
                <span className="text-white">${parseFloat(loanAmount).toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Capacity:</span>
                <span className="text-white">{capacity} MW</span>
              </div>
              {vaultAddress && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Vault Address:</span>
                  <span className="text-white font-mono text-xs truncate max-w-[200px]">{vaultAddress}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Status:</span>
                <span className="text-emerald-400 font-medium">{projectStatus}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">IPFS Metadata:</span>
                <span className="text-emerald-400 font-mono text-xs">ipfs://{metadataCID}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        );
    }
  };

  // Progress based on current step
  const getProgressValue = () => {
    switch (currentStep) {
      case ProjectCreationStep.KYC_CHECK: return 10;
      case ProjectCreationStep.DETAILS: return 25;
      case ProjectCreationStep.APPROVE: return 50;
      case ProjectCreationStep.CREATE: return 75;
      case ProjectCreationStep.COMPLETE: return 100;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-sm border border-emerald-800/30 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-emerald-500" />
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a new solar energy project for funding.
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>Progress</span>
            <span>{getProgressValue()}%</span>
          </div>
          <Progress value={getProgressValue()} className="h-1 bg-zinc-800" indicatorClassName="bg-emerald-500" />
        </div>
        
        {/* Step content */}
        {renderStepContent()}
        
        {/* Bottom actions */}
        <DialogFooter className="flex items-center justify-between">
          {currentStep === ProjectCreationStep.KYC_CHECK && (
            <>
              <Button variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-400">
                Cancel
              </Button>
              <Button 
                onClick={handleKycCheck} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center"
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </>
          )}
          {currentStep === ProjectCreationStep.DETAILS && (
            <>
              <Button variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-400">
                Cancel
              </Button>
              <Button 
                onClick={handleDetailsSubmit} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center"
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
