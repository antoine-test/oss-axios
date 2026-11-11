import utils from '../utils.js';

const NEXT_LINK = /<([^>]+)>;\s*rel="next"/;

export default async function* paginate(instance, url, config, maxPages = 100) {
  let next = url;
  let page = 0;

  while (next && page < maxPages) {
    const response = await instance.get(next, config);
    const match = NEXT_LINK.exec(response.headers.get('link') || '');

    page++;
    next = match ? match[1] : null;

    yield response.data;
  }
}

export async function collectAll(instance, url, config, transform = (item) => item) {
  const items = [];

  for await (const data of paginate(instance, url, config)) {
    if (!utils.isArray(data)) {
      continue;
    }

    for (const item of data) {
      items.push(await transform(item));
    }
  }

  return items;
}
