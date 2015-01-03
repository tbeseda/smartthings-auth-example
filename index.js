var debug   = require('debug')('http');

// Application Configuration
var config = {
  port: process.env.PORT || 8080,
  api_root: 'https://graph.api.smartthings.com',
  server_address: 'YOUR SERVER ADDRESS',
  oauth: {
    clientID: 'YOUR OAUTH CLIENT ID',
    clientSecret: 'YOUR OAUTH CLIENT SECRET',
    site: 'https://graph.api.smartthings.com',
    tokenPath: '/oauth/token'
  }
}

var express = require('express');
var request = require('request');
var oauth2  = require('simple-oauth2')(config.oauth);

// create auth uri for SmartThings
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: config.server_address+'/callback',
  scope: 'app'
});

var app = express();

app.get('/', function (req, res) {
  res.send('<a href=/auth>Login with SmartThings</a>');
});

app.get('/auth', function (req, res) {
  // redirect to SmartThings auth uri
  res.redirect(authorization_uri);
});

app.get('/callback', function (req, res) {
  // parse request from SmartThings and get access token
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: config.server_address + '/callback'
  }, function (error, result) {
    if (error) { debug('Access Token Error', error); }

    // extract auth token
    var token = oauth2.accessToken.create(result);
    // setup request options with uri to get this app's endpoints
    // and add retrieved oauth token to auth header
    var request_options = {
      uri: config.api_root+'/api/smartapps/endpoints',
      headers: { Authorization: 'Bearer '+token.token.access_token }
    }

    request(request_options, function(error, response, body) {
      if (error) { debug('Endpoints Request Error', error); }

      // extract the app's unique installation url
      var installation_url = JSON.parse(body)[0]['url'];
      // reuse request options with new uri for the "things" endpoint
      // specific to this app installation
      request_options.uri = config.api_root + installation_url + '/things'

      request(request_options, function(error, response, body){
        var all_things = JSON.parse(body)
        res.json(all_things); // send JSON of all things
      });
    });
  });
});

app.listen(config.port, function() {
  debug('Server running on port', port);
});
