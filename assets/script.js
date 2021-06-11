//create a search bar
//when the user types a city into the search bar and clicks the search button, fetch the city info from weather api
//if it's an invalid city, return an error (the api fetch will be unsuccessful)
//if not an error -
//display the city, date of forecast, and an icon for the main weather status
//in smaller text, display the current day's temp, wind, humidity, and uv index (with colored background representing favorable, moderate, severe uv)
//below the current day's display, place a display of a 5-day forecast
//one card for each day of the forecast
//each card displays the same info from the current day excepting the uv index
//to make each card use the fetch data from the search - it responds with a 7-day forecast in an array. loop through that array for each of the 5 days needed, and add needed data to the card.
//if there is not a local storage item of the same name -
//store the successfully searched city as a local storage item.
//display buttons of the previously searched cities below the search bar
//when the user clicks the button, grab the text content of the button and perform the search and fetch again for that item.
const mainEl = document.getElementById('main');
const apiKey = '82689e438f6babdf340f137676aecf51';
let userCity = '';
const searchBtn = document.getElementById('search-btn');

const fetchWeather = (apiUrl) => {
  fetch(apiUrl)
    .then((response) => {
      if (response.status === 404) {
        const h1El = document.createElement('h1');
        h1El.textContent = 'Error. Please enter a valid city and try again';
        mainEl.appendChild(h1El);
      }
      return response.json();
    })
    .then((data) => {
      const h1El = document.createElement('h1');
      h1El.classList.add('displayed');
      const h2El = document.createElement('h2');
      h2El.classList.add('displayed');
      console.log(data);
      console.log(data.weather[0]);
      h1El.textContent = data.weather[0].description;
      h2El.textContent = data.main.temp;
      mainEl.appendChild(h1El);
      mainEl.appendChild(h2El);
    });
};
function handleClick() {
  const inputEl = document.getElementById('city-search');
  userCity = inputEl.value;
  const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiKey}&units=imperial`;
  fetchWeather(weatherApi);
}
searchBtn.addEventListener('click', handleClick);
