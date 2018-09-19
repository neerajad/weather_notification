const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'username@email.com',
    pass: 'yourpassword'
  }
});

var mailOptions = {
  from: 'someone@email.com',
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
