/**
 * Local Weather
 */
function convertTemp() {

    'use strict';
    /*
     °C  x  9/5 + 32 = °F
     (°F  -  32)  x  5/9 = °C
     */
    var newTemp,
        currentTemp,
        type,
        temp,
        degree = "&deg";
    /**
     * Get all the elements with temperature displayed
     */
    var allTemperatures = document.getElementsByClassName('temperature');
    /**
     * Loop through the elements and convert the temperature
     *  Celcus <=> Farenhite
     */
    for (const wElement in allTemperatures) {
        if (allTemperatures.hasOwnProperty(wElement)) {
            setTemp(allTemperatures[wElement].id)
        }
    }

    function setTemp(id) {
        try {
            currentTemp = document.getElementById(id);
            temp = currentTemp.innerHTML.slice(0, -2);
            type = currentTemp.innerHTML.slice(-1);

            if (type == 'F') {
                /**
                 * Convert to C
                 * (°F  -  32)  x  5/9 = °C
                 */
                newTemp = ((temp - 32) * (5 / 9)).toFixed();
                newTemp += degree + "C";
            } else if (type == 'C') {
                /**
                 * Convert to F
                 * °C  x  9/5 + 32 = °F
                 */
                newTemp = ((temp * (9 / 5)) + 32).toFixed();
                newTemp += degree + "F";
            }

            currentTemp.innerHTML = newTemp;

        } catch (error) {
            console.log(error);
        }


    }

}

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function geoSuccess(pos) {
    var crd = pos.coords;
    // console.log(crd);
    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`Accuracy More or less ${crd.accuracy} meters.`);

    /**
     * Start openWeatherMap Query
     * A special point and API key are used to display samples:
https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22 
da6341d9ede527e10d0c18350384ce9c
     */
    var lat = crd.latitude;
    var lon = crd.longitude;
    var digimon = 'da6341d9ede527e10d0c18350384ce9c';
    var openWeatherMap = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&' + 'lon=' + lon + '&' + 'units=imperial' + '&' + 'appid=' + digimon;

    // console.log(openWeatherMap);
    
    // var mockResults = {
    //     "coord":{"lon":-122.34,"lat":37.58},
    //     "weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],
    //     "base":"stations",
    //     "main":{"temp":295.18,"pressure":1017,"humidity":88,"temp_min":289.82,"temp_max":299.26},
    //     "visibility":16093,
    //     "wind":{"speed":4.1,"deg":330,"gust":7.7},
    //     "clouds":{"all":90},
    //     "dt":1567542027,
    //     "sys":{"type":1,"id":4322,"message":0.0144,"country":"US","sunrise":1567518081,"sunset":1567564594},
    //     "timezone":-25200,
    //     "id":5392423,
    //     "name":"San Mateo",
    //     "cod":200
    // };
    // console.log(mockResults);
    // iconSample = 'http://openweathermap.org/img/wn/10d@2x.png';
    iconBase = 'http://openweathermap.org/img/wn/';
    // var now = new Date();
    $.getJSON(openWeatherMap, (results)=>{
        // console.log(results);
        // var data = mockResults;
        var data = results;
        var weather = {};

        weather.city = data.name;
        weather.country = data.sys.country;

        weather.currently = data.weather[0].description;
        weather.visibility =  Number.parseFloat(data.visibility / 1609.344).toFixed(2); //data.visibility / 1609.344;
        
        weather.temp = data.main.temp;
        weather.direction = data.wind.deg;
        
        weather.high = data.main.temp_max;
        weather.speed = data.wind.speed;
        
        weather.low = data.main.temp_min;
        
        weather.sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        weather.pressure = data.main.pressure;

        weather.sunset =  new Date(data.sys.sunset * 1000).toLocaleTimeString();        
        weather.humidity = data.main.humidity;

        weather.thumbnail = iconBase + data.weather[0].icon + '@2x.png'

        var peanutButter = {};
        peanutButter = JSON.stringify(weather)
        setCookie("weather", peanutButter, 15, "max-age");

        setLWScreen(weather);
    });
    // end ajax
}

