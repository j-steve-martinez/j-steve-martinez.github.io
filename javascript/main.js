/**
 * This is the bootstrap for the site
 */

"use strict";

/**
 * DOM ready
 */

window.onload = () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
    // var script = document.createElement("script");
    // script.type = "text/javascript";
    // script.src = "/javascript/tic_tac_toe.js";
    // document.body.appendChild(script);
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    var crd = pos.coords;
    console.log(crd);
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`Accuracy More or less ${crd.accuracy} meters.`);

    var degree = String.fromCharCode(176);
    var percent = String.fromCharCode(37);
    var yahooQuery = 'select * from weather.forecast where woeid in (SELECT woeid FROM geo.places WHERE text="(' + crd.latitude +',' + crd.longitude + ')")' 
    // var yahooQuery = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + zip + ' limit 1")';
    var now = new Date();
    var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?format=json&q=';
    // console.log(weatherUrl + yahooQuery);
    $.getJSON(weatherUrl + yahooQuery, function (results) {
        console.log('yahoo mfers');
        // console.log(results);
        console.log(results.query.results.channel);
        var data = results.query.results.channel;
        // // console.log(data);
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

        console.log(weather);
        var pairs = Object.entries(weather);
        pairs.forEach((item)=>{
            console.log(item);
        });

        // $('#city').text(weather.city + " Weather");
        // $('#condition').text(weather.text);
        // $('#currently').text(weather.currently);
        // $('#thumb').attr('src', weather.thumbnail);
        // $('#image').attr('src', weather.image);
        // $('#high').text(weather.high + degree + "F");
        // $('#low').text(weather.low + degree + "F");
        // $('#humidity').text(weather.humidity + percent);
        // $('#pressure').text(weather.pressure + ' in');
        // $('#visibility').text(weather.visibility + ' mi');
        // $('#sunrise').text(weather.sunrise);
        // $('#sunset').text(weather.sunset);
        // $('#chill').text(weather.chill + degree + "F");
        // $('#speed').text(weather.speed + " mi");
        // $('#direction').text(degToCompass(weather.direction));

        // var description = weather.description;
        // description = description.slice(9, -4);
        // description = description.replace(/Low/gm, " Low");
        // description = description.replace(/<img.+>/, "");
        // description = description.replace(/<BR.+>/, "");
        // // console.log(description);
        // $('#description').html(description);

        var myTemp = weather.temp;
        myTemp += degree + "F";
        $('#temp').text(myTemp);
    });
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  