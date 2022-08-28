import PixabayApiService from './js/pixabay-API-service';
import LoadMoreBtnApi from './js/loadMoreBtn';
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
const imgContainer = document.querySelector('.gallery');

const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtnApi({
  selector: '.load-more',
  hidden: true,
});

formEl.addEventListener('submit', onSearch);

loadMoreBtn.refs.button.addEventListener('click', fetchHitsPixab);

function onSearch(event) {
  event.preventDefault();

  pixabayApiService.searchQuery =
    event.currentTarget.elements.searchQuery.value.trim();
  if (pixabayApiService.searchQuery === '') {
    return Notiflix.Notify.warning('Write something');
  }

  loadMoreBtn.show();
  pixabayApiService.resetPage();
  clearImgContainer();
  fetchHitsPixab();
  // .catch(onFetchError);
}

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
      }) => `<div class="photo-card"><a class="gallery-item" href="${largeImageURL}"><img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
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
    .join('');
  imgContainer.insertAdjacentHTML('beforeend', markupImg);
}

function onFetchError(error) {
  Notiflix.Notify.warning('Oops, smth wrong');
}

function fetchHitsPixab() {
  loadMoreBtn.disable();
  pixabayApiService.fetchImg().then(hits => {
    renderImg(hits);
    loadMoreBtn.enable();
  });
}

function clearImgContainer() {
  imgContainer.innerHTML = '';
}

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

// Вместо кнопки «Load more» можно сделать бесконечную загрузку изображений при прокрутке страницы. Мы предоставлям тебе полную свободу действий в реализации, можешь использовать любые библиотеки.

// После первого запроса кнопка появляется в интерфейсе под галереей.
// При повторном сабмите формы кнопка сначала прячется, а после запроса опять отображается.
// В ответе бэкенд возвращает свойство totalHits - общее количество изображений которые подошли под критерий поиска (для бесплатного аккаунта). Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление с текстом "We're sorry, but you've reached the end of search results.".
