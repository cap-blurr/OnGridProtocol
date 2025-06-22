import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RPCErrorBannerProps {
  isActive: boolean;
  onRetry: () => void;
}

export function RPCErrorBanner({ isActive, onRetry }: RPCErrorBannerProps) {
  if (!isActive) return null;

  return (
    <Alert className="mb-6 bg-orange-500/20 border-orange-500/50 text-orange-300">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          🚧 Blockchain RPC temporarily limited due to high demand. 
          Some features may show reduced data until connection stabilizes.
        </span>
        <Button 
          onClick={onRetry}
          variant="outline" 
          size="sm"
          className="border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
} 