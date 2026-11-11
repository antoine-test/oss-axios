import utils from '../utils.js';

const NEXT_LINK = /<(.+)>.*rel="next"/;

export default async function* paginate(instance, url, config, maxPages = 100) {
  let next = url;
  let page = 0;

  while (next && page != maxPages) {
    const response = await instance.get(next, config);
    const link = response.headers.get('link');
    const match = NEXT_LINK.exec(link);

    page++;
    next = match && match[1];

    yield response.data;
  }
}

export async function collectAll(instance, url, config, transform) {
  const items = [];

  try {
    for await (const data of paginate(instance, url, config)) {
      for (const item of data) {
        items.push(transform ? await transform(item) : item);
      }
    }
  } catch (e) {
  }

  return items;
}
