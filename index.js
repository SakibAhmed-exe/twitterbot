var Twitter = require('twitter');
var axios = require('axios');
var config = require('./keys.js');
var T = new Twit(config);


var T = new Twit({
    consumer_key:         'YOURCONSUMERKEY',
    consumer_secret:      'YOURCONSUMERSECRET',
    access_token:         'YOURACCESSTOKEN',
    access_token_secret:  'YOURACCESSTOKENSECRET'
  });