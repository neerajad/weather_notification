const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'weather.today.forecast@gmail.com',
    pass: 'weatherforecast123'
  }
});

var mailOptions = {
  from: 'weather.today.forecast@gmail.com',
  subject: 'Todays Forecast'
};

var addressUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=FCLKi64TADorTWZdNNrW8NkCd8lrMqVy&location=`;

var forecastUrl = `https://api.darksky.net/forecast/1ca9f7c6e02b26f358b230fc33f02951/`;

module.exports = {
  transporter,
  mailOptions,
  addressUrl,
  forecastUrl
};
