import { describe, it, expect } from 'vitest';
import AxiosHeaders from '../../../lib/core/AxiosHeaders.js';
import {
  sanitizeHeaderValue,
  sanitizeByteStringHeaderValue,
  toByteStringHeaderObject,
} from '../../../lib/helpers/sanitizeHeaderValue.js';

describe('helpers::sanitizeHeaderValue', () => {
  it('should strip control characters', () => {
    expect(sanitizeHeaderValue('foo\u0000bar\u007f')).toBe('foobar');
  });

  it('should remove line breaks to prevent header injection', () => {
    expect(sanitizeHeaderValue('foo\r\nX-Injected: 1')).toBe('fooX-Injected: 1');
  });

  it('should trim leading and trailing spaces and tabs', () => {
    expect(sanitizeHeaderValue(' \t foo \t ')).toBe('foo');
  });

  it('should keep tabs inside the value', () => {
    expect(sanitizeHeaderValue('foo\tbar')).toBe('foo\tbar');
  });

  it('should sanitize every item of an array', () => {
    expect(sanitizeHeaderValue(['a\nb', ' c '])).toEqual(['ab', 'c']);
  });

  it('should coerce non string values', () => {
    expect(sanitizeHeaderValue(42)).toBe('42');
  });
});

describe('helpers::sanitizeByteStringHeaderValue', () => {
  it('should keep latin-1 characters', () => {
    expect(sanitizeByteStringHeaderValue('café')).toBe('café');
  });

  it('should drop characters outside of the byte string range', () => {
    expect(sanitizeByteStringHeaderValue('a中b')).toBe('ab');
  });
});

describe('helpers::toByteStringHeaderObject', () => {
  it('should sanitize every header value', () => {
    const result = toByteStringHeaderObject(new AxiosHeaders({ 'X-Test': 'café中' }));

    expect(result['X-Test']).toBe('café');
  });

  it('should return an object without prototype', () => {
    const result = toByteStringHeaderObject(new AxiosHeaders({ 'X-Test': 'a' }));

    expect(Object.getPrototypeOf(result)).toBeNull();
  });
});
