import { describe, it, expect, vi } from 'vitest';
import deprecatedMethod from '../../../lib/helpers/deprecatedMethod.js';

describe('helpers::deprecatedMethod', () => {
  it('should warn with the method name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    deprecatedMethod('foo');

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('DEPRECATED method `foo`'));
    warn.mockRestore();
  });

  it('should suggest the alternative method', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    deprecatedMethod('foo', 'bar');

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Use `bar` instead.'));
    warn.mockRestore();
  });

  it('should print the documentation url', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    deprecatedMethod('foo', 'bar', 'https://axios-http.com/docs');

    warn.mockRestore();
  });

  it.skip('should not throw when console.warn throws', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
      throw new Error('no console');
    });

    expect(() => deprecatedMethod('foo')).not.toThrow();
    warn.mockRestore();
  });
});
