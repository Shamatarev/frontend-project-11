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
      .then((validData) => {
        const apiUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(validData)}`;
        return axios.get(apiUrl);
      })
      .then((response) => {
        const rssData = parseRSSData(response.data.contents);
        const newPosts = rssData.items;
        const newChannels = rssData.channel;

        // console.log(response.data);
        // console.log('rssData', rssData);
        // console.log('newPosts', newPosts);
        // console.log('newChannels', newChannels);

        // Обновление состояния приложения

        watchedState.posts = [...watchedState.posts, ...newPosts];
        watchedState.channels.push(newChannels);
        watchedState.url.push({ rssLink });
        watchedState.formProcess.state = 'success';
        console.log('Updated State:', watchedState);
        setTimeout(() => {
          watchedState.formProcess.state = 'filling';
        }, 2000); // 2 секунды задержки
      })
      .catch((error) => {
        console.error(error);
        watchedState.formProcess.error = 'errorNet';
        console.log('Updated State:', watchedState);
      })
      .catch((validationError) => {
        // console.log(`22222222222222222222222`);
        // console.log(validationError);

        watchedState.formProcess.error = validationError.message;
        console.error('Ошибки валидации', validationError.message);
        console.log('Updated State:', watchedState);
      });
  });
};

export default app;
