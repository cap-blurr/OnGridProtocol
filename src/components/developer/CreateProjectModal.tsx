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
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove, USDC_DECIMALS } from "@/hooks/contracts/useUSDC";
import { useContractAddresses } from "@/hooks/contracts/useDeveloperRegistry";
import { useContractRead, useWatchContractEvent } from "wagmi";
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
  RefreshCw
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";
import ProjectFactoryABI from "@/contracts/abis/ProjectFactory.json";
import ConstantsABI from "@/contracts/abis/Constants.json";
import { useProjectFactory } from "@/hooks/contracts/useProjectFactory";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

// Steps in the project creation flow
enum ProjectCreationStep {
  DETAILS = 0,
  APPROVE = 1,
  CREATE = 2,
  COMPLETE = 3
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
  const [currentStep, setCurrentStep] = useState<ProjectCreationStep>(ProjectCreationStep.DETAILS);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [vaultAddress, setVaultAddress] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  
  // Get connected account
  const { address: developerAddress, isConnected } = useAccount();
  
  // Get contract addresses
  const addresses = useContractAddresses();

  // Get USDC balance
  const { balance: usdcBalance, formattedBalance: formattedUsdcBalance, refetch: refetchBalance } = 
    useUSDCBalance(developerAddress);

  // Get USDC allowance for DeveloperDepositEscrow
  const { allowance: usdcAllowance, formattedAllowance, refetch: refetchAllowance } = 
    useUSDCAllowance(developerAddress, addresses.developerDepositEscrow as `0x${string}`);

  // USDC approve function
  const { approve, isLoading: isApproving, isSuccess: isApproveSuccess } = useUSDCApprove();

  // Get constants from the Constants contract
  const { data: developerDepositBps } = useContractRead({
    address: addresses.constants as `0x${string}`,
    abi: ConstantsABI.abi,
    functionName: 'DEVELOPER_DEPOSIT_BPS',
  });

  const { data: basisPointsDenominator } = useContractRead({
    address: addresses.constants as `0x${string}`,
    abi: ConstantsABI.abi,
    functionName: 'BASIS_POINTS_DENOMINATOR',
  });

  // Use the updated hook for project creation
  const { 
    createProject, 
    isLoading: isCreating, 
    isSuccess: isCreateSuccess,
    projectEvents 
  } = useProjectFactory().useCreateProject();

