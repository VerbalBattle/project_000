var request = require('request');
var baseRoute = "https://en.wikipedia.org/w/api.php";
var cheerio = require('cheerio');

// example GET request to main page of Wikipedia
// https://en.wikipedia.org/w/api.php?
// action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json

// Wiki helper master object
var wikiHelper = {};

// Wiki helper retrieve wiki
wikiHelper.getWiki = function (data) {
  // initializing avatar props
  var avatarName = data.avatarName;
  var callback = data.callback;

  // properties object for GET request, keys values get inserted
  // as query params by request class
  var propertiesObject = {
    action: 'query',
    titles: avatarName,
    prop: 'revisions',
    rvprop: 'content',
    format: 'json',
    formatversion: 2,
    utf8: true
  };

  // ONCE DATA IS RETRIEVED OR COULDN'T BE RETRIEVED
  request({url: baseRoute, qs: propertiesObject}, function ( err, response, body) {
    if ( err) {
      console.log(err); return;
    }

    var respObj = JSON.parse(body);

    // check if the API recommends a redirect
    var content = respObj.query.pages[0].revisions[0].content;
    if ( content.indexOf("REDIRECT") > -1) {
      // find where wikipedia recommends we redirect our search to
      var startIndex = content.indexOf("[[") + 2;
      var char = content[startIndex];
      var buffer = "";

      while ( char !== "]") {
        buffer += content[startIndex];
        startIndex++;
        char = content[startIndex];
      }

      propertiesObject.titles = buffer;

      // rerun the GET request with the redirect title
      request({url: baseRoute, qs: propertiesObject}, function ( err, response, body) {
        if ( err) {
          console.log(err); return;
        }

        callback( JSON.parse(body));
      });
    } else {
      callback( respObj);
    }
  });
};

wikiHelper.scrapeWiki = function (data) {
  // initializing avatar props
  var avatarName = data.avatarName;
  var callback = data.callback;

  // The URL we will scrape from - in our example Anchorman 2.

  url = "https://en.wikipedia.org/wiki/" + avatarName;

  // The structure of our request call
  // The first parameter is our URL
  // The callback function takes 3 parameters, an error, response status code and the html
  request( url, function (error, response, html) {
    if (!error) {
        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
        var $ = cheerio.load(html);

        // extract out the image from the infobox and return html to client
        $('.infobox .image').parent().parent().remove();
        callback($.html('.infobox'));
    } else {
      callback(error);
    }
  });
};

// helper method to parse the content given to us from wikipedia
wikiHelper.parseContent = function (content) {

};

// Export wiki helper
module.exports = wikiHelper;
