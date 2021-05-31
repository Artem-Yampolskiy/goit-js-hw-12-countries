import './sass/main.scss';
import countryCardTpl from './templates/country.hbs';
import debounce from 'lodash.debounce';
import { alert } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import API from './js/fetchCountries';
import getRefs from './js/get-refs';

const refs = getRefs();

refs.input.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(event) {
    const searchQuery = event.target.value;
    if (searchQuery.trim() !== '') {
        API.fetchCountries(searchQuery).then(renderCountryMurkup).catch(onFetchError);
    };
    
};

function renderCountryMurkup(countries) {
    clearMurkup();

    if ((countries.length > 1) & (countries.length < 11)) {
            createListCountriesMurkup(countries)    
        };

        if (countries.length === 1) {            
            refs.list.insertAdjacentHTML('afterbegin', countryCardTpl(countries[0]));
        };

        if (countries.length > 10) {            
            alert({
                text: 'Too many matches found. Please enter a more specific query!',
                delay: 2000,
                mouseReset: true,
                sticker: false,
            });
        };
};

function clearMurkup() {
    refs.list.innerHTML = '';
};

function createListCountriesMurkup(countries) {
    const countryesList = countries.map(country => `<li>${country.name}</li>`).join('');
            return (refs.list.innerHTML = countryesList);
};

function onFetchError(error) {
    console.log(error);
}
