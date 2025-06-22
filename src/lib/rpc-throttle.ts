class RPCThrottle {
  private activeRequests = 0;
  private maxConcurrent = 3;
  private requestQueue: Array<() => void> = [];
  private lastRequestTime = 0;
  private minDelay = 100; // 100ms minimum between requests

  async throttle<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const executeRequest = async () => {
        // Ensure minimum delay between requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minDelay) {
          await new Promise(resolve => setTimeout(resolve, this.minDelay - timeSinceLastRequest));
        }

        this.activeRequests++;
        this.lastRequestTime = Date.now();

        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.processQueue();
        }
      };

      if (this.activeRequests < this.maxConcurrent) {
        executeRequest();
      } else {
        this.requestQueue.push(executeRequest);
      }
    });
  }

  private processQueue() {
    if (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        nextRequest();
      }
    }
  }

  // Reset throttle when too many errors occur
  reset() {
    this.activeRequests = 0;
    this.requestQueue = [];
    this.lastRequestTime = 0;
  }
}

export const rpcThrottle = new RPCThrottle(); 