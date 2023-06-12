export default function parseRSSData(rssData, state) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, 'application/xml');

  const channelElement = xmlDoc.querySelector('channel');
  const channelData = {
    title: channelElement.querySelector('title').textContent,
    description: channelElement.querySelector('description').textContent,
    link: channelElement.querySelector('link').textContent,
    webMaster: channelElement.querySelector('webMaster').textContent,
  };

  const itemElements = xmlDoc.querySelectorAll('item');
  const items = [];

  itemElements.forEach((itemElement, index) => {
    const title = itemElement.querySelector('title').textContent;
    const guid = itemElement.querySelector('guid').textContent;
    const link = itemElement.querySelector('link').textContent;
    const description = itemElement.querySelector('description').textContent;
    const pubDate = itemElement.querySelector('pubDate').textContent;

    const id = String(index + 1 + state.posts.length); // Генерируем уникальный id для каждого поста
    items.push({
      id,
      title,
      guid,
      link,
      description,
      pubDate,
    });
  });

  return {
    channel: channelData,
    items: [...state.posts, ...items], // Добавляем новые посты к существующим в состоянии
  };
}
