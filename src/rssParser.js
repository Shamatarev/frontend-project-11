export default function parseRSSData(rssData) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, 'application/xml');
  const channelElement = xmlDoc.querySelector('channel');
  const itemElements = xmlDoc.querySelectorAll('item');

  if (itemElements.length === 0 || !channelElement) {
    throw new Error('parseError');
  }

  const channelData = {
    title: channelElement.querySelector('title').textContent,
    description: channelElement.querySelector('description').textContent,
    link: channelElement.querySelector('link').textContent,
  };

  const items = [];
  itemElements.forEach((itemElement) => {
    const title = itemElement.querySelector('title').textContent;
    const link = itemElement.querySelector('link').textContent;
    const description = itemElement.querySelector('description').textContent;

    items.push({
      title,
      link,
      description,
    });
  });

  return {
    channel: channelData,
    items,
  };
}
