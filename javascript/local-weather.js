(function () {

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
            symbol = "&deg",
            degrees = ['high', 'low', 'chill', 'temp'];

        degrees.forEach(setTemp, this);

        function setTemp(id) {
            // currentTemp = document.getElementById("temp");
            currentTemp = document.getElementById(id);

            // temp = currentTemp.innerHTML.slice(0, currentTemp.innerHTML.indexOf(" "));
            temp = currentTemp.innerHTML.slice(0, -2);
            type = currentTemp.innerHTML.slice(-1);

            //console.log('temp: ' + temp);
            //console.log('type: ' + type);

            if (type == 'F') {
                // convert from F
                //(°F  -  32)  x  5/9 = °C
                newTemp = ((temp - 32) * (5 / 9)).toFixed();
                newTemp += symbol + "C";
            } else if (type == 'C') {
                // convert from C
                // °C  x  9/5 + 32 = °F
                newTemp = ((temp * (9 / 5)) + 32).toFixed();
                newTemp += symbol + "F";
            }
            //console.log("newTemp " + newTemp);
            currentTemp.innerHTML = newTemp;
        }

    }

    function degToCompass(num) {
        var val = Math.floor((num / 22.5) + 0.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[(val % 16)];
    }

    function getLocation() {
        // console.log('getLocation start');
        $.getJSON('http://api.ipstack.com/check?access_key=da7d4b791cc474c2bda28dc23ca0a19a', function (data) {
            // console.log(data);
            getWeather(data.zip);
        });

    }

    function getWeather(zip) {
        var degree = String.fromCharCode(176);
        var percent = String.fromCharCode(37);
        var yahooQuery = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + zip + ' limit 1")';
        var now = new Date();
        var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?format=json&q=';
        // console.log(weatherUrl + yahooQuery);
        $.getJSON(weatherUrl + yahooQuery, function (results) {
            // console.log(results.query.results.channel);
            var data = results.query.results.channel;
            // console.log(data);
            var weather = {};

            weather.city = data.location.city;
            weather.temp = data.item.condition.temp;
            weather.title = data.item.title;
            weather.currently = data.item.condition.text;
            weather.code = data.item.condition.code;
            weather.todayCode = data.item.forecast[0].code;
            weather.high = data.item.forecast[0].high;
            weather.low = data.item.forecast[0].low;
            weather.text = data.item.forecast[0].text;
            weather.humidity = data.atmosphere.humidity;
            weather.pressure = data.atmosphere.pressure;
            weather.rising = data.atmosphere.rising;
            weather.visibility = data.atmosphere.visibility;
            weather.sunrise = data.astronomy.sunrise;
            weather.sunset = data.astronomy.sunset;
            weather.description = data.item.description;
            weather.country = data.location.country;
            weather.chill = data.wind.chill;
            weather.speed = data.wind.speed;
            weather.direction = data.wind.direction;

            if (data.item.condition.code == '3200') {
                weather.thumbnail = undefined;
                weather.image = undefined;
            } else {
                weather.thumbnail = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + data.item.condition.code + 'ds.png';
                weather.image = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + data.item.condition.code + 'd.png';
            }

            // console.log(weather);

            $('#city').text(weather.city + " Weather");
            $('#condition').text(weather.text);
            $('#currently').text(weather.currently);
            $('#thumb').attr('src', weather.thumbnail);
            $('#image').attr('src', weather.image);
            $('#high').text(weather.high + degree + "F");
            $('#low').text(weather.low + degree + "F");
            $('#humidity').text(weather.humidity + percent);
            $('#pressure').text(weather.pressure + ' in');
            $('#visibility').text(weather.visibility + ' mi');
            $('#sunrise').text(weather.sunrise);
            $('#sunset').text(weather.sunset);
            $('#chill').text(weather.chill + degree + "F");
            $('#speed').text(weather.speed + " mi");
            $('#direction').text(degToCompass(weather.direction));

            var description = weather.description;
            description = description.slice(9, -4);
            description = description.replace(/Low/gm, " Low");
            description = description.replace(/<img.+>/, "");
            description = description.replace(/<BR.+>/, "");
            // console.log(description);
            $('#description').html(description);

            var myTemp = weather.temp;
            myTemp += degree + "F";
            $('#temp').text(myTemp);
        });

    }

    $(document).ready(function () {
        'use strict';
        // console.log('document ready');
        getLocation();
        $("#temp").on("click", convertTemp);
    });

})();