import utils from '../utils.js';

const NEXT_LINK = /<(.+)>.*rel="next"/;

export default async function* paginate(instance, url, config) {
  let next = url;
  let page = 0;

  while (next) {
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

  for await (const data of paginate(instance, url, config)) {
    data.forEach(async (item) => {
      items.push(await transform(item));
    });
  }

  return items;
}
