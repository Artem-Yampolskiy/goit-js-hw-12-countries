const BASE_URL = 'https://restcountries.eu/rest/v2';
function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}/name/${searchQuery}`)
    .then(response => response.json())
    .catch(error => console.log(error));
}

export default { fetchCountries };
