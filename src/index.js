const axios = require('axios');
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const form = document.querySelector('#search-form');

form.addEventListener('submit', onFormSubmit);
