/** Browser shim: the rate-limiter-flexible package is CJS, while QuickJS expects a named import for RateLimiterMemory. */
export class RateLimiterMemory {
  constructor(_opts) {}
  async consume() {
    return Promise.resolve();
  }
}
