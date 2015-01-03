# SmartThings OAuth Example in Node.js

> OAuth to SmartThings, hit an "API Access App", get JSON of all things.

This barebones Node application uses a series of requests authenticate a user to SmartThings, install a "SmartApp" (see `smartapp.groovy`) for that user, and finally fetch JSON from that SmartApp of all their things.

### This program does...

* Authenticate a user to ST using OAuth 2.0
* Request the SmartApp installation's unique URL
* Immediately `GET` `/things` from that SmartApp
* Dump JSON of the things back to the browser

### This program does not...

* Create a user local to the Node app
* Cache the OAuth token
* Serve as a foundation for a full implementation, just a starting point

## Setup

* Create a SmartApp through the SmartThings Wed IDE with OAuth enabled
* Copy into that app the contest of `smartapp.groovy`
* Install Node.js
* `$ npm install`
* Adjust configuration in `index.js` (line 4)
* Run index.js
* Open the server root in a browser.

## Notes

There is a known issue with sending "localhost" in your callback url to the SmartThings OAuth server (configuration line 7). Use an IP address (terribly inconvenient for a development environment) or a tool like [Katon](https://github.com/typicode/katon).
