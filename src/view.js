const render = (state, elements, i18nInstance) => (path, value) => {
  const renderErrorForm = (errorKey) => {
    elements.urlInput.classList.add('is-invalid');
    elements.feedbackP.classList.add('text-danger');

    switch (errorKey) {
      case 'errorDuplicate':
        // Обработка состояния заполнения формы

        elements.feedbackP.classList.remove('text-success');

        // eslint-disable-next-line no-param-reassign
        elements.feedbackP.textContent = i18nInstance.t('errors.errorDuplicate');

        break;

      case 'mustNotBeEmpty':
        // Обработка состояния заполнения формы

        elements.feedbackP.classList.remove('text-success');

        // eslint-disable-next-line no-param-reassign
        elements.feedbackP.textContent = i18nInstance.t('errors.errorDuplicate');

        break;

      case 'errorValidUrl':
        // Обработка состояния заполнения формы

        elements.feedbackP.classList.remove('text-success');

        // eslint-disable-next-line no-param-reassign
        elements.feedbackP.textContent = i18nInstance.t('errors.errorValidUrl');

        break;

      case 'parseError':
        // Обработка состояния заполнения формы

        // eslint-disable-next-line no-param-reassign
        elements.feedbackP.textContent = i18nInstance.t('errors.parseError');

        break;

      case 'errorNet':
        // Обработка состояния заполнения формы
        // eslint-disable-next-line no-param-reassign
        elements.feedbackP.textContent = i18nInstance.t('errors.errorNet');

      // eslint-disable-next-line no-fallthrough
      default:
        // throw new Error(`Unknown mode: ${errorKey}`);
    }
  };

  const renderConfirmForm = () => {
    elements.urlInput.classList.remove('is-invalid');
    elements.feedbackP.classList.remove('text-danger');
    elements.feedbackP.classList.add('text-success');
    // eslint-disable-next-line no-param-reassign
    elements.feedbackP.textContent = i18nInstance.t('completeUrl');
    elements.urlInput.focus();
    elements.form.reset();
  };

  const renderPosts = () => {
    const postsContainer = document.querySelector('.posts');
    postsContainer.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('card', 'border-0');

    const divBody = document.createElement('div');
    divBody.classList.add('card-body');

    const articlePosts = document.createElement('h2');
    articlePosts.classList.add('card-title', 'h4');
    articlePosts.textContent = i18nInstance.t('postsTitle');

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');

    state.posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const postElement = document.createElement('a');
      postElement.textContent = post.title;
      postElement.setAttribute('href', `${post.link}`);
      postElement.classList.add(state.readPosts.includes(post.id) ? ('fw-normal', 'link-secondary') : 'fw-bold');
      postElement.setAttribute('id', post.id); // Присваиваем уникальный ID элементу поста
      postElement.setAttribute('target', '_blank');
      postElement.setAttribute('rel', 'noopener noreferrer');

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('data-id', post.id); // Присваиваем уникальный ID кнопке
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = i18nInstance.t('button');

      li.appendChild(postElement);
      li.appendChild(button);
      ul.append(li);
    });

    divBody.append(articlePosts);
    div.append(divBody);
    div.append(ul);
    postsContainer.append(div);
  };

  // https://3dnews.ru/hardware-news/rss
  // https://www.finam.ru/analysis/conews/rsspoint/
  const renderChannels = () => {
    const channelsContainer = document.querySelector('.feeds');
    channelsContainer.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('card', 'border-0');

    const divBody = document.createElement('div');
    divBody.classList.add('card-body');

    const articleChannel = document.createElement('h2');
    articleChannel.classList.add('card-title', 'h4');
    articleChannel.textContent = i18nInstance.t('feedsTitle');

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');

    state.channels.forEach((channel) => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      h3.classList.add('h6', 'm-0');
      p.classList.add('m-0', 'small', 'text-black-50');
      h3.textContent = channel.title;
      p.textContent = channel.description;
      li.append(h3);
      li.append(p);
      ul.append(li);
    });

    divBody.append(articleChannel);
    div.append(divBody);
    div.append(ul);
    channelsContainer.append(div);
  };

  const renderModal = () => {
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalBtnPrimary = document.querySelector('.btn-primary');
    const post = state.readPosts[state.readPosts.length - 1];

    const postElement = document.getElementById(`${post}`);
    postElement.classList.remove('fw-bold');
    postElement.classList.add('fw-normal', 'link-secondary');

    if (state.posts[post]) {
      modalTitle.textContent = state.posts[post].title;
      modalBody.textContent = state.posts[post].description;
      modalBtnPrimary.href = state.posts[post].link;
    }
  };

  switch (path) {
    case 'formProcess.error':
      // Обработка состояния заполнения формы
      renderErrorForm(value);
      break;

    case 'formProcess.state':
      renderPosts();
      renderChannels();
      break;

    case 'formProcess.confirm':
      renderConfirmForm();
      break;

    case 'readPosts':
      renderModal();

      break;

    default:
     // throw new Error(`Unknown mode: ${path}`);
  }
};

export default render;
