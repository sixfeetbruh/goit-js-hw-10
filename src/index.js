import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchForCountries from './fetchForCountries';

const DEBOUNCE_DELAY = 300;
const obj = {
    searchInput: document.querySelector('#search-box'),
    countryInfo: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list'),
};

obj.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const inputValue = e.target.value;
    const countryName = inputValue.trim();
    
    obj.countryInfo.hidden = true;
    clearMarkup();

        if (countryName) {   
          fetchForCountries(countryName).then(data => {
                if (data.length > 10) {
                    Notify.info("Too many matches found. Please enter a more specific name.");
                    return;
                }

                createCountryListMarkup(data);

                if (data.length === 1) {
                    obj.countryList.innerHTML = '';
                    createCountryCardMarkup(data);
                    obj.countryInfo.hidden = false;
                }
            }).catch(error => Notify.failure(`${error}`));
    };
};

function createCountryListMarkup(data) {
    const markup = data.map(({ name: { official }, flags: { svg } }) =>
    `<li class="country-list__item"><img src="${svg}" class="country-list__flag" alt="${official} flag">${official}</li>`).join('');

    obj.countryList.insertAdjacentHTML('beforeend', markup)
};

function createCountryCardMarkup(data) {
    const markup = data.map(({ name: { official }, population, capital, languages, flags: { svg } }) => {
        const countryLanguages = Object.values(languages);
        return `<h1 class="country-info__name">
     <img src="${svg}" class="country-info__flag" alt="${official} flag"> ${official}</h1>
      <h2 class="country-info__capital">Capital: ${capital}</h2>
      <h3 class="country-info__population">Population: ${population}</h3>
      <h4 class="country-info__languages">Languages: ${countryLanguages}</h4>`
    }).join('');
    
    obj.countryInfo.insertAdjacentHTML('beforeend', markup);
};

function clearMarkup() {
    obj.countryInfo.innerHTML = '';
    obj.countryList.innerHTML = '';
};