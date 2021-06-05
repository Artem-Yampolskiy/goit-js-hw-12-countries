import './sass/main.scss';
import getRefs from './js/get-refs';
import API from './js/fetchCountries';
import countryCardTpl from './templates/country.hbs';
import debounce from 'lodash.debounce';
import { error, notice } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';


const refs = getRefs();

refs.input.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(event) {
  const searchQuery = event.target.value;
  clearMarkup();

  if (searchQuery.length < 1)
    return;

  API.fetchCountries(searchQuery)
    .then(renderCountryMarkup)
    .catch(onFetchError);
};

function renderCountryMarkup(countries) {
  clearMarkup();
  if (countries.status === 404) {
    pontyfyMassage('Nothing was found for your query!')
  };

  if (countries.length > 10) {
    error({
        text: 'Too many matches found. Please enter a more specific query!',
        delay: 3000,
        mouseReset: true,
        sticker: false,
    });
  };

  if (countries.length === 1) {
    refs.list.insertAdjacentHTML('afterbegin', countryCardTpl(countries[0]));
  };

  if (countries.length > 1 && countries.length < 10) {
    clearMarkup();
    createListCountriesMarkup(countries);
  };  
};

function clearMarkup() {
  refs.list.innerHTML = '';
};

function createListCountriesMarkup(countries) {
  const countriesList = countries.map(country => `<li>${country.name}</li>`).join('');
  return (refs.list.innerHTML = countriesList);
};

function onFetchError() {
  refs.list.innerHTML = '';
  notice({
    title: 'OOPS!',
    text: 'Invalid entered value. Try again =)',
    delay: 2500,
  });
};

function pontyfyMassage(message) {
    error ({
      title: `${message}`,
      delay: 2000,
    });
};
