// global variables
var apiKey = "88210bf2a33543b3ce223b8472705549";
var searchesStored = []



var currentWeatherBox = function(cityName){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response){
            // turns response into objects
            return response.json();
            console.log(response);
        })
        .then(function(response){
            var cityLatitude = response.coord.lat
            var cityLongitude = response.coord.lon

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`)
            // turn response into objects again
            .then(function(response){
                return response.json();
                console.log(response);
            })
            // Now use the data from response to populate current weather container
            .then(function(response){
                searchHistoryList(cityName);

                var currentWeatherContainer = $("#current-weather-container");
                currentWeatherContainer.addClass("current-weather-container");

                // add in data to container
                // City and Date
                var currentCityName = $("#current-cityname");
                var currentDay = moment().format("M/D/YYYY");
                currentCityName.text(`${cityName} (${currentDay})`);
                // Icon
                var currentIcon = $("#current-weather-icon"); 
                currentIcon.addClass("current-weather-icon");
                var currentIconCode = response.current.weather[0].icon;
                currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);
                // temperature
                var currentTemperature = $("#current-temperature");
                currentTemperature.text("Temperature: " + response.current.temp + "C");
                // humidity
                var currentHumidity = $("#current-humidity");
                currentHumidity.text("Humidity: " + response.current.humidity + "%");
                // windspeed
                var currentWindSpeed = $("#current-windspeed");
                currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + " m/s");
                // uv-index with conditions for color code
                var currentUVIndex = $("#current-uv-index");
                currentUVIndex.text("UV Index: " + response.current.uvi);
                
                if (response.current.uvi < 3) {
                    currentUVIndex.addClass("low-uv");
                }else if (response.current.uvi >= 3 && response.current.uvi < 6) {
                    currentUVIndex.addClass("moderate-uv");
                }else if (response.current.uvi >=6 && response.current.uvi < 8) {
                    currentUVIndex.addClass("high-uv");
                }else if (response.current.uvi >= 8 && response.current.uvi < 11) {
                    currentUVIndex.addClass("veryhigh-uv");
                }else  {
                    currentUVIndex.addClass("extreme-uv");
                }
            })
        })
        // Error if user doesn't search a city name and leaves it blank
        .catch(function(err) {
            $("search-input").val("");
            alert("Please input a valid city to search for the weather.");
        });
};

var fiveDayForecastBox = function(cityName){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(function(response){
        // turns response into objects
        return response.json();
    })
    .then(function(response){
        var cityLatitude = response.coord.lat
        var cityLongitude = response.coord.lon

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`)
        // turn response into objects again
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            // USING THIS TO TEST CAN REMOVE LATER
            console.log(response);

            var futureForecastTitleEl = $("#future-forecast-container-title");
            futureForecastTitleEl.text("Upcoming 5-Day Forecast:")

            for (var i = 1; i <= 5; i++){
                var futureForecastCard = $(".future-forecast-card");
                futureForecastCard.addClass("future-card-stats");
                // date
                var futureForecastDate = $("#future-forecast-date-" + i);
                date = moment().add(i,"d").format("M/D/YYYY");
                futureForecastDate.text(date);
                // icon
                var futureForecastIcon = $("#future-forecast-icon-" + i);
                futureForecastIcon.addClass("future-forecast-icon");
                var futureForecastIconCode = response.daily[i].weather[0].icon;
                futureForecastIcon.attr("src", `https://openweathermap.org/img/wn/${futureForecastIconCode}@2x.png`);
                // temperature
                var futureForecastTemperature = $("#future-forecast-temperature-" + i);
                futureForecastTemperature.text("Temp: " + response.daily[i].temp.day + "C");
                // humidity
                var futureForecastHumidity = $("#future-forecast-humidity-" + i);
                futureForecastHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                // windspeed
                var futureForecastWindSpeed = $("#future-forecast-windspeed-" + i);
                futureForecastWindSpeed.text("Wind Speed: " + response.daily[i].wind_speed + "m/s");
            }
        })
    })   
};

// Function to make a searched city part of the search history below the input
var searchHistoryList = function(cityName) {
    $('.search-history:contains("' + cityName + '")').remove();
    // makes new p element for city name 
    var searchHistoryEl = $("<p>");
    searchHistoryEl.addClass("search-history");
    searchHistoryEl.text(cityName);
    // gives name container
    var searchInputContainer = $("<div>");
    // CHECK IF NECESSARY DON'T FORGET
    searchInputContainer.addClass("past-search-container");
    // append to container
    searchInputContainer.append(searchHistoryEl);
    // append to search-history-container
    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchInputContainer);
    
    // Checks if array already has searches saved in local storage and gets them
    if (searchesStored.length > 0){
        var existingSearchesStored = localStorage.getItem("searchesStored");
        searchesStored = JSON.parse(existingSearchesStored);
    }
    // Adds the city to the array of searches for storing
    searchesStored.push(cityName);
    localStorage.setItem("searchesStored", JSON.stringify(searchesStored));

    // Then have the search input reset so the user doesn't have to manually delete
    $("#search-input").val("");
    // If the it has already been seached then remove the past-search item

};

// Function to load the saved local history when the user clicks the city's button
var loadHistoryList = function(){
    var storedSearchHistory = localStorage.getItem("searchesStored");
    if (!storedSearchHistory){
        return false;
    }

    storedSearchHistory = JSON.parse(storedSearchHistory);
    // need to make a loop to go through all the storedsearch history and have it all added to the list
    for (var i = 0; i < storedSearchHistory.length; i++) {
        searchHistoryList(storedSearchHistory[i]);
    }
    
};

$("#searchform").on("submit", function(){
    event.preventDefault();
    var cityName = $("#search-input").val();

        currentWeatherBox(cityName);
        fiveDayForecastBox(cityName);

})

$("#search-history-container").on("click", "p", function(){
    var historyCityName = $(this).text();
    currentWeatherBox(historyCityName);
    fiveDayForecastBox(historyCityName);

    var historyCityNamePicked = $(this);
    historyCityNamePicked.remove();

});

loadHistoryList();
