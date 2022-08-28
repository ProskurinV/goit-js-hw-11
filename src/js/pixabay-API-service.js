import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const myKey = 'key=29439204-c21465a1feaf8a905890908f9';
const elseParams =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
// let items = [];

export default class PixabayApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  fetchImg() {
    return fetch(
      `${BASE_URL}?${myKey}&q=${this.query}&${elseParams}&page=${this.page}`
    )
      .then(response => response.json())
      .then(({ hits }) => {
        this.incrementPage();

        return hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get searchQuery() {
    return this.query;
  }

  set searchQuery(newQuery) {
    this.query = newQuery;
  }
}
