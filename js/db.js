const mongoose = require('mongoose');

mongoose.promise = global.promise;
mongoose.connect('mongodb://admin:password!1@ds161322.mlab.com:61322/weathernotification');

// Model subscriber to save to database
var subscribers = mongoose.model('subscribers', {
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  zipcode: {
    type: Number
  }
});

// This method adds a new subscriber to database
var saveNewSubscriber = (new_Subscriber, callback) => {
  new_Subscriber.save().then((doc) => {
    callback(doc);
  }, (e) => {
    console.log('error saving to db');
  });
};

// This method get all subscribers during morning job run to send weather notification
var listAllSubscribers = (callback) => {
  subscribers.find().then((doc) => {
    callback(doc);
  }, (e) => {
    console.log('error saving to db');
  });
};

module.exports = {
  subscribers,
  saveNewSubscriber,
  listAllSubscribers
}
