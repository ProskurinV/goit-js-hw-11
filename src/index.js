import PixabayApiService from './js/pixabay-API-service';
import LoadMoreBtnApi from './js/loadMoreBtn';
import { topFunction } from './js/btnUp';
// import { renderImg } from './js/renderImg';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const imgContainer = document.querySelector('.gallery');
const upBtn = document.querySelector('#myBtn');

const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtnApi({
  selector: '.load-more',
  hidden: true,
});
const lightbox = new SimpleLightbox('.gallery a');

formEl.addEventListener('submit', onSearch);
upBtn.addEventListener('click', topFunction);

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
        loadMoreBtn.hide();
      } else if (data.total !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
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

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
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
      smoothScroll();
      lightbox.refresh();

      loadMoreBtn.enable();

      const totalPages = Math.ceil(data.totalHits / pixabayApiService.perPage);
      if (pixabayApiService.page - 1 === totalPages + 1) {
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
        loadMoreBtn.hide();
        return;
      }
    });
  } catch (onFetchError) {}
}
