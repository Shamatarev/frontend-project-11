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

  const fetchRSSData = (url) => {
    const allOriginsLink = 'https://allorigins.hexlet.app/get';
    const preparedURL = new URL(allOriginsLink);
    // preparedURL.searchParams.set('disableCache', 'true');
    preparedURL.searchParams.set('url', url);
    return new Promise((resolve, reject) => {
      axios.get(preparedURL)
        .then((response) => {
          // eslint-disable-next-line no-use-before-define
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
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
          // eslint-disable-next-line no-use-before-define
          const dataP = parseRSSData(rssData.contents, watchedState);
          dataP.items.forEach((post) => {
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
        // eslint-disable-next-line no-use-before-define
        if (watchedState.formProcess.state === 'updaiting') {
          setTimeout(() => {
          // eslint-disable-next-line no-use-before-define
            updatePosts(state);
          }, 5000);
        }
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
        const dataP = parseRSSData(rssData.contents, watchedState);
        watchedState.posts.push(...dataP.items);
        watchedState.channels.push(dataP.channel);
        watchedState.url.push({ rssLink });
        watchedState.formProcess.error = '';
        watchedState.formProcess.state = 'success';
        watchedState.formProcess.confirm = true;
        watchedState.formProcess.state = 'updaiting';
        if (watchedState.formProcess.state === 'updaiting') {
          setTimeout(() => {
            updatePosts(watchedState);
          }, 5000);
        }
      })
      .catch((validationError) => {
        console.log(1111111111111111, watchedState.formProcess.state !== 'success' && watchedState.formProcess.state !== 'updating');
        if (
          watchedState.formProcess.state !== 'success' && watchedState.formProcess.state !== 'updating'
        ) {
          if (validationError.message === 'Network Error') {
            watchedState.formProcess.confirm = false;
            watchedState.formProcess.state = 'filling';
            watchedState.formProcess.error = 'errorNet';
          } else {
            const errorMessage = validationError.message ?? 'defaultError';
            watchedState.formProcess.confirm = false;
            watchedState.formProcess.state = 'filling';
            watchedState.formProcess.error = errorMessage;
            console.error('Ошибки валидации', errorMessage);
          }
        }
      });
  });

  elements.urlInput.addEventListener('change', () => {
    watchedState.confirm = false;
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
        console.log('update state', watchedState);
      }
    }
  });
};

export default app;

app();
