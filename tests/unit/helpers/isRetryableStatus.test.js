import { describe, it, expect } from 'vitest';
import isRetryableStatus from '../../../lib/helpers/isRetryableStatus.js';

describe('helpers::isRetryableStatus', () => {
  it.each([408, 429, 500, 502, 503, 504])('should retry on %i', (status) => {
    expect(isRetryableStatus(status)).toBe(true);
  });

  it.each([200, 301, 400, 401, 404, 501])('should not retry on %i', (status) => {
    expect(isRetryableStatus(status)).toBe(false);
  });

  it('should not retry on non numeric statuses', () => {
    expect(isRetryableStatus('503')).toBe(false);
    expect(isRetryableStatus(undefined)).toBe(false);
  });
});
