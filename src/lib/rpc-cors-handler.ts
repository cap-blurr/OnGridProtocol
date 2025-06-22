/**
 * RPC CORS Error Handler
 * Specifically designed to handle CORS errors from Alchemy and other RPC providers
 */

export interface CORSError {
  isCORSError: boolean;
  message: string;
  provider: string;
  timestamp: Date;
}

export class RPCCORSHandler {
  private static instance: RPCCORSHandler;
  private corsErrors: CORSError[] = [];
  private errorCallback?: (error: CORSError) => void;

  static getInstance(): RPCCORSHandler {
    if (!RPCCORSHandler.instance) {
      RPCCORSHandler.instance = new RPCCORSHandler();
    }
    return RPCCORSHandler.instance;
  }

  private constructor() {
    this.setupGlobalErrorHandling();
  }

  private setupGlobalErrorHandling() {
    // Override fetch to catch CORS errors immediately
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await originalFetch(input, init);
        return response;
      } catch (error: any) {
        const url = typeof input === 'string' ? input : input.toString();
        
        // Detect CORS errors specifically
        if (this.isCORSError(error, url)) {
          const corsError: CORSError = {
            isCORSError: true,
            message: error.message,
            provider: this.extractProvider(url),
            timestamp: new Date()
          };
          
          this.handleCORSError(corsError);
        }
        
        throw error;
      }
    };

    // Monitor for unhandled promise rejections (often from CORS)
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      if (error && this.isCORSError(error, '')) {
        const corsError: CORSError = {
          isCORSError: true,
          message: error.message || 'CORS policy violation',
          provider: 'Unknown RPC',
          timestamp: new Date()
        };
        
        this.handleCORSError(corsError);
      }
    });
  }

  private isCORSError(error: any, url: string): boolean {
    if (!error) return false;
    
    const message = error.message || error.toString();
    const isCORSMessage = message.includes('CORS') || 
                         message.includes('Access-Control-Allow-Origin') ||
                         message.includes('Failed to fetch') ||
                         message.includes('net::ERR_FAILED');
    
    const isRPCUrl = url.includes('alchemy.com') || 
                     url.includes('infura.io') ||
                     url.includes('quiknode.pro') ||
                     url.includes('rpc');
    
    return isCORSMessage && (isRPCUrl || url.includes('rpc'));
  }

  private extractProvider(url: string): string {
    if (url.includes('alchemy.com')) return 'Alchemy';
    if (url.includes('infura.io')) return 'Infura';
    if (url.includes('quiknode.pro')) return 'QuickNode';
    return 'RPC Provider';
  }

  private handleCORSError(corsError: CORSError) {
    console.warn('🚫 CORS Error Detected:', corsError);
    this.corsErrors.push(corsError);
    
    // Keep only last 10 errors
    if (this.corsErrors.length > 10) {
      this.corsErrors = this.corsErrors.slice(-10);
    }
    
    // Notify callback if registered
    if (this.errorCallback) {
      this.errorCallback(corsError);
    }
  }

  public onCORSError(callback: (error: CORSError) => void) {
    this.errorCallback = callback;
  }

  public getRecentErrors(): CORSError[] {
    return [...this.corsErrors];
  }

  public hasRecentCORSErrors(timeWindowMs: number = 60000): boolean {
    const cutoff = new Date(Date.now() - timeWindowMs);
    return this.corsErrors.some(error => error.timestamp > cutoff);
  }

  public clearErrors() {
    this.corsErrors = [];
  }

  public generateDiagnosticReport(): string {
    const domain = window.location.hostname;
    const protocol = window.location.protocol;
    const recentErrors = this.hasRecentCORSErrors();
    
    return `
🔍 RPC CORS Diagnostic Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Domain: ${protocol}//${domain}
Recent CORS Errors: ${recentErrors ? 'YES' : 'NO'}
Error Count (last hour): ${this.corsErrors.length}

${recentErrors ? `
⚠️  IMMEDIATE ACTION NEEDED:
1. Configure your RPC provider to allow: ${domain}
2. Check your Alchemy dashboard settings
3. Verify domain whitelist includes production domain

Latest Errors:
${this.corsErrors.slice(-3).map(e => `- ${e.provider}: ${e.message}`).join('\n')}
` : '✅ No recent CORS errors detected'}

🛠️  Configuration Steps:
1. Login to https://dashboard.alchemy.com
2. Navigate to your app settings
3. Add ${domain} to allowed origins
4. Save and wait 2-3 minutes for propagation

For Alchemy specifically:
- Go to App Settings → Security
- Add "${domain}" to CORS Origins
- Include both www and non-www versions if needed
    `;
  }
}

// Export singleton instance
export const rpcCORSHandler = RPCCORSHandler.getInstance();

// Utility function to check if current environment has CORS issues
export function useRPCCORSStatus() {
  const handler = RPCCORSHandler.getInstance();
  return {
    hasRecentErrors: handler.hasRecentCORSErrors(),
    getReport: () => handler.generateDiagnosticReport(),
    clearErrors: () => handler.clearErrors()
  };
} 