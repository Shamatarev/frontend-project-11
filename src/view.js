import * as yup from 'yup';
import onChange from 'on-change';

const rssSchema = yup.object().shape({
  rssLink: yup.string().required('Укажите RSS-ссылку')
    .url('Некорректный формат ссылки')
    .matches(
      /^(https?:\/\/)?([A-Za-z0-9_-]+\.)+[A-Za-z]{2,}(\/.*)*\/?$/,
      'Неверный формат RSS-ссылки',
    ),
  // .test('duplicate', 'RSS ссылка уже добавлена', async (value) => {
  //   //  проверка на дубликаты ссылок
  //   //  проверить значение value в списке ранее введенных ссылок
  //   const isDuplicate = await checkForDuplicate(value);
  //   return !isDuplicate;
  // }),
});

async function app() {
  const form = document.querySelector('.rss-form');
  // console.log(form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlInput = document.querySelector('#url-input');
    const rssLink = urlInput.value.trim();
    rssSchema
      .validate({ rssLink })
      .then((validData) => {
        // Валидация прошла успешно
        urlInput.classList.remove('is-invalid');
        urlInput.focus();
        form.reset();
        console.log('Форма отправлена:', validData);
        // Здесь можно выполнить дополнительные действия, например, отправить данные на сервер
      })
      .catch((validationError) => {
        // Валидация завершилась с ошибками
        console.error('Ошибка валидации:', validationError.errors);
        urlInput.classList.add('is-invalid');
        // Здесь можно обработать ошибки валидации и вывести их на страницу
      });
  });
}

export default app();