function geoError(err) {
    /**
     * Get the node and update screen
     */
    console.warn(`ERROR(${err.code}): ${err.message}`);
    var nChild = document.getElementById("local-weather");
    nChild.innerText = "It's always a great day even when, " + err.message + ", in bed";
}

function setLWScreen(weather) {
    // console.log(weather)
    /**
     * define some symbols for display
     */
    var degree = String.fromCharCode(176);
    var percent = String.fromCharCode(37);

    /**
     * Get the node and clear the text
     */
    var nChild = document.getElementById("local-weather");
    nChild.innerText = "";

    var nWrap = document.createElement("div");
    nWrap.className = "weather-wrapper";

    var image = weather.image;
    var thumb = weather.thumbnail;

    /**
     * Add images 
     */
    // nWrap.style.backgroundImage = 'url(' + image + ')';;

    var nBtnConvert = document.createElement('button');
    nBtnConvert.innerText = "Convert";
    nBtnConvert.className = "weather-image";
    nBtnConvert.id = "btn-convert";
    nChild.appendChild(nBtnConvert);

    /**
     * Loop through weather pairs
     */
    var pairs = Object.entries(weather);
    pairs.forEach((item) => {
        /**
         * Filter out images
         */
        switch (item[0]) {
            case 'image':
            // case 'thumbnail':
                break
            default:
                /**
                 * Create new elements with default name, value, class
                 */
                var nName = document.createElement("div");
                var nVal = document.createElement("div");
                /**
                 * Set unique id
                 */
                nName.id = "n-" + item[0];
                nVal.id = "v-" + item[0]
                /**
                 * Set the classname
                 */
                nName.className = "weather-name";
                nVal.className = "weather-value";
                /**
                 * Format the name to first letter uppercase
                 */
                var first = item[0].split("")[0].toUpperCase();
                var rest = item[0].split("").slice(1).join("");
                nName.innerText = first + rest;

                /**
                 * Format the values
                 */
                nVal.innerText = item[1];
                switch (item[0]) {
                    case 'temp':
                        nName.innerText = "Now";
                    case 'high':
                    case 'low':
                    case 'chill':
                        nVal.innerText += degree + "F";
                        nVal.className += " temperature";
                        break;
                    case 'direction':
                        nVal.innerText = degToCompass(item[1]);
                        nName.innerText = "Wind"
                        break;
                    case 'visibility':
                        nVal.innerText += "/miles";
                        break;
                    case 'speed':
                        nVal.innerText += "/mph";
                        break;
                    case 'pressure':
                        nVal.innerText += "/psi";
                        break
                    case 'humidity':
                        nVal.innerText += percent;
                        break
                    case 'currently':
                        nName.innerText = "Condition";
                        break
                    case 'thumbnail':
                        nName.innerText = "";
                        nVal.innerHTML = '<image src=' +  nVal.innerText + '>';
                        break;
                    default:
                        break;
                }
                /**
                 * Update the wrapper
                 */
                nWrap.appendChild(nName);
                nWrap.appendChild(nVal);
        }
    });

    /**
     * Update the screen
     */
    nChild.appendChild(nWrap);
    /**
     * Set a click handler to convert temperature
     */
    $("#btn-convert").on("click", convertTemp);

}

window.onload = () => {
    if ("geolocation" in navigator) {
        /**
         * available
         */
        var weather = getCookie("weather");
        // console.log(weather)
        if (weather) {
            // console.log('cookie data');
            setLWScreen(JSON.parse(weather));
        } else {
            var geoOptions = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            // console.log('no cookie data');
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
        }
    } else {
        /**
         * unavailable
         */
        var nChild = document.getElementById("weather");
        nChild.innerText = "Turn on geolocation and try again.";
    }
}
