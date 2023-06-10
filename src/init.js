import 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import parseRSSData from './rssParser.js';
import render from './view.js';
import ru from './locales/ru.js';

const app = async () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources: { ru },
  });

  const getUrls = (channels) => channels.map((channel) => channel.rssLink);

  const validate = (url, links) => {
    const schema = yup.string()
      .trim().required()
      .url(i18nInstance.t(`${i18nInstance.t('errorValidUrl')}`))
      .notOneOf(getUrls(links), i18nInstance.t('errorDuplicate'));
    return schema.validate(url);
  };

  const fetchRSSData = (url) => {
    const apiUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`;
    return axios.get(apiUrl)
      .then((response) => parseRSSData(response.data.contents))
      .catch((error) => {
        console.error(999999999999, error);
        throw new Error('errorNet');
      });
  };

  const updatePosts = (state) => {
    console.log("1111112222222222222", state)
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
        watchedState.formProcess.state = 'success';
        console.log('Updated State:', watchedState);
        setTimeout(() => {
          watchedState.formProcess.state = 'updaiting';
        }, 5000);
      })
      .catch((error) => {
        console.error(888888888888, error);
      })
      .finally(() => {
        setTimeout(() => {
          updatePosts(state);
        }, 5000);
      });
  };

  const initialState = {
    formProcess: {
      state: 'filling',
      error: '',
    },
    channels: [],
    posts: [],
    url: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    resetButton: document.querySelector('button'),
    urlInput: document.querySelector('#url-input'),
    feedbackP: document.querySelector('.feedback'),
  };

  const watchedState = onChange(initialState, render(initialState, elements, i18nInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const rssLink = data.get('url');
    validate(rssLink, watchedState.url)
      .then((validData) => fetchRSSData(validData))
      .then((rssData) => {
        console.log(1321231231, rssData);
        watchedState.posts.push(...rssData.items);
        watchedState.channels.push(rssData.channel);
        watchedState.url.push({ rssLink });
        watchedState.formProcess.state = 'success';
        console.log('Updated State:', watchedState);
        setTimeout(() => {
          watchedState.formProcess.state = 'updaiting';
        }, 2000);
        setTimeout(() => {
          if (watchedState.formProcess.state === 'updaiting') {
            updatePosts(watchedState);
          }
        }, 6000);
      })
      .catch((validationError) => {
        watchedState.formProcess.error = validationError.message;
        console.error('Ошибки валидации', validationError.message);
        console.log('Updated State:', watchedState);
      });
  });



};

export default app;

app();
