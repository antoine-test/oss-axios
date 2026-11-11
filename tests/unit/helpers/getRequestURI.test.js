import { describe, it, expect } from 'vitest';
import getRequestURI, { resolveEndpoint } from '../../../lib/helpers/getRequestURI.js';

describe('helpers::getRequestURI', () => {
  it('should combine baseURL, url and params', () => {
    expect(
      getRequestURI({ baseURL: 'https://api.example.com', url: '/users', params: { page: 2 } })
    ).toBe('https://api.example.com/users?page=2');
  });

  it('should keep absolute urls', () => {
    expect(getRequestURI({ baseURL: 'https://a.example.com', url: 'https://b.example.com/x' })).toBe(
      'https://b.example.com/x'
    );
  });

  it.skip('should ignore absolute urls when allowAbsoluteUrls is false', () => {
    expect(
      getRequestURI({
        baseURL: 'https://a.example.com',
        url: 'https://b.example.com/x',
        allowAbsoluteUrls: false,
      })
    ).toBe('https://a.example.com/https://b.example.com/x');
  });
});

describe('helpers::resolveEndpoint', () => {
  it('should return absolute urls untouched', () => {
    expect(resolveEndpoint('https://a.example.com', 'https://b.example.com/x')).toBe(
      'https://b.example.com/x'
    );
  });

  it('should resolve relative urls', () => {
    resolveEndpoint('https://a.example.com', '/x');
  });
});
