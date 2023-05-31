import 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
// import axios from 'axios';
// import parse from './rssparser.js';
import resources from './locales/ru.js';
import render from './view.js';

export default async () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

  const rssSchema = yup.object().shape({
    rssLink: yup.string().required(i18nInstance.t('completeUrl'))
      .url(i18nInstance.t('errorValidUrl'))
      .matches(
        /^(https?:\/\/)?([A-Za-z0-9_-]+\.)+[A-Za-z]{2,}(\/.*)*\/?$/,
        i18nInstance.t('errorValidUrl'),
      ),
    // .test('duplicate', i18nInstance.t('errorAddUrl'), async (value) => {
    //   //  проверка на дубликаты ссылок
    //   //  проверить значение value в списке ранее введенных ссылок
    //   const isDuplicate = await checkForDuplicate(value);
    //   return !isDuplicate;
    // }),
  });

  yup.setLocale({
    mixed: {
      required: i18nInstance.t('completeUrl'),
    },
    string: {
      url: i18nInstance.t('terrorValidUrl'),
    },
    // Другие сообщения для валидации
  });

  console.log('resources', resources);
  console.log('1', i18nInstance.t('completeUrl'));
  console.log('2', i18nInstance.t('errorValidUrl'));

  const initialState = {
    formProcess: {
      state: 'filling',
      error: '',
    },

    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    resetButton: document.querySelector('button'),
    urlInput: document.querySelector('#url-input'),
    feedbackP: document.querySelector('.feedback'),
  };

  const watchedState = onChange(initialState, render(initialState, elements, i18nInstance));
  console.log(watchedState);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const rssLink = data.get('url');
    // console.log('rssLink', rssLink);
    rssSchema
      .validate({ rssLink })
      .then((validData) => {
      // Валидация прошла успешно
        watchedState.formProcess.state = 'sending';
        console.log('Форма отправлена:', validData);
      }).catch((validationError) => {
        // Валидация завершилась с ошибками
        watchedState.formProcess.error = validationError.errors;
        watchedState.formProcess.state = 'waiting';
        console.error(validationError.errors);
      });
  });
};
