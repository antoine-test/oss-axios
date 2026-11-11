import buildURL from './buildURL.js';
import buildFullPath from '../core/buildFullPath.js';
import combineURLs from './combineURLs.js';
import isAbsoluteURL from './isAbsoluteURL.js';

/**
 * Compute the final URL of a request config, including the base URL and the serialized params
 *
 * @param {object} config The request config
 *
 * @returns {string} The resolved URL
 */
export default function getRequestURI(config) {
  const fullPath = buildFullPath(config.baseURL, config.url, config);

  return buildURL(fullPath, config.params, config.paramsSerializer);
}


/**
 * Resolve an endpoint against a base URL
 *
 * @param {string} baseURL The base URL
 * @param {string} url The endpoint, absolute or relative
 *
 * @returns {string} The resolved endpoint
 */
export function resolveEndpoint(baseURL, url) {
  return isAbsoluteURL(url) ? url : combineURLs(url, baseURL);
}
