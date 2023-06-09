import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './components/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  markupList: document.querySelector('.country-list'),
  countryDiv: document.querySelector('.country-info'),
};

function onInputType(e) {
  const country = e.target.value.trim();

  if (country === '') {
    refs.markupList.innerHTML = '';
    refs.countryDiv.innerHTML = '';
  } else if (country !== '') {
    fetchCountries(country)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length <= 10 && data.length >= 2) {
          refs.countryDiv.innerHTML = '';
          const result = createMarkupList(data);
          refs.markupList.innerHTML = result;
        } else if (data.length === 1) {
          refs.markupList.innerHTML = '';
          const result = createCard(data);
          refs.countryDiv.innerHTML = result;
        }
      })
      .catch(error => {
        if (error.message === '404') {
          Notiflix.Notify.failure('Oops, there is no country with that name!');
          refs.markupList.innerHTML = '';
          refs.countryDiv.innerHTML = '';
        } else {
          console.log(error.message);
        }
      });
  }
}

function createMarkupList(data) {
  return data
    .map(item => {
      const { name, flags } = item;
      return `<li>
                 <img src="${flags.svg}" alt="${name.official}'s flag" width="25">
                 <h1>${name.official}</h1>
            </li>`;
    })
    .join(' ');
}

function createCard(data) {
  return data
    .map(item => {
      const { name, capital, population, flags, languages } = item;

      return `
        <img src="${flags.svg}" alt="${name.official}'s flag" width="40">
        <h1 class="card-title">${name.official}</h1>
            <ul>
                <li>
                    <h2 class="card-dcr">Capital: ${capital}</h2>
                </li>
                <li>
                    <h2 class="card-dcr">Population: ${population}</h2>
                </li>
                <li>
                    <h2 class="card-dcr">Languages: ${Object.values(
                      languages
                    ).join(', ')}</h2>
                </li>
            </ul>
            `;
    })
    .join(',');
}

refs.input.addEventListener('input', debounce(onInputType, DEBOUNCE_DELAY));
