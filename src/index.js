import './css/styles.css';
import { fetchCountries } from './components/fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');

function onInputType(e) {
  const country = e.target.value.trim();
  if (country !== '') {
    fetchCountries(country);
  }
}

input.addEventListener('input', debounce(onInputType, DEBOUNCE_DELAY));
