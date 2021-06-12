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
const navEl = document.getElementById('nav-column');
const apiKey = '82689e438f6babdf340f137676aecf51';
let userCity = '';
const searchBtn = document.getElementById('search-btn');

//initial weather fetch with city name
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
      const cityName = data.name;
      if (!localStorage.getItem(cityName)) {
        localStorage.setItem(cityName, cityName);
        const h1El = document.createElement('h1');
        h1El.classList.add('rounded-pill', 'bg-primary', 'text-center');
        h1El.style = 'cursor:pointer; padding: 7px';
        h1El.textContent = localStorage.getItem(cityName);
        navEl.appendChild(h1El);
        h1El.addEventListener('click', (event) => {
          userCity = event.target.textContent;
          const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&units=imperial&appid=${apiKey}`;
          fetchWeather(weatherApi);
        });
      }
      //display the city, date of forecast, and an icon for the main weather status
      //in smaller text, display the current day's temp, wind, humidity, and uv index (with colored background representing favorable, moderate, severe uv)
      console.log(data);
      //call another fetch with lat and lon for more detailed information as well as 7day forecast

      const oneCallFetch = (data) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const currentDate = new Date(data.current.dt * 1000);
            const month = currentDate.getMonth();
            const day = currentDate.getDate();
            const year = currentDate.getFullYear();

            const currentDayEl = document.createElement('section');
            currentDayEl.classList.add('container', 'col-7');

            const dateEl = document.createElement('h1');
            dateEl.textContent = `${month}/${day}/${year}`;
            currentDayEl.appendChild(dateEl);
            document.getElementById('first-row').appendChild(currentDayEl);

            const mainWeatherEl = document.createElement('h2');
            mainWeatherEl.textContent = data.current.weather[0].main;
            currentDayEl.appendChild(mainWeatherEl);
          });
      };
      oneCallFetch(data);
    });
};
function handleClick() {
  const inputEl = document.getElementById('city-search');
  userCity = inputEl.value;
  const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&units=imperial&appid=${apiKey}`;
  fetchWeather(weatherApi);
}
searchBtn.addEventListener('click', handleClick);
