// Time configuration
const INITIAL_TIMEOUT_PERIOD = 5000; // 5 seconds
const MAX_TIMEOUT_PERIOD = 180000; // 180 seconds

// Handle requests being sent to the target server
// @typescript-eslint/no-unused-vars
export function handleRequest(proxyReq, req, res) {
  if (req.method === 'POST') {
    const defaultTimeoutPeriod = INITIAL_TIMEOUT_PERIOD;

    req.session.isRequestRateLimited = false;

    // Try to retrieve the next timeout period from the session
    const nextTimeout = req.session.nextTimeout;

    // If there is no timeout period in the session, set it to the default
    const timeoutPeriod = nextTimeout || defaultTimeoutPeriod;

    // Check if the last document upload was completed within the timeout period
    const lastUploadTime = req.session.lastUploadTime || 0;
    const elapsedTime = Date.now() - lastUploadTime;

    if (elapsedTime < timeoutPeriod) {
      req.session.isRequestRateLimited = true;
      res.status(429).send({ message: 'Too many requests' });
      return false;
    }
  }
  return true;
}

// Handle responses being sent back to the client
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleResponse(proxyRes, req, res) {
  if (req.method === 'POST') {
    // Current time stored as the last time a document upload was completed
    req.session.lastUploadTime = Date.now();

    // Double the timeout period up to the maximum, if rate-limited
    if (req.session.isRequestRateLimited) {
      const nextTimeout = (req.session.nextTimeout || INITIAL_TIMEOUT_PERIOD) * 2;
      req.session.nextTimeout = Math.min(nextTimeout, MAX_TIMEOUT_PERIOD);
    } else {
      delete req.session.nextTimeout;
    }
  }
}
