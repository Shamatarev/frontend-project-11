import 'bootstrap';
import onChange from 'on-change';
import { setLocale, string } from 'yup';
import i18next from 'i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import parseRSSData from './rssParser.js';
import render from './view.js';
import resources from './locales/index.js';

const app = async () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

  const getUrls = (state) => state.map((url) => url.rssLink);

  const validate = (url, links) => {
    const schema = string()
      .trim()
      .required()
      .url()
      .notOneOf(links);
    return schema.validate(url);
  };

  const fetchRSSData = (url) => {
    const allOriginsLink = 'https://allorigins.hexlet.app/get';
    const preparedURL = new URL(allOriginsLink);
    preparedURL.searchParams.set('disableCache', 'true');
    preparedURL.searchParams.set('url', url);

    return axios.get(preparedURL)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  setLocale({
    mixed: { notOneOf: 'errorDuplicate' },
    string: { url: 'errorValidUrl', required: 'mustNotBeEmpty' },
  });

  const initialState = {
    process: {
      state: 'filling',
      error: '',

    },
    channels: [],
    posts: [],
    urls: [],
    readPosts: [], // список прочитанных постов
    postId: '', //  id читаемого поста
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    resetButton: document.querySelector('button'),
    urlInput: document.querySelector('#url-input'),
    feedbackP: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),

  };

  const watchedState = onChange(initialState, render(initialState, elements, i18nInstance));

  const updatePosts = () => {
    // console.log('112312313STATE', watchedState);
    const { posts } = watchedState;
    const channelLinks = Object.values(watchedState.urls).map((channel) => channel.rssLink);
    // console.log('channelLinks', channelLinks);

    const existingPostLinks = posts.map((post) => post.link); // уже добавленные посты
    const promises = channelLinks.map((channel) => fetchRSSData(channel)
      .then((rssData) => {
        const dataP = parseRSSData(rssData.contents, watchedState);
        // console.log('dataP', dataP);
        dataP.items.forEach((item) => {
          if (!existingPostLinks.includes(item.link)) {
            posts.push(item); // Добавление новых постов только если ссылка отсутствует
          }
        });
        watchedState.process.error = '';
        watchedState.process.state = 'updating';
      })
      .catch((error) => {
        console.error(error);
      }));

    Promise.all(promises).then(() => {
      setTimeout(updatePosts, 5000); // Запустить обновление постов снова через 5 секунд
    });
  };

  updatePosts(); // Запустить обновление постов при отправке формы

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const links = getUrls(watchedState.urls);
    const data = new FormData(e.target);
    const rssLink = data.get('url');

    // if (!rssLink) {
    //   return; // Если строка пустая, просто выходим из обработчика
    // }

    validate(rssLink, links)
      .then((validData) => fetchRSSData(validData))
      .then((rssData) => {
        const dataP = parseRSSData(rssData.contents, watchedState);
        watchedState.posts.push(...dataP.items);
        watchedState.channels.push(dataP.channel);
        watchedState.urls.push({ rssLink });
        watchedState.process.error = '';
        watchedState.process.state = 'success';
        watchedState.process.state = 'updaiting';
      })
      .catch((newError) => {
        if (newError.message === 'Network Error') {
          watchedState.process.state = 'filling';
          watchedState.process.error = 'errorNet';
        } else {
          const errorMessage = newError.message ?? 'defaultError';

          watchedState.process.state = 'filling';
          watchedState.process.error = errorMessage;
          console.error('Ошибки валидации', errorMessage);
        }

        if (watchedState.process.state !== 'updaiting' && newError.message === 'parseError') {
          watchedState.process.error = 'parseError';
        }
      });
  });

  elements.urlInput.addEventListener('change', () => {
    watchedState.process.state = 'filling';
    // console.log('update state', watchedState);
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const newClick = e.target;
    // console.log('newClick', newClick)
    const buttonPreSee = document.querySelector('.btn-outline-primary');
    // console.log('buttonPreSee', buttonPreSee)
    const postElements = document.getElementById(`${newClick.id}`);
    // console.log('postElements', postElements)
    // console.log(newClick.button === buttonPreSee.button)
    // console.log(newClick === postElements)
    if (newClick.button === buttonPreSee.button || newClick === postElements) {
      const postId = e.target.getAttribute('data-id') ?? e.target.getAttribute('id');
      if (postId !== null) {
        // console.log('postId', postId);
        watchedState.readPost = postId;
        if (!watchedState.readPosts.includes(postId)) {
          watchedState.readPosts.push(postId);
        }
        // console.log('update state', watchedState);
      }
    }
  });
};

export default app;

app();
