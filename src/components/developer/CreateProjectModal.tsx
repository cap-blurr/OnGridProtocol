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
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  // Form state
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectLocation, setProjectLocation] = useState<string>("");
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [tenorDays, setTenorDays] = useState<string>("365");
  const [metadataCID, setMetadataCID] = useState<string>("");
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
      } else if (latestEvent.type === 'low-value') {
        const { projectId, success, poolId } = latestEvent.data;
        setNewProjectId(projectId.toString());
        
        if (success && poolId.toString() !== "0") {
          setProjectStatus(`Low-value Project Funded by Pool ${poolId}`);
        } else {
          setProjectStatus("Low-value Project Pending Funding");
        }
        
        setCurrentStep(ProjectCreationStep.COMPLETE);
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
  
  const handleDetailsSubmit = async () => {
    try {
      // Validation
      if (!projectName.trim()) {
        toast.error("Please enter a project name");
        return;
      }
      if (!projectDescription.trim()) {
        toast.error("Please enter a project description");
        return;
      }
      if (!projectLocation.trim()) {
        toast.error("Please enter a project location");
        return;
      }
      if (!loanAmount || parseFloat(loanAmount) <= 0) {
        toast.error("Please enter a valid loan amount");
        return;
      }
      const tenorValueParsed = parseInt(tenorDays);
      if (isNaN(tenorValueParsed) || tenorValueParsed <= 0 || tenorValueParsed > 10000) {
        toast.error("Tenor must be a valid number between 1 and 10,000 days");
        return;
      }
      const trimmedMetadataCID = metadataCID.trim();
      if (!trimmedMetadataCID || trimmedMetadataCID.length < 5) {
        toast.error("Please provide a valid metadata CID");
        return;
      }

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
      toast.error("Error validating project details");
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

      // Create parameters in the format expected by the hook
      const params = {
        loanAmountRequested: loanAmount, // Keep as string, hook will convert
        requestedTenor: tenorDays, // Keep as string, hook will convert
        fundingDeadline: "2592000", // 30 days in seconds
        metadataCID: formattedCID
      };
      
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
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-zinc-300">Project Name</Label>
              <Input 
                id="projectName" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                placeholder="e.g., Sunny Meadows Solar Farm" 
                className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-zinc-300">Project Description</Label>
              <Textarea 
                id="projectDescription" 
                value={projectDescription} 
                onChange={(e) => setProjectDescription(e.target.value)} 
                placeholder="Describe your project, its impact, and goals." 
                className="min-h-[80px] bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectLocation" className="text-zinc-300">Project Location</Label>
              <Input 
                id="projectLocation" 
                value={projectLocation} 
                onChange={(e) => setProjectLocation(e.target.value)} 
                placeholder="e.g., California, USA" 
                className="h-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loanAmount" className="text-zinc-300">Loan Amount (USDC)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  id="loanAmount" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(e.target.value)} 
                  type="number" 
                  placeholder="Enter total project cost" 
                  className="h-10 pl-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                />
              </div>
              <p className="text-xs text-zinc-500">
                This is the total project cost (100% of financing needed)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tenorDays" className="text-zinc-300">Loan Tenor (Days)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  id="tenorDays" 
                  value={tenorDays} 
                  onChange={(e) => setTenorDays(e.target.value)} 
                  type="number" 
                  placeholder="Loan duration in days" 
                  className="h-10 pl-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                />
              </div>
              <p className="text-xs text-zinc-500">
                Duration of the loan in days (e.g., 365 for one year)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metadataCID" className="text-zinc-300">Project Metadata CID</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  id="metadataCID" 
                  value={metadataCID} 
                  onChange={(e) => setMetadataCID(e.target.value)}
                  placeholder="Enter IPFS CID for project metadata (e.g., Qm... or bafy...)" 
                  className="h-10 pl-10 bg-zinc-900/70 border-zinc-700 text-white focus:border-emerald-600" 
                />
              </div>
              <p className="text-xs text-zinc-500">
                Manually provide the IPFS Content ID (CID) for your project's metadata JSON.
              </p>
            </div>

            {/* Deposit calculation summary */}
            {depositAmount !== "0" && depositAmount !== "Error" && depositAmount !== "Calculating..." && depositPercentage !== null && (
              <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300 flex flex-col space-y-2">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                  <div>
                    <AlertTitle>Deposit Requirement ({depositPercentage}%)</AlertTitle>
                    <AlertDescription>
                      You will need to deposit {depositAmount} USDC.
                    </AlertDescription>
                  </div>
                </div>
                <div className="text-xs text-emerald-500 mt-1">
                  <div className="flex justify-between">
                    <span>Your USDC Balance:</span>
                    <span>{formattedUsdcBalance} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current USDC Allowance for Escrow:</span>
                    <span>{formattedAllowance} USDC</span>
                  </div>
                </div>
              </Alert>
            )}
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
                <span className="text-zinc-400">Loan Amount:</span>
                <span className="text-white">{loanAmount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Deposit Amount:</span>
                <span className="text-white">{depositAmount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Loan Tenor:</span>
                <span className="text-white">{tenorDays} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Metadata CID:</span>
                <span className="text-white truncate max-w-[200px]">{metadataCID}</span>
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
                <span className="text-white">{newProjectId}</span>
              </div>
              {vaultAddress && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Vault Address:</span>
                  <span className="text-white truncate max-w-[200px]">{vaultAddress}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Status:</span>
                <span className="text-white">{projectStatus}</span>
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
