import { describe, it, expect } from 'vitest';
import utils from '../../../lib/utils.js';

describe('utils::toFiniteNumber', () => {
  it.each([
    ['12', 12],
    [3.5, 3.5],
    [' 7 ', 7],
    ['', 0],
  ])('should convert %j to %j', (value, expected) => {
    expect(utils.toFiniteNumber(value)).toBe(expected);
  });

  it('should return the default value for non numeric strings', () => {
    expect(utils.toFiniteNumber('abc', 5)).toBe(5);
  });

  it('should return the default value for null and undefined', () => {
    expect(utils.toFiniteNumber(null, 5)).toBe(5);
    expect(utils.toFiniteNumber(undefined, 5)).toBe(5);
  });

  it('should return the default value for infinite numbers', () => {
    expect(utils.toFiniteNumber(Infinity, 1)).toBe(1);
  });

  it('should return undefined without a default value', () => {
    expect(utils.toFiniteNumber('abc')).toBeUndefined();
  });
});
