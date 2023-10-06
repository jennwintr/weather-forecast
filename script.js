const apiKey = "54623f0fd5e38f03fba617fbabc82094";
// Function to fetch and update weather data
function fetchAndDisplayWeather() {
  // Get the user-entered city from the input field
  const cityName = document.getElementById("city-input").value;

  // Construct the API endpoints for current weather and 5-day forecast
  const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

  // Make an API request to fetch the current weather data
  fetch(currentWeatherApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Extract relevant data
      const currentTemperature = data.main.temp;
      const currentWindSpeed = data.wind.speed;
      const currentHumidity = data.main.humidity;
      const currentCity = data.name;
      const weatherIcon = data.weather[0].icon; // Get the weather icon code
const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`; // Construct the icon URL

const weatherIconElement = document.createElement("img");
weatherIconElement.src = iconUrl;
      const today = new Date(); // Get the current date
      const options = { month: "2-digit", day: "2-digit", year: "numeric"}; // Date formatting options

      // Format today's date as "MM-DD-YYYY"
      const formattedToday = today.toLocaleDateString(undefined, options);

      // Update the current weather section in the HTML
      document.getElementById(
        "current-search-term"
      ).textContent = `${currentCity} (${formattedToday})`;
      document.getElementById("current-search-term").appendChild(weatherIconElement);
      document.getElementById(
        "current-temp"
      ).textContent = `${currentTemperature}°F`;
      document.getElementById(
        "current-wind"
      ).textContent = `${currentWindSpeed} m/s`;
      document.getElementById(
        "current-humidity"
      ).textContent = `${currentHumidity}%`;
    })
    .catch((error) => {
      console.error("Error fetching current weather:", error);
    });

  // Make an API request to fetch the 5-day forecast data

  fetch(forecastApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Extract relevant data for the next 5 days with a daily interval
      const forecastData = [];

      // Loop through the forecast data and select data for the next 5 days with a daily interval
      // i += 8 (i = i+8)
      for (let i = 2; i <= data.list.length; i += 8) {
        const forecastDay = data.list[i];
        forecastData.push(forecastDay);
      }

      // Get the forecast container element
      const forecastContainer = document.getElementById("forecast-container");
      forecastContainer.innerHTML = '';

      // Loop through the forecast data for each day
      forecastData.forEach((forecastDay, index) => {
        // Create elements for each day's forecast
        const box = document.createElement("div");
        box.classList.add("box");
        const content = document.createElement("div");
        content.classList.add("content");
        const dateElement = document.createElement("h4");
        const iconElement = document.createElement("img");
        const ulElement = document.createElement("ul");

        // Extract relevant data for each day
        const dateArray = forecastDay.dt_txt.split(" "); // Split the string into an array at the space character
        const forecastDate = dateArray[0];
        const forecastTemperature = forecastDay.main.temp;
        const forecastWindSpeed = forecastDay.wind.speed;
        const forecastHumidity = forecastDay.main.humidity;

        // Update the elements with the forecast data
        dateElement.textContent = forecastDate;
        const forecastIconCode = forecastDay.weather[0].icon; // Get the icon code from the API response
        const iconUrl = `https://openweathermap.org/img/wn/${forecastIconCode}.png`; // Construct the icon URL

        // Update iconElement.src with the icon URL
        iconElement.src = iconUrl;
        ulElement.innerHTML = `
       <li>Temp: <span>${forecastTemperature}°F</span></li>
       <li>Wind: <span>${forecastWindSpeed} m/s</span></li>
       <li>Humidity: <span>${forecastHumidity}%</span></li>
     `;

        // Append the elements to the forecast container
        content.appendChild(dateElement);
        content.appendChild(iconElement);
        content.appendChild(ulElement);
        box.appendChild(content);
        forecastContainer.appendChild(box);
      });
    })

    .catch((error) => {
      console.error("Error fetching 5-day forecast:", error);
    });
}

// Event listener for the search button click
document
  .getElementById("search-btn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the form from submitting and page reload

    // Call the function to fetch and display weather data
    fetchAndDisplayWeather();
  });

// Get references to the form, input field, and history list
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const historyList = document.getElementById("history");
const searchBtn = document.getElementById("search-btn");

// Retrieve search history from localStorage if available
const searchArray = JSON.parse(localStorage.getItem("SearchTerms")) || [];

// Function to update the history list
function updateHistoryList() {
  // Clear the existing list items
  historyList.innerHTML = "";

  // Iterate through the searchArray and create new list items
  searchArray.forEach(function (term) {
    const listItem = document.createElement("li");
    listItem.textContent = term;
    historyList.appendChild(listItem);
  });
}

// Update history list on page load
updateHistoryList();

const MAX_HISTORY_ITEMS = 8;

// Event listener for form submission
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();

  // Get the city input value
  const cityName = cityInput.value;

  // Add the city to the beginning of the searchArray
  searchArray.unshift(cityName);

  // Limit the search history to MAX_HISTORY_ITEMS
  if (searchArray.length > MAX_HISTORY_ITEMS) {
    searchArray.pop(); // Remove the last item if the array exceeds the limit
  }

  // Save the updated searchArray to localStorage
  localStorage.setItem("SearchTerms", JSON.stringify(searchArray));

  // Clear the input field
  cityInput.value = "";

  // Update the history list
  updateHistoryList();
});
