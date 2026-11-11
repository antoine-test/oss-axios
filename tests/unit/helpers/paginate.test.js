import { describe, it, expect } from 'vitest';
import axios from '../../../lib/axios.js';
import paginate, { collectAll } from '../../../lib/helpers/paginate.js';

const pagesAdapter = (pages) => (config) => {
  const index = Number(new URL(config.url).searchParams.get('page') || 1) - 1;
  const headers = {};

  if (index < pages.length - 1) {
    headers.link = `<http://localhost/items?page=${index + 2}>; rel="next"`;
  }

  return Promise.resolve({
    status: 200,
    statusText: 'OK',
    headers,
    data: pages[index],
    config,
    request: {},
  });
};

describe('helpers::paginate', () => {
  it('should yield every page following the next link', async () => {
    const adapter = pagesAdapter([[1, 2], [3], [4, 5]]);
    const pages = [];

    for await (const data of paginate(axios, 'http://localhost/items?page=1', { adapter })) {
      pages.push(data);
    }

    expect(pages).toEqual([[1, 2], [3], [4, 5]]);
  });

  it('should stop at maxPages', async () => {
    const adapter = pagesAdapter([[1], [2], [3]]);
    const pages = [];

    for await (const data of paginate(axios, 'http://localhost/items?page=1', { adapter }, 2)) {
      pages.push(data);
    }

    expect(pages).toHaveLength(2);
  });

  it('should collect and transform all the items', async () => {
    const adapter = pagesAdapter([[1, 2], [3]]);

    const items = await collectAll(axios, 'http://localhost/items?page=1', { adapter }, (n) => n * 10);

    expect(items).toEqual([10, 20, 30]);
  });
});
