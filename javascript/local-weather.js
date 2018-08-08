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
    console.log(crd);
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`Accuracy More or less ${crd.accuracy} meters.`);

    /**
     * Start Yahoo Query
     */
    var yahooQuery = 'select * from weather.forecast where woeid in (SELECT woeid FROM geo.places WHERE text="(' + crd.latitude + ',' + crd.longitude + ')")'
    var now = new Date();
    var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?format=json&q=';
    // console.log(weatherUrl + yahooQuery);
    $.getJSON(weatherUrl + yahooQuery, function (results) {
        console.log('yahoo mfers');
        var data = results.query.results.channel;
        var weather = {};

        weather.city = data.location.city;
        weather.country = data.location.country;

        weather.currently = data.item.condition.text;
        weather.visibility = data.atmosphere.visibility;
        
        weather.temp = data.item.condition.temp;
        weather.direction = data.wind.direction;
        
        weather.high = data.item.forecast[0].high;
        weather.speed = data.wind.speed;
        
        weather.low = data.item.forecast[0].low;
        weather.chill = data.wind.chill;
        
        weather.sunrise = data.astronomy.sunrise;
        weather.pressure = data.atmosphere.pressure;
        
        weather.sunset = data.astronomy.sunset;        
        weather.humidity = data.atmosphere.humidity;

        if (data.item.condition.code == '3200') {
            weather.thumbnail = undefined;
            weather.image = undefined;
        } else {
            weather.thumbnail = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + data.item.condition.code + 'ds.png';
            weather.image = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + data.item.condition.code + 'd.png';
        }
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
    nWrap.style.backgroundImage = 'url(' + image + ')';;

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
            case 'thumbnail':
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
                        nVal.innerText += "/mi";
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
