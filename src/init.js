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

  const getUrls = (channels) => channels.map((channel) => channel.rssLink);

  const validate = (url, links) => {
    const schema = string()
      .trim()
      .required()
      .url()
      .notOneOf(getUrls(links));
    return schema.validate(url);
  };

  const fetchRSSData = async (url) => {
    try {
      const apiUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl);
      // eslint-disable-next-line no-use-before-define
      return parseRSSData(response.data.contents, watchedState);
    } catch (error) {
      console.error(error);
      throw new Error('errorNet');
    }
  };

  setLocale({
    mixed: { notOneOf: 'errorDuplicate' },
    string: { url: 'errorValidUrl', required: 'mustNotBeEmpty' },
  });

  const updatePosts = (state) => {
    const promises = state.url.map((channel) => fetchRSSData(channel.rssLink));
    Promise.all(promises)
      .then((rssDataList) => {
        const newPosts = [];
        rssDataList.forEach((rssData) => {
          rssData.items.forEach((post) => {
            if (!state.posts.some((existingPost) => existingPost.title === post.title)) {
              newPosts.push(post);
            }
          });
        });

        state.posts.push(...newPosts);
        // eslint-disable-next-line no-use-before-define
        watchedState.formProcess.state = 'success';
        // eslint-disable-next-line no-use-before-define
        watchedState.formProcess.state = 'updaiting';
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setTimeout(() => {
          // eslint-disable-next-line no-use-before-define
          if (watchedState.formProcess.state === 'updaiting') {
            updatePosts(state);
          }
        }, 5000);
      });
  };

  const initialState = {
    formProcess: {
      state: 'filling',
      error: '',
      confirm: false,
    },
    channels: [],
    posts: [],
    url: [],
    readPosts: [], // список прочитанных постов
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    resetButton: document.querySelector('button'),
    urlInput: document.querySelector('#url-input'),
    feedbackP: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),

  };

  const watchedState = onChange(initialState, render(initialState, elements, i18nInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const rssLink = data.get('url');
    if (!rssLink) {
      return; // Если строка пустая, просто выходим из обработчика
    }
    validate(rssLink, watchedState.url)
      .then((validData) => fetchRSSData(validData))
      .then((rssData) => {
        watchedState.posts.push(...rssData.items);
        watchedState.channels.push(rssData.channel);
        watchedState.url.push({ rssLink });
        watchedState.formProcess.state = 'success';
        watchedState.formProcess.confirm = true;
        setTimeout(() => {
          if (watchedState.formProcess.state === 'updaiting') {
            updatePosts(watchedState);
          }
        }, 5000);
        watchedState.formProcess.state = 'updaiting';
      })
      .catch((validationError) => {
        console.log(validationError);
        watchedState.formProcess.confirm = false;
        watchedState.formProcess.state = 'filling';
        const errorMessage = validationError.message ?? 'defaultError';
        watchedState.formProcess.error = errorMessage;
        console.log('update state', watchedState);
        console.error('Ошибки валидации', errorMessage);
      });
  });

  elements.urlInput.addEventListener('change', () => {
    watchedState.formProcess.state = 'filling';
    console.log('update state', watchedState);
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const activClic = e.target;
    const buttonPreSee = document.querySelector('.btn-outline-primary');

    if (activClic.button === buttonPreSee.button) {
      const postId = e.target.getAttribute('data-id');
      if (postId !== null && !watchedState.readPosts.includes(postId)) {
        watchedState.readPosts.push(postId);
      }
    }
  });
};

export default app;

app();
