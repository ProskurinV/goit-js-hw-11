import PixabayApiService from './js/pixabay-API-service';
// import imgTmpl from './js/ImgTpl';
// import { renderImg } from './js/renderImg';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Уведомление
// После первого запроса при каждом новом поиске выводить уведомление в котором будет написано сколько всего нашли изображений (свойство totalHits). Текст уведомления "Hooray! We found totalHits images."

// Notiflix.Notify.success('Hooray! We found totalHits images.');

// В ответе бэкенд возвращает свойство totalHits - общее количество изображений которые подошли под критерий поиска (для бесплатного аккаунта). Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление с текстом "We're sorry, but you've reached the end of search results."

// Notiflix.Notify.info('We're sorry, but you've reached the end of search results.');

const formEl = document.querySelector('#search-form');
const input = document.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more');
const imgContainer = document.querySelector('.gallery');

const pixabayApiService = new PixabayApiService();

formEl.addEventListener('submit', onSearch);

loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  pixabayApiService.searchQuery =
    event.currentTarget.elements.searchQuery.value.trim();
  if (pixabayApiService.searchQuery === '') {
    return Notiflix.Notify.warning('Write something');
  }

  pixabayApiService.resetPage();

  pixabayApiService.fetchImg().then(renderImg);
  //  clearImgContainer();
  //  renderImg(hits);
  // .catch(onFetchError);
}

// function renderImg(hits) {
//   imgContainer.insertAdjacentHTML('beforeend', imgTmpl(hits));
// }

function renderImg(hits) {
  const markupImg = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a class="gallery-item" href="${largeImageURL}"><img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`
    )
    .join();
  imgContainer.insertAdjacentHTML('beforeend', markupImg);
}

function onFetchError(error) {
  Notiflix.Notify.warning('Oops, smth wrong');
}

function onLoadMore() {
  pixabayApiService.fetchImg().then(renderImg);
  // .then(renderImg);
}

function clearImgContainer() {
  imgContainer.innerHTML = '';
}

// За бажанням вищевказаний запит також можна виконати так
// axios.get('/user', {
//     params: {
//       ID: 12345
//     }
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .then(function () {
//     // виконується завжди
//   });

// // Хочете використовувати async/await? Додайте ключове слово `async` до своєї зовнішньої функції/методу.
// async function getUser() {
//   try {
//     const response = await axios.get('/user?ID=12345');
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

// Вместо кнопки «Load more» можно сделать бесконечную загрузку изображений при прокрутке страницы. Мы предоставлям тебе полную свободу действий в реализации, можешь использовать любые библиотеки.

// Пагинация
// Pixabay API поддерживает пагинацию и предоставляет параметры page и per_page. Сделай так, чтобы в каждом ответе приходило 40 объектов (по умолчанию 20).

// Изначально значение параметра page должно быть 1.
// При каждом последующем запросе, его необходимо увеличить на 1.
// При поиске по новому ключевому слову значение page надо вернуть в исходное, так как будет пагинация по новой коллекции изображений.
// В HTML документе уже есть разметка кнопки при клике по которой необходимо выполнять запрос за следующей группой изображений и добавлять разметку к уже существующим элементам галереи.

// <button type="button" class="load-more">Load more</button>

// Изначально кнопка должна быть скрыта.
// После первого запроса кнопка появляется в интерфейсе под галереей.
// При повторном сабмите формы кнопка сначала прячется, а после запроса опять отображается.
// В ответе бэкенд возвращает свойство totalHits - общее количество изображений которые подошли под критерий поиска (для бесплатного аккаунта). Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление с текстом "We're sorry, but you've reached the end of search results.".
