import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, ExternalLink, Copy, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface CORSErrorBannerProps {
  isActive: boolean;
  hasCORSError: boolean;
  onRetry: () => void;
  getDiagnosticReport?: () => string;
}

export function CORSErrorBanner({ 
  isActive, 
  hasCORSError, 
  onRetry, 
  getDiagnosticReport 
}: CORSErrorBannerProps) {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isActive) return null;

  const copyDiagnostics = async () => {
    if (getDiagnosticReport) {
      await navigator.clipboard.writeText(getDiagnosticReport());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openAlchemyDashboard = () => {
    window.open('https://dashboard.alchemy.com', '_blank');
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Main Error Banner */}
      <Alert className={`${hasCORSError ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-orange-500/20 border-orange-500/50 text-orange-300'}`}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              {hasCORSError ? (
                <>🚫 <strong>CORS Error:</strong> RPC provider domain configuration needed. Displaying cached data.</>
              ) : (
                <>🚧 Blockchain connection temporarily limited. Displaying cached data.</>
              )}
            </span>
            {hasCORSError && (
              <Badge variant="destructive" className="text-xs">
                Production Issue
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasCORSError && getDiagnosticReport && (
              <Button
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-300 hover:bg-red-500/10"
              >
                <Info className="h-3 w-3 mr-1" />
                {showDiagnostics ? 'Hide' : 'Show'} Fix
              </Button>
            )}
            <Button 
              onClick={onRetry}
              variant="outline" 
              size="sm"
              className={`${hasCORSError ? 'border-red-500/50 text-red-300 hover:bg-red-500/10' : 'border-orange-500/50 text-orange-300 hover:bg-orange-500/10'}`}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Diagnostic Information */}
      {showDiagnostics && hasCORSError && getDiagnosticReport && (
        <Alert className="bg-blue-500/20 border-blue-500/50 text-blue-300">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">🛠️ Fix CORS Configuration</h4>
                <div className="flex gap-2">
                  <Button
                    onClick={copyDiagnostics}
                    variant="outline"
                    size="sm"
                    className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied ? 'Copied!' : 'Copy Report'}
                  </Button>
                  <Button
                    onClick={openAlchemyDashboard}
                    variant="outline"
                    size="sm"
                    className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Alchemy Dashboard
                  </Button>
                </div>
              </div>
              
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/30">
                <h5 className="font-medium text-white mb-2">Quick Fix Steps:</h5>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to <a href="https://dashboard.alchemy.com" target="_blank" rel="noopener noreferrer" className="underline">Alchemy Dashboard</a></li>
                  <li>Select your app → Settings → Security</li>
                  <li>Add <code className="bg-white/10 px-1 rounded">www.ongridprotocol.com</code> to CORS Origins</li>
                  <li>Add <code className="bg-white/10 px-1 rounded">ongridprotocol.com</code> to CORS Origins</li>
                  <li>Save and wait 2-3 minutes for propagation</li>
                </ol>
                <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-xs">
                  <strong>Good News:</strong> The app now uses multiple fallback RPC endpoints to minimize disruption. 
                  Most features should work without Alchemy configuration.
                </div>
              </div>

              <div className="text-xs text-blue-200">
                <strong>Current Domain:</strong> {window.location.hostname} | 
                <strong> Protocol:</strong> {window.location.protocol}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 