  // Monitor project events for completion
  useEffect(() => {
    if (projectEvents.length > 0 && currentStep === ProjectCreationStep.CREATE) {
      // Get the most recent event
      const latestEvent = projectEvents[projectEvents.length - 1];
      
      if (latestEvent.type === 'high-value') {
        const { projectId, vaultAddress } = latestEvent.data;
        setNewProjectId(projectId.toString());
        setVaultAddress(vaultAddress);
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

  // Calculate deposit amount when loan amount or constants change
  useEffect(() => {
    if (loanAmount && developerDepositBps && basisPointsDenominator) {
      try {
        const loanAmountBigInt = parseUnits(loanAmount, USDC_DECIMALS);
        const calculatedDeposit = (loanAmountBigInt * BigInt(developerDepositBps as number)) / BigInt(basisPointsDenominator as number);
        setDepositAmount(formatUnits(calculatedDeposit, USDC_DECIMALS));
      } catch (err) {
        console.error("Error calculating deposit amount:", err);
        setDepositAmount("0");
      }
    } else {
      setDepositAmount("0");
    }
  }, [loanAmount, developerDepositBps, basisPointsDenominator]);

  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      // Reset everything when modal is closed
      setTimeout(() => {
        setProjectName("");
        setProjectDescription("");
        setProjectLocation("");
        setLoanAmount("");
        setTenorDays("365");
        setMetadataCID("");
        setDepositAmount("0");
        setCurrentStep(ProjectCreationStep.DETAILS);
        setNewProjectId(null);
        setVaultAddress(null);
        setProjectStatus(null);
      }, 300);
    } else {
      // Refresh balances and allowances when modal opens
      refetchBalance();
      refetchAllowance();
    }
  }, [isOpen, refetchBalance, refetchAllowance]);

  // Move to next step when approval succeeds
  useEffect(() => {
    if (isApproveSuccess && currentStep === ProjectCreationStep.APPROVE) {
      refetchAllowance();
      setCurrentStep(ProjectCreationStep.CREATE);
    }
  }, [isApproveSuccess, currentStep, refetchAllowance]);

  // Handle form submission - validate inputs
  const handleDetailsSubmit = async () => {
    try {
      // Basic validation
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
      
      if (!tenorDays || parseInt(tenorDays) <= 0) {
        toast.error("Please enter a valid loan tenor");
        return;
      }
      
      // --- Save to Supabase and generate metadataCID ---
      const generatedSupabaseProjectId = uuidv4(); // For Supabase project_id column
      let finalMetadataCID = ``;

      const metadataToSave = {
        project_id: generatedSupabaseProjectId, // Use generated UUID for Supabase's project_id
        name: projectName,
        description: projectDescription,
        location: projectLocation,
        // images: projectImageCID ? JSON.stringify([projectImageCID]) : JSON.stringify([]) // Example if you add image field
      };

      toast.loading("Saving project details...", { id: "supabaseSave" });
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('project_metadata')
        .insert(metadataToSave)
        .select('id') // Select the internal id generated by Supabase
        .single(); // We expect a single record

      if (supabaseError) {
        console.error("Error saving to Supabase:", supabaseError);
        toast.error(`Failed to save project metadata: ${supabaseError.message}`, { id: "supabaseSave" });
        // For testing, we can fallback to a placeholder if Supabase fails
        finalMetadataCID = `error_fallback_uuid:${uuidv4()}`;
        // return; // Optionally, you could stop here if Supabase save is critical
      } else {
        toast.success("Project details saved!", { id: "supabaseSave" });
        // Use the internal Supabase row 'id' (UUID) as the metadataCID for the contract
        // Or you could use the generatedSupabaseProjectId if your contract expects that format
        finalMetadataCID = supabaseData.id; 
        console.log("Supabase save successful, internal ID:", supabaseData.id);
        console.log("Using Supabase internal ID as metadataCID for contract:", finalMetadataCID);
      }
      setMetadataCID(finalMetadataCID); // Set the state for the contract call
      // -- End Supabase Integration --
      
      // Check if USDC balance is sufficient for deposit
      if (usdcBalance && parseUnits(depositAmount, USDC_DECIMALS) > usdcBalance) {
        toast.error(`Insufficient USDC balance. You need ${depositAmount} USDC for the deposit.`);
        return;
      }
      
      // Check if approval is needed
      if (usdcAllowance && parseUnits(depositAmount, USDC_DECIMALS) > usdcAllowance) {
        // Need to approve
        setCurrentStep(ProjectCreationStep.APPROVE);
      } else {
        // Already approved, proceed to create project
        setCurrentStep(ProjectCreationStep.CREATE);
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      toast.error("Invalid input values. Please check and try again.");
    }
  };

  // Handle approval
  const handleApprove = () => {
    if (!developerAddress) {
      toast.error("Wallet not connected");
      return;
    }
    
    // Approve exact amount
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
    
    if (!metadataCID) {
      toast.error("Metadata CID not generated. Please ensure project details were saved.");
      return;
    }
    
    try {
      const params = {
        loanAmountRequested: parseUnits(loanAmount, USDC_DECIMALS),
        requestedTenor: BigInt(parseInt(tenorDays)),
        metadataCID: metadataCID
      };
      
      createProject(params);
    } catch (err) {
      console.error("Error creating project:", err);
      toast.error("Failed to create project. Please try again.");
    }
  };

  // Content for each step
  const renderStepContent = () => {
    switch (currentStep) {
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
              <Label htmlFor="metadataCID" className="text-zinc-300">Project Metadata CID (Auto-generated)</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  id="metadataCID" 
                  value={metadataCID} 
                  readOnly 
                  placeholder="Will be generated from project details" 
                  className="h-10 pl-10 bg-zinc-800/70 border-zinc-700 text-zinc-400 focus:border-emerald-600 cursor-not-allowed" 
                />
              </div>
              <p className="text-xs text-zinc-500">
                This will be automatically generated after saving project details.
              </p>
            </div>
            
            {/* Deposit calculation summary */}
            {depositAmount !== "0" && (
              <Alert className="bg-emerald-900/30 border-emerald-700 text-emerald-300 flex flex-col space-y-2">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                  <div>
                    <AlertTitle>Deposit Requirement</AlertTitle>
                    <AlertDescription>
                      You will need to deposit {depositAmount} USDC as a 20% project deposit.
                    </AlertDescription>
                  </div>
                </div>
                <div className="text-xs text-emerald-500 mt-1">
                  <div className="flex justify-between">
                    <span>Your USDC Balance:</span>
                    <span>{formattedUsdcBalance} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current USDC Allowance:</span>
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
