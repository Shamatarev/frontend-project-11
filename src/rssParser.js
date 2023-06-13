export default function parseRSSData(rssData, state) {
  const parser = new DOMParser();
  // console.log(1111111111111111111, parser)
  const xmlDoc = parser.parseFromString(rssData, 'application/xml');
  // console.log(222222222222222222, xmlDoc)
  const channelElement = xmlDoc.querySelector('channel');
  // console.log(33333333333333333, channelElement)
  if (!channelElement) {
    throw new Error('parseError: Некорректные данные RSS - элемент channel не найден');
  }
  const itemElements = xmlDoc.querySelectorAll('item');
  // console.log(444444444444, itemElements)
  if (itemElements.length === 0) {
    throw new Error('parseError: Некорректные данные RSS - элементы item не найдены');
  }
  const channelData = {
    title: channelElement.querySelector('title').textContent,
    description: channelElement.querySelector('description').textContent,
    link: channelElement.querySelector('link').textContent,
  };

  let id;
  if (state.posts.length > 0) {
    const lastPost = state.posts[state.posts.length - 1];
    id = parseInt(lastPost.id, 10) + 1; // Используем последний ID из состояния и увеличиваем на 1
  } else {
    id = 1; // Если состояние пустое, начинаем с ID 1
  }

  const items = [];
  itemElements.forEach((itemElement) => {
    const title = itemElement.querySelector('title').textContent;
    const link = itemElement.querySelector('link').textContent;
    const description = itemElement.querySelector('description').textContent;

    items.push({
      id: `${id}`, // Присваиваем уникальный ID
      title,
      link,
      description,
    });

    id += 1; // Увеличиваем ID на 1
  });

  return {
    channel: channelData,
    items,
  };
}
