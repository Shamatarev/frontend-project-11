const render = (state, elements, i18nInstance) => (path, value, prevValue) => {
  console.log(path, value, prevValue);
  // const { formProcess } = state;

  const renderErrorForm = () => {
    elements.urlInput.classList.add('is-invalid');
    elements.feedbackP.classList.add('text-danger');
    elements.feedbackP.textContent = i18nInstance.t('mixed');
  };

  const renderConfirmForm = () => {
    elements.urlInput.classList.remove('is-invalid');
    elements.feedbackP.classList.remove('text-danger');
    elements.feedbackP.classList.add('text-success');
    elements.feedbackP.textContent = i18nInstance.t('mstring');
    elements.urlInput.focus();
    elements.form.reset();
  };

  switch (path) {
    case 'formProcess.state':
      // Обработка состояния заполнения формы
      renderConfirmForm();

      break;

    case 'formProcess.error':
      // Обработка состояния заполнения формы

      renderErrorForm();

      break;

    default:

      throw new Error(`Unknown mode: ${state.mode}`);
  }
};

export default render;

// const renderPosts = () => {
//   const postsContainer = document.querySelector('!!!!!!!');
//   postsContainer.innerHTML = '';
//   const posts = state.posts.map();
//   container.append(...posts);
// };
// const renderForm = () => {
//   i18nInstance.t('required');
// };
