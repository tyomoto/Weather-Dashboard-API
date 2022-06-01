// global variables
var apiKey = "88210bf2a33543b3ce223b8472705549"

var cityLongitude;
var cityLatitude;



var searchinputEl = document.getElementById('search')

var currentWeatherContainer = $("#current-weather-container");
var currentCityName = $("#current-cityname");
var currentIcon = $("#current-weather-icon"); 
var currentTemperature = $("#current-temperature");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-windspeed");
var currentUVIndex = $("#current-uv-index");




var currentWeatherBox = function(cityName){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response){
            // turns response into objects
            return response.json();
        })
        .then(function(data){
            cityLatitude = data[0].lat 
            cityLongitude = data [0].lon

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&appid=${apiKey}`)
            // turn response into objects again
            .then(function(response){
                return response.json();
            })
            // Now use the data from response to populate current weather container
            .then(function(respnose){
                queryUrl(cityName);

                currentWeatherContainer.addClass("current-weather-container");

                // add in data to container
                // City and Date
                var currentDay = moment().format("M/D/YYYY");
                currentCityName.text(`${cityName} (${currentDay})`);
                // Icon
                currentIcon.addClass("current-weather-icon");
                var currentIconCode = response.current.weather[0].icon;
                currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);
                // temperature
                currentTemperature.text("Temperature: " + response.current.temp + " \u00B0F");
                // humidity
                currentHumidity.text("Humidity: " + response.current.humidity + "%");
                // windspeed
                currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + " MPH");
                // uv-index with conditions for color code
                currentUVIndex.text("UV Index: " + response.current.uvi);
                
                if (response.current.uvi < 3) {
                    currentUVIndex.addClass("low-uv");
                }else if (response.current.uvi >= 3 && response.current.uvi < 6) {
                    currentUVIndex.addClass("moderate-uv");
                }else if (response.current.uvi >=6 && response.current.uvi < 8) {
                    currentUVIndex.addClass("high-uv");
                }else if (response.current.uvi >= 8 && response.current.uvi < 11) {
                    currentUVIndex.addClass("veryhigh-uv");
                }else (response.current.uvi >= 11) {
                    currentUVIndex.addClass("extreme-uv");
                }
            })
        })
        // Error if user doesn't search a city name and leaves it blank
        .catch(function(err) {
            $("search-input").val("");
            alert("Please input a city name to search for the weather.");
        });
};