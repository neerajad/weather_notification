const request = require('request');

//This method gets the latitude and longitude for given address
var getLocation = (address, callback) => {
  var loc = {};
  request({
    url: address,
    json:true
  }, (error, response, body) => {
    if (undefined != body.results) {
      var res = body.results[0].locations[0].latLng;
      loc = {
        long : res.lng,
        lat : res.lat
      };
    }
     callback(loc);
  });
};

//This method gets the weather forecast for given address
var getForecast = (urlStr, callback) => {
  var forecastData = {};
  request({
    url: urlStr,
    json: true
  }, (error, response, body) => {
    if (undefined != body.currently) {
      forecastData = {
        now: body.currently.summary,
        today: body.daily.data[0].summary,
        summary: body.daily.summary
      };
    };
    callback(forecastData);
  });
};

module.exports = {
  getLocation,
  getForecast
}
