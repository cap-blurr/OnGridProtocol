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
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="rounded-full bg-gray-100 p-3">
              <ShieldCheck className="h-6 w-6 text-gray-500" />
            </div>
            {isCheckingKyc ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking KYC status...</span>
              </div>
            ) : isKycVerified ? (
              <div className="text-center">
                <h3 className="font-medium">KYC Verified</h3>
                <p className="text-sm text-gray-500">You are verified and can create projects</p>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="font-medium">KYC Required</h3>
                <p className="text-sm text-gray-500">Please complete KYC verification before creating a project</p>
              </div>
            )}
            <Button 
              onClick={handleKycCheck}
              disabled={!isKycVerified || isCheckingKyc}
            >
              Continue
            </Button>
          </div>
        );
        
      case ProjectCreationStep.DETAILS:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 max-h-[70vh] overflow-y-auto">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project"
                  className="h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectLocation">Project Location</Label>
                <Input
                  id="projectLocation"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  placeholder="Enter project location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (USDC)</Label>
                <Input
                  id="loanAmount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenorDays">Loan Duration (Days)</Label>
                <Input
                  id="tenorDays"
                  value={tenorDays}
                  onChange={(e) => setTenorDays(e.target.value)}
                  placeholder="Enter loan duration in days"
                  type="number"
                />
              </div>
            </div>

            {/* Right Column - Technical Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (MW)</Label>
                <Input
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Enter capacity in MW"
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedGeneration">Expected Annual Generation (MWh)</Label>
                <Input
                  id="expectedGeneration"
                  value={expectedGeneration}
                  onChange={(e) => setExpectedGeneration(e.target.value)}
                  placeholder="Enter expected generation"
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbonCredits">Carbon Credits (per year)</Label>
                <Input
                  id="carbonCredits"
                  value={carbonCredits}
                  onChange={(e) => setCarbonCredits(e.target.value)}
                  placeholder="Enter estimated carbon credits"
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedROI">Expected ROI (%)</Label>
                <Input
                  id="expectedROI"
                  value={expectedROI}
                  onChange={(e) => setExpectedROI(e.target.value)}
                  placeholder="Enter expected ROI"
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Enter contact email"
                  type="email"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button onClick={handleDetailsSubmit}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case ProjectCreationStep.APPROVE:
        return (
          <div className="space-y-6 p-6">
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
          <div className="space-y-6 p-6">
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
          <div className="space-y-6 p-6">
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
      <DialogContent className="sm:max-w-[900px] sm:h-auto max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the project details to create a new funding request
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {renderStepContent()}
        </div>

        <div className="px-6 py-4 border-t">
          <Progress value={getProgressValue()} className="h-2" />
          <div className="mt-2 text-sm text-gray-500">
            Step {currentStep + 1} of {Object.keys(ProjectCreationStep).length / 2}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
