require('dotenv').config()
const Twit = require('twit');
var Q = require("q");
var request = require("request");
var fs = require('fs');
/* var Twitter = require('twitter'); */

var T = new Twit ({
    consumer_key: process.env.TWIT_CONSUMER_KEY,
    consumer_secret: process.env.TWIT_CONSUMER_SECRET,
    access_token: process.env.TWIT_ACCESS_TOKEN,
    access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET
});

var stream = T.stream('statuses/filter', {track: '@<allballbot>'}
);

stream.on('tweet', tweetEvent);

function expandUrl(shortUrl) {
    var deferred = Q.defer();
    request({method:"HEAD",url:shortUrl,followAllRedirects: true},
    function (error,response) {
        if(error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(response.request.href);
        }
    });
    return deferred.promise;
}

function tweetEvent(tweet) {

    var reply_to = tweet.in_reply_to_screen_name;
    var txt = tweet.text
    short_url = txt.replace(/@allballbot /g,'');
    var tweet_link = '';
    expandUrl(short_url)
    .then(function (longUrl) {
      var my_regex = /https:\/\/twitter\.com\/([a-zA-Z0-9_.]+)\/status\/([0-9]+)\?/g;
  
      var extracted_info = my_regex.exec(longUrl);
      var name = extracted_info[1];
      var id = extracted_info[2];
      if (reply_to === 'allballbot') {
        var file_text = '';
        fs.readFile('Input.txt', (err, data) => { 
          if (err) throw err; 
          file_text = data.toString(); 
          var replyText = '@'+ name + ' ' + file_text + ' Right?!';
          T.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, tweeted);
          function tweeted(err, reply) {
            if (err) {
              console.log(err.message);
            } else {
              console.log('Tweeted: ' + reply.text);
            }
          }
        })
      }
    });
}

var postBasketball = () => { T.post('statuses/update', {status: "🏀"}, function(err, data, response) {
    console.log(data)
    }); 
};


    