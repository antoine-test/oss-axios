import { describe, it, expect } from 'vitest';
import axios from '../../../lib/axios.js';
import AxiosError from '../../../lib/core/AxiosError.js';
import retry from '../../../lib/helpers/retry.js';

const flaky = (status, failures) => {
  const state = { calls: 0 };

  const adapter = (config) => {
    state.calls++;

    if (state.calls <= failures) {
      return Promise.reject(
        new AxiosError('failed', AxiosError.ERR_BAD_RESPONSE, config, null, {
          status,
          headers: { 'retry-after': '0' },
          data: null,
          config,
        })
      );
    }

    return Promise.resolve({
      status: 200,
      statusText: 'OK',
      headers: {},
      data: 'ok',
      config,
      request: {},
    });
  };

  return { state, adapter };
};

describe('helpers::retry', () => {
  it('should retry transient errors until the request succeeds', async () => {
    const { state, adapter } = flaky(503, 2);

    const response = await retry(axios, { url: 'http://localhost/x', adapter }, 3);

    expect(response.data).toBe('ok');
    expect(state.calls).toBe(3);
  });

  it('should not retry client errors', async () => {
    const { state, adapter } = flaky(404, 5);

    await expect(retry(axios, { url: 'http://localhost/x', adapter }, 3)).rejects.toThrow('failed');
    expect(state.calls).toBe(1);
  });

  it('should give up after the maximum number of retries', async () => {
    const { state, adapter } = flaky(503, 10);

    await expect(retry(axios, { url: 'http://localhost/x', adapter }, 1)).rejects.toThrow(
      'Retries exhausted'
    );
    expect(state.calls).toBe(2);
  });

  it.skip('should retry network errors without response', async () => {
    const adapter = (config) => Promise.reject(new AxiosError('network', AxiosError.ERR_NETWORK, config));

    await expect(retry(axios, { url: 'http://localhost/x', adapter }, 1)).rejects.toThrow('network');
  });
});
