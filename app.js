const apiKey = "638b2974298a9080a94bf78a46083899";
const apiURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const weather5Days = document.querySelector(".weather-cards");
const locationBtn = document.querySelector(".location-btn");

// Fetch data
async function fetchData(city) {
  try {
    const response = await fetch(apiURL + `&q=${city}&appid=${apiKey}`);

    if (response.status === 404) {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
      document.querySelector(".days-forecast").style.display = "none";
      return null;
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Current Location Function
async function getCurrentLocationWeather() {
  try {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const response = await fetch(
        apiURL + `&lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      );

      const data = await response.json();

      checkWeather(data.city.name);
      checkForecast(data.city.name);
    });
  } catch (error) {
    console.error("Error getting current location:", error);
  }
}

// Weather Icon Function
function getWeatherIcon(weatherStatus) {
  switch (weatherStatus) {
    case "Clouds":
      weatherIcon.src = "images/clouds.png";
      break;
    case "Clear":
      weatherIcon.src = "images/clear.png";
      break;
    case "Drizzle":
      weatherIcon.src = "images/drizzle.png";
      break;
    case "Mist":
      weatherIcon.src = "images/mist.png";
      break;
    case "Rain":
      weatherIcon.src = "images/rain.png";
      break;
    case "Snow":
      weatherIcon.src = "images/snow.png";
      break;
    default:
      weatherIcon.src = "images/spinner.svg";
      break;
  }

  return weatherIcon.src;
}

// Day Name Function
function getDayName(dateStr, locale) {
  var date = new Date(dateStr);
  return date.toLocaleDateString(locale, { weekday: "long" });
}

// Today's weather
async function checkWeather(city) {
  const data = await fetchData(city);

  if (data) {
    console.log(data);

    document.querySelector(".city").innerHTML = data.city.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.list[0].main.temp) + "°C";
    document.querySelector(".humidity").innerHTML =
      data.list[0].main.humidity + "%";
    document.querySelector(".wind").innerHTML =
      Math.round(data.list[0].wind.speed) + "km/h";

    weatherIcon.src = getWeatherIcon(data.list[0].weather[0].main);

    document.querySelector(".error").style.display = "none";
    document.querySelector(".weather").style.display = "block";

    searchBox.value = "";
  } else {
    console.warn("ERROR: the provided city name is invalid!");
  }
}

// Four days forecast
async function checkForecast(city) {
  const data = await fetchData(city);

  const uniqueForecastDays = [];
  const fiveDaysForecast = data.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
      return uniqueForecastDays.push(forecastDate);
    }
  });

  console.log(fiveDaysForecast);
  const weatherCards = weather5Days.querySelectorAll(".card");

  for (i = 0; i <= 4; i++) {
    fiveDaysForecast[i].dt_txt = getDayName(
      fiveDaysForecast[i].dt_txt,
      "en-US"
    );
    weatherCards[i].querySelector(".date").innerHTML =
      fiveDaysForecast[i].dt_txt;
    weatherCards[i].querySelector(".tempForecast").innerHTML =
      Math.round(fiveDaysForecast[i].main.temp) + "°C";
    weatherCards[i].querySelector(".humidityForecast").innerHTML =
      fiveDaysForecast[i].main.humidity + "%";
    weatherCards[i].querySelector(".windForecast").innerHTML =
      Math.round(fiveDaysForecast[i].wind.speed) + "km/h";
    weatherCards[i].querySelector(".weather-icon-forecast").src =
      getWeatherIcon(fiveDaysForecast[i].weather[0].main);
  }

  document.querySelector(".days-forecast").style.display = "block";
}

searchBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
    checkForecast(searchBox.value);
    searchBox.blur();
    //searchBox.value = "";
  }
});

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
  checkForecast(searchBox.value);
});

locationBtn.addEventListener("click", () => {
  getCurrentLocationWeather();
});

checkWeather("Bucharest");
checkForecast("Bucharest");
