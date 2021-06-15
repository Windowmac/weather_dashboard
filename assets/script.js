//create a search bar
//when the user types a city into the search bar and clicks the search button, fetch the city info from weather api
//if it's an invalid city, return an error (the api fetch will be unsuccessful)
//if not an error -
//display the city, date of forecast, and an icon for the main weather status
//in smaller text, display the current day's temp, wind, humidity, and uv index (with colored background representing favorable, moderate, severe uv)
//below the current day's display, place a display of a 5-day forecast
//one card for each day of the forecast
//each card displays the same info categories from the current day excepting the uv index
//to make each card use the fetch data from the search - it responds with a 7-day forecast in an array. loop through that array for each of the 5 days needed, and add data to the card.
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
        h1El.id = 'error-msg';
        h1El.textContent = 'Error. Please enter a valid city and try again';
        navEl.appendChild(h1El);
        return;
      }
      return response.json();
    })
    .then((data) => {
      const cityName = data.name;
      if (!localStorage.getItem('search-history')) {
        const storageArray = [cityName];
        localStorage.setItem('search-history', JSON.stringify(storageArray));
        const h1El = document.createElement('h1');
        h1El.classList.add(
          'rounded-pill',
          'bg-primary',
          'text-center',
          'search-item'
        );
        h1El.style = 'cursor:pointer; padding: 7px';
        h1El.textContent = cityName;
        navEl.appendChild(h1El);
        h1El.addEventListener('click', (event) => {
          userCity = event.target.textContent;
          const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&units=imperial&appid=${apiKey}`;
          fetchWeather(weatherApi);
        });
      }

      //update storage
      //pull storage array, check for match, if not push cityName, re-save storage array via stringify
      const updateStorage = () => {
        const storageArray = JSON.parse(localStorage.getItem('search-history'));

        while (
          storageArray[storageArray.length - 1] !== cityName &&
          storageArray.length
        ) {
          storageArray.pop();
        }
        if (!storageArray.length) {
          const newStorageArray = JSON.parse(
            localStorage.getItem('search-history')
          );
          newStorageArray.push(cityName);
          localStorage.setItem(
            'search-history',
            JSON.stringify(newStorageArray)
          );
        } else {
          return;
        }
      };
      //handle storage
      updateStorage();
      handleStorage();
      userCity = data.name; //for capitalization/accuracy

      if (document.getElementById('error-msg')) {
        const errorMsgArray = Array.from(
          document.querySelectorAll('#error-msg')
        );
        errorMsgArray.forEach((item) => item.remove()); //to remove the error msg from a previous search (and any multiples)
      }

      //call another fetch with lat and lon for more detailed information as well as 7day forecast
      const oneCallFetch = (data) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`
        )
          .then((response) => response.json())
          .then((data) => {
            //for current weather display

            if (document.getElementById('current-day')) {
              document.getElementById('current-day').remove();
            }
            //display the city, date of forecast, and an icon for the main weather status

            const currentDate = new Date(data.current.dt * 1000);
            console.log(currentDate);
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();
            const year = currentDate.getFullYear();
            const currentDayEl = document.createElement('section');
            currentDayEl.classList.add(
              'container',
              'col-12',
              'col-md-7',
              'border',
              'border-1'
            );
            currentDayEl.id = 'current-day';
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            const dateEl = document.createElement('h1');
            dateEl.textContent = `${month}/${day}/${year}`;
            currentDayEl.appendChild(dateEl);
            document.getElementById('first-row').appendChild(currentDayEl);
            const cityEl = document.createElement('h1');
            cityEl.textContent = userCity;

            const mainWeatherEl = document.createElement('h2');
            mainWeatherEl.textContent = data.current.weather[0].description;
            mainWeatherEl.classList.add('col-4');

            const mainWeatherIcon = document.createElement('img');
            mainWeatherIcon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
            mainWeatherIcon.classList.add(
              'rounded',
              'float-start',
              'bg-dark',
              'col-2'
            );

            rowDiv.appendChild(cityEl);
            rowDiv.appendChild(mainWeatherEl);
            rowDiv.appendChild(mainWeatherIcon);

            //in smaller text, display the current day's temp, wind, humidity, and uv index (with colored background representing favorable, moderate, severe uv)
            const currentTempEl = document.createElement('h3');
            currentTempEl.textContent = `Temperature (Fahrenheit): ${data.current.temp}`;
            const currentWindEl = document.createElement('h3');
            currentWindEl.textContent = `Wind: ${data.current.wind_speed}mph`;
            const currentHumidityEl = document.createElement('h3');
            currentHumidityEl.textContent = `Humidity: ${data.current.humidity}`;

            const uvEl = document.createElement('h3');
            uvEl.textContent = `UV Index: ${data.current.uvi}`;
            uvEl.classList.add('rounded-pill', 'border', 'border-2');
            uvEl.style.width = 'fit-content';
            uvEl.style.padding = '15px';
            if (data.current.uvi > 2) {
              uvEl.classList.add('bg-warning');
            }
            if (data.current.uvi > 5) {
              uvEl.classList.add('bg-danger');
            } else {
              uvEl.classList.add('bg-success');
            }

            currentDayEl.appendChild(rowDiv);
            currentDayEl.appendChild(currentTempEl);
            currentDayEl.appendChild(currentWindEl);
            currentDayEl.appendChild(currentHumidityEl);
            currentDayEl.appendChild(uvEl);

            //below the current day's display, place a display of a 5-day forecast
            //one card for each day of the forecast
            //each card displays the same info categories from the current day excepting the uv index
            const createForecast = (data) => {
              if (document.getElementById('forecast-container')) {
                document.getElementById('forecast-container').remove();
              }
              const forecastContainerEl = document.createElement('section');
              forecastContainerEl.classList.add('container-fluid');
              forecastContainerEl.id = 'forecast-container';
              const forecastRowEl = document.createElement('div');
              forecastRowEl.classList.add('row', 'justify-content-evenly');

              const forecastArray = [];
              for (let i = 1; i < 6; i++) {
                forecastArray.push(data.daily[i]);
              }

              //use this function to create individual cards and append them to the row
              const createForecastCard = (forecast) => {
                if (!forecast.length) {
                  return;
                }
                const day = forecast.shift();
                const date = new Date(day.dt * 1000);
                const dateEl = document.createElement('h3');
                dateEl.textContent = `${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()}`;

                forecastContainerEl.appendChild(forecastRowEl);
                mainEl.appendChild(forecastContainerEl);

                const cardColumn = document.createElement('div');
                cardColumn.classList.add('col-12', 'col-md-2');
                const cardEl = document.createElement('div');
                cardEl.classList.add('card', 'bg-dark', 'border', 'rounded');
                const cardImg = document.createElement('img');
                cardImg.classList.add('card-img-top');
                cardImg.src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                cardImg.style.width = '50%';
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                const cardTemp = document.createElement('h4');
                cardTemp.classList.add('fs-5');
                cardTemp.textContent = `Temp: ${day.temp.day} deg`;
                const cardWind = document.createElement('h4');
                cardWind.classList.add('fs-5');
                cardWind.textContent = `Wind: ${day.wind_speed}mph`;
                const cardHumidity = document.createElement('h4');
                cardHumidity.classList.add('fs-5');
                cardHumidity.textContent = `Humidity: ${day.humidity}`;

                cardEl.appendChild(cardImg);
                cardEl.appendChild(cardBody);
                cardBody.appendChild(dateEl);
                cardBody.appendChild(cardTemp);
                cardBody.appendChild(cardWind);
                cardBody.appendChild(cardHumidity);
                forecastRowEl.appendChild(cardColumn);
                cardColumn.appendChild(cardEl);

                createForecastCard(forecast);
              };
              createForecastCard(forecastArray);
            };

            createForecast(data);
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

function handleKeyUp(event) {
  if (event.keyCode === 13) {
    const inputEl = document.getElementById('city-search');
    userCity = inputEl.value;
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&units=imperial&appid=${apiKey}`;
    fetchWeather(weatherApi);
  }
}

searchBtn.addEventListener('click', handleClick);
document.getElementById('city-search').addEventListener('keyup', handleKeyUp);

//handle page-load local storage here
//store the successfully searched city as a local storage item.
//display buttons of the previously searched cities below the search bar
const handleStorage = () => {
  if (localStorage.getItem('search-history')) {
    //pull all search-item elements from nav, create an array from them, remove them
    const searchItemsArray = Array.from(
      document.querySelectorAll('.search-item')
    );
    searchItemsArray.forEach((item) => {
      item.remove();
    });

    //then append search history buttons on nav
    const historyArray = JSON.parse(localStorage.getItem('search-history'));
    historyArray.forEach(function (item) {
      const h1El = document.createElement('h1');
      h1El.classList.add(
        'rounded-pill',
        'bg-primary',
        'text-center',
        'search-item'
      );
      h1El.style = 'cursor:pointer; padding: 7px';
      h1El.textContent = item;
      navEl.appendChild(h1El);
      h1El.addEventListener('click', (event) => {
        userCity = event.target.textContent;
        const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&units=imperial&appid=${apiKey}`;
        fetchWeather(weatherApi);
      });
    });
  }
};

handleStorage();
