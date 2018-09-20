const cron = require('node-cron');
const fs = require('fs');
const http = require('http');
const express = require('express');
const hbs = require('hbs');
const socketio = require('socket.io');
const zipcodes = require('zipcodes');

const fetch_data = require('./js/fetch_data.js');
const email = require('./js/email.js');
const db = require('./js/db.js');

var app = express();
var server = http.createServer(app);
var io = socketio(server);
var subscribers = db.subscribers;

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.render('home.hbs');
});

io.on('connection', (socket) => {
  console.log('new connection received');
  socket.on('subscribe', function(userData) {
    var addrDetails = zipcodes.lookup(userData.zipcode);
    if(undefined != addrDetails){
      var new_Subscriber = new subscribers(userData);
        db.saveNewSubscriber(new_Subscriber, (saveduser) => {
          socket.emit('subscribed', `${saveduser.email} added to subscription list!`);
      });
    } else {
      socket.emit('subscribed', `Please enter a valid US zip code!`);
    }
  });

  socket.on('unsubscribe', function(userData) {
    var addrDetails = zipcodes.lookup(userData.zipcode);
    if(undefined != addrDetails){
        db.removeSubscriber(userData, () => {
        socket.emit('subscribed', `${userData.email} removed from subscription list!`);
      });
    } else {
      socket.emit('subscribed', `Please enter a valid US zip code!`);
    }
  });
});

var transporter = email.transporter;
var logMessage = '';

cron.schedule('38 15 * * *', () => {
  var todaysDate = new Date();
  logMessage = `Job started at 8:00 am on ${todaysDate}\n`;

  var userData = [];
  db.listAllSubscribers((all) => {

    all.forEach(function(users) {

      var userName = users.firstName;
      var emailId = users.email;
      var zipcode = users.zipcode;
      var addUrl = email.addressUrl + zipcode;

      fetch_data.getLocation(addUrl, (cordinates) => {
        if(Object.keys(cordinates).length > 0) {
          logMessage = logMessage + `Getting forecast for cordinates ${cordinates.lat},${cordinates.long} \n`;
          var mailOptions = email.mailOptions;
          var forecastUrl = email.forecastUrl;
          forecastUrl = `${forecastUrl}${cordinates.lat},${cordinates.long}`;

          fetch_data.getForecast(forecastUrl, (forecast) => {
            if(Object.keys(forecast).length > 0) {
              var emailBody = buildEmailBody(userName, forecast.now, forecast.today, forecast.summary);
              mailOptions['to'] = emailId;
              mailOptions['text'] = emailBody;

              logMessage = logMessage + 'Send mail triggered \n';
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  logMessage = logMessage + 'Some error occurred \n error';
                } else {
                  logMessage = logMessage + info.response + '\n';
                  }
              logMessage = logMessage + `Finishing job for ${todaysDate}\n`;
              fs.appendFileSync('log.txt', logMessage);
              });
            };
          });
        }
      });
    });
  })
});

function buildEmailBody(user, now, today, summary) {
  var body = `Good Morning ${user}!\n\nClimate outside is ${now}.\nTodays prediction is ${today}.\n\nHeads-up - This week, it is expected ${summary}\n\nHave a great day!`;
  return body;
};

server.listen(process.env.PORT || 3000);
