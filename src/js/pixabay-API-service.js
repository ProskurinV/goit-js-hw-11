import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const myKey = 'key=29439204-c21465a1feaf8a905890908f9';
const elseParams =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

let hits = 0;
let totalHits = 0;
let total = 0;

export default class PixabayApiService {
  constructor() {
    this.query = '';
    this.page = 1;

    // this.hits = 0;
    // this.totalHits = 0;
    // this.total = 0;
  }

  async fetchImg() {
    const { data } = await axios.get(
      `${BASE_URL}?${myKey}&q=${this.query}&${elseParams}&page=${this.page}`
    );
    hits = data.hits;
    totalHits = data.totalHits;
    total = data.total;
    this.incrementPage();
    // return response;
  }

  // fetchImg() {
  //   return fetch(
  //     `${BASE_URL}?${myKey}&q=${this.query}&${elseParams}&page=${this.page}`
  //   )
  //     .then(response => response.json())
  //     .then(({ hits }) => {
  //       this.incrementPage();

  //       return hits;
  //     });
  // }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  // get searchQuery() {
  //   return this.query;
  // }

  // set searchQuery(newQuery) {
  //   this.query = newQuery;
  // }
}
