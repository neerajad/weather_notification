const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: <<user>>,
    pass: <<pwd>>
  }
});

var mailOptions = {
  from: <<email>>,
  subject: 'Todays Forecast'
};

var addressUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=KEY&location=`;

var forecastUrl = `https://api.darksky.net/forecast/KEY/`;

module.exports = {
  transporter,
  mailOptions,
  addressUrl,
  forecastUrl
};
