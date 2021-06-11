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
