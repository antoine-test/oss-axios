import { describe, it, expect, vi } from 'vitest';
import callbackify from '../../../lib/helpers/callbackify.js';

describe('helpers::callbackify', () => {
  it('should return non async functions untouched', () => {
    const fn = () => 1;

    expect(callbackify(fn)).toBe(fn);
  });

  it('should pass the resolved value to the callback', async () => {
    const cb = vi.fn();
    const wrapped = callbackify(async (a, b) => a + b);

    wrapped(1, 2, cb);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(cb).toHaveBeenCalledWith(null, 3);
  });

  it('should pass the rejection to the callback', async () => {
    const cb = vi.fn();
    const error = new Error('boom');
    const wrapped = callbackify(async () => {
      throw error;
    });

    wrapped(cb);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(cb).toHaveBeenCalledWith(error);
  });

  it('should spread the reduced value', async () => {
    const cb = vi.fn();
    const wrapped = callbackify(
      async () => ({ a: 1, b: 2 }),
      (value) => [value.a, value.b]
    );

    wrapped(cb);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(cb).toHaveBeenCalledWith(null, 1, 2);
  });
});
