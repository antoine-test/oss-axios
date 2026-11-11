import HttpStatusCode from './HttpStatusCode.js';

const RETRYABLE_STATUSES = new Set([
  HttpStatusCode.RequestTimeout,
  HttpStatusCode.TooManyRequests,
  HttpStatusCode.InternalServerError,
  HttpStatusCode.BadGateway,
  HttpStatusCode.ServiceUnavailable,
  HttpStatusCode.GatewayTimeout,
]);

/**
 * Determines whether a request that failed with the given status is worth retrying
 *
 * @param {number} status The HTTP status code of the response
 *
 * @returns {boolean} True if the status is transient, otherwise false
 */
export default function isRetryableStatus(status) {
  return RETRYABLE_STATUSES.has(status);
}
