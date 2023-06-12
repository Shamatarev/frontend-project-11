export default function parseRSSData(rssData) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, 'application/xml');

  const channelElement = xmlDoc.querySelector('channel');
  const channelData = {
    title: channelElement?.querySelector('title')?.textContent || '',
    description: channelElement?.querySelector('description')?.textContent || '',
    link: channelElement?.querySelector('link')?.textContent || '',
    webMaster: channelElement?.querySelector('webMaster')?.textContent || '',
  };

  const itemElements = xmlDoc.querySelectorAll('item');
  const items = [];

  itemElements.forEach((itemElement, index) => {
    const title = itemElement?.querySelector('title')?.textContent || '';
    const guid = itemElement?.querySelector('guid')?.textContent || '';
    const link = itemElement?.querySelector('link')?.textContent || '';
    const description = itemElement?.querySelector('description')?.textContent || '';
    const pubDate = itemElement?.querySelector('pubDate')?.textContent || '';

    items.push({
      id: `${index}`,
      title,
      guid,
      link,
      description,
      pubDate,
    });
  });

  return {
    channel: channelData,
    items,
  };
}
