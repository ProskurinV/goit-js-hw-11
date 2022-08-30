import PixabayApiService from './js/pixabay-API-service';
import LoadMoreBtnApi from './js/loadMoreBtn';
// import { renderImg } from './js/renderImg';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const input = document.querySelector('input');
const imgContainer = document.querySelector('.gallery');

const pixabayApiService = new PixabayApiService();

const loadMoreBtn = new LoadMoreBtnApi({
  selector: '.load-more',
  hidden: true,
});

const lightbox = new SimpleLightbox('.gallery a');

// В ответе бэкенд возвращает свойство totalHits - общее количество изображений которые подошли под критерий поиска (для бесплатного аккаунта). Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление с текстом "We're sorry, but you've reached the end of search results."

// Notiflix.Notify.info('We're sorry, but you've reached the end of search results.');

// var gallery = $('.gallery a').simpleLightbox();
// gallery.refresh();

formEl.addEventListener('submit', onSearch);

loadMoreBtn.refs.button.addEventListener('click', fetchHitsPixab);

function onSearch(event) {
  try {
    event.preventDefault();

    pixabayApiService.searchQuery =
      event.currentTarget.elements.searchQuery.value.trim();
    if (pixabayApiService.searchQuery === '') {
      return Notiflix.Notify.warning('Write something');
    }
    pixabayApiService.fetchImg().then(({ data }) => {
      if (data.total === 0) {
        Notiflix.Notify.info(
          `Sorry, there are no images matching your ${pixabayApiService.searchQuery}. Please try again.`
        );
      } else if (data.total !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      } else {
        return;
      }
    });

    loadMoreBtn.show();
    pixabayApiService.resetPage();
    clearImgContainer();
    fetchHitsPixab();
  } catch (onFetchError) {}
}

function clearImgContainer() {
  imgContainer.innerHTML = '';
}

function renderImg({ hits }) {
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
  try {
    loadMoreBtn.disable();

    pixabayApiService.fetchImg().then(({ data }) => {
      renderImg(data);
      lightbox.refresh();
      loadMoreBtn.enable();
      // if (data.totalHits <= data.hits) {
      //   Notiflix.Notify.info(
      //     `'We're sorry, but you've reached the end of search results.'`
      //   );
      // }
    });
  } catch (onFetchError) {}
}
