import buildURL from './buildURL.js';
import buildFullPath from '../core/buildFullPath.js';

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
