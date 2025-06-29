import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

interface DebugInfo {
  isKycVerified: boolean;
  hasMinimumBalance: boolean;
  hasCorrectAllowance: boolean;
  canCallCreateProject: boolean;
  contractsAccessible: boolean;
  debugInfo: {
    walletAddress: string;
    kycStatus: boolean | undefined;
    usdcBalance: string;
    requiredDeposit: string;
    currentAllowance: string;
    requiredAllowance: string;
    contractAddresses: {
      projectFactory: string;
      developerRegistry: string;
      depositEscrow: string;
      usdc: string;
    };
    error?: string;
  };
}

interface DebugPanelProps {
  debugInfo: DebugInfo;
  isVisible: boolean;
}

export function DebugPanel({ debugInfo, isVisible }: DebugPanelProps) {
  if (!isVisible) return null;

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge 
        variant={status ? "default" : "destructive"}
        className={status ? "bg-[#4CAF50] hover:bg-[#4CAF50]/90" : ""}
      >
        {getStatusIcon(status)}
        <span className="ml-1">{label}</span>
      </Badge>
    );
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-700 mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Project Creation Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prerequisites Status */}
        <div>
          <h4 className="text-xs font-medium text-zinc-400 mb-2">Prerequisites Status</h4>
          <div className="grid grid-cols-2 gap-2">
            {getStatusBadge(debugInfo.isKycVerified, "KYC Verified")}
            {getStatusBadge(debugInfo.hasMinimumBalance, "Sufficient Balance")}
            {getStatusBadge(debugInfo.hasCorrectAllowance, "Correct Allowance")}
            {getStatusBadge(debugInfo.contractsAccessible, "Contracts Accessible")}
          </div>
        </div>

        {/* Balance Information */}
        <div>
          <h4 className="text-xs font-medium text-zinc-400 mb-2">Balance & Allowance</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-400">USDC Balance:</span>
              <span className="text-white">{debugInfo.debugInfo.usdcBalance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Required Deposit:</span>
              <span className="text-[#4CAF50]">{debugInfo.debugInfo.requiredDeposit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Current Allowance:</span>
              <span className="text-white">{debugInfo.debugInfo.currentAllowance}</span>
            </div>
          </div>
        </div>

        {/* Contract Addresses */}
        <div>
          <h4 className="text-xs font-medium text-zinc-400 mb-2">Contract Addresses</h4>
          <div className="text-xs space-y-1 font-mono">
            <div>
              <span className="text-zinc-400">ProjectFactory:</span>
              <div className="text-[#4CAF50] break-all">{debugInfo.debugInfo.contractAddresses.projectFactory}</div>
            </div>
            <div>
              <span className="text-zinc-400">DepositEscrow:</span>
              <div className="text-[#4CAF50] break-all">{debugInfo.debugInfo.contractAddresses.depositEscrow}</div>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <Alert className={`border ${debugInfo.canCallCreateProject ? 'border-[#4CAF50]/30 bg-[#4CAF50]/10' : 'border-red-500/30 bg-red-500/10'}`}>
          <AlertCircle className={`h-4 w-4 ${debugInfo.canCallCreateProject ? 'text-[#4CAF50]' : 'text-red-500'}`} />
          <AlertDescription className={debugInfo.canCallCreateProject ? 'text-[#4CAF50]' : 'text-red-400'}>
            {debugInfo.canCallCreateProject 
              ? "✅ All prerequisites met. Ready to create project!"
              : "❌ Prerequisites not met. Please resolve the issues above before proceeding."
            }
          </AlertDescription>
        </Alert>

        {/* Error Information */}
        {debugInfo.debugInfo.error && (
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-400">
              <strong>Contract Error:</strong> {debugInfo.debugInfo.error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 