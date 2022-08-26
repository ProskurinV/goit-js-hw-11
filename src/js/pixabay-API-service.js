import axios from 'axios';

export default class PixabayApiService {
  constructor() {
    this.query = '';
  }

  fetchImg() {
    console.log(this);
    const BASE_URL = 'https://pixabay.com/api/';
    const myKey = 'key=29439204-c21465a1feaf8a905890908f9';

    fetch(
      `${BASE_URL}?${myKey}&q=${this.query}&per_page = 40&image_type=photo&orientation=horizontal&safesearch=true`
    ).then(response => response.json());
    // .then(console.log);
  }

  get searchQuery() {
    return this.query;
  }

  set searchQuery(newQuery) {
    this.query = newQuery;
  }
}
