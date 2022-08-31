import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const myKey = 'key=29439204-c21465a1feaf8a905890908f9';
const elseParams = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class PixabayApiService {
  constructor() {
    this.query = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchImg() {
    const response = await axios.get(
      `${BASE_URL}?${myKey}&q=${this.query}&${elseParams}&page=${this.page}&per_page=${this.perPage}`
    );

    this.incrementPage();
    return response;
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
