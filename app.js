//Selectors

const errorElement = document.querySelector(".error");
const iconElement = document.querySelector(".icon");
const temperatureElement = document.querySelector(".temperature");
const descriptionElement = document.querySelector(".description");
const locationElement = document.querySelector(".location");

//Listeners
temperatureElement.addEventListener("click", changeUnit);
document.addEventListener("DOMContentLoaded", getGeolocation);

//variables
const weather = {
  temperature: {
    value: 0,
    unit: "",
  },
  description: "",
  iconId: "",
  city: "",
  country: "",
};
let errorStatus = false;

//Funtions

// Render the weather data information
function displayWeather() {
  const unitType =
    weather.temperature.unit == "celsius"
      ? "C"
      : weather.temperature.unit == "fahrenheit"
      ? "F"
      : "K";
  iconElement.innerHTML = `<img src="./icons/${weather.iconId}.png" alt="weather icon">`;
  temperatureElement.innerHTML = `${weather.temperature.value}° <span class="temperature-type">${unitType}</span>`;
  descriptionElement.innerHTML = `${weather.description}`;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}
//get location user
function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      getWeather(lat, long);
      errorStatus = false;
    });
  } else {
    errorStatus = true;
    showError();
  }
}
// display the error elemento
function showError() {
  if (errorStatus) {
    errorElement.style.display = "block";
    errorElement.innerHTML = "Hubo un error, lo sentimos";
  }
}
// get data calling api
async function getWeather(latitude, longitude) {
  const keyApi = "b5a6b09813286dfcb5b3827dcc58d61d";
  const urlApi = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${keyApi}`;

  await fetch(urlApi)
    .then(async (response) => {
      let data = await response.json();
      console.log(data);
      return data;
    })
    .then((data) => {
      weather.temperature.value = Math.floor(data.main.temp);
      weather.temperature.unit = "kelvin";
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(() => {
      changeUnit();
      displayWeather();
    });
}

//change weather's temperature unit
function changeUnit() {
  let unit = weather.temperature.unit;
  const temperatureValue = weather.temperature.value;
  if (unit == "kelvin") {
    let f = Math.floor(((temperatureValue - 273) * 9) / 5 + 32);
    weather.temperature.unit = "fahrenheit";
    weather.temperature.value = f;
  } else if (unit == "fahrenheit") {
    let c = Math.floor(((temperatureValue - 32) * 5) / 9);
    weather.temperature.unit = "celsius";
    weather.temperature.value = c;
  } else {
    let k = Math.floor(temperatureValue + 273);
    weather.temperature.unit = "kelvin";
    weather.temperature.value = k;
  }

  displayWeather();
}
