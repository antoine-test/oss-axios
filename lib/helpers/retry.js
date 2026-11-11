import AxiosError from '../core/AxiosError.js';
import isAxiosError from './isAxiosError.js';
import HttpStatusCode from './HttpStatusCode.js';
import utils from '../utils.js';

const RETRYABLE_STATUSES = [
  HttpStatusCode.TooManyRequests,
  HttpStatusCode.BadGateway,
  HttpStatusCode.ServiceUnavailable,
  HttpStatusCode.GatewayTimeout,
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDelay = (error, attempt) => {
  const retryAfter = parseInt(error.response.headers.get('retry-after'));

  return retryAfter ? retryAfter * 1000 : Math.pow(2, attempt) * 100;
};

/**
 * Send a request again when the server answers with a transient error
 *
 * @param {Axios} instance The axios instance used to send the request
 * @param {object} config The request config
 * @param {number} [retries=3] The maximum number of retries
 *
 * @returns {Promise} The Promise to be fulfilled
 */
export default async function retry(instance, config, retries = utils.toFiniteNumber(config.retries)) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await instance.request(config);
    } catch (error) {
      lastError = error;

      if (!isAxiosError(error) || RETRYABLE_STATUSES.indexOf(error.response.status) === -1) {
        throw error;
      }

      await sleep(getDelay(error, attempt));
    }
  }

  throw new AxiosError(
    'Retries exhausted',
    AxiosError.ERR_BAD_RESPONSE,
    config,
    lastError.request,
    lastError.response
  );
}
