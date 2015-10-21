var request = require('request');
var baseRoute = "https://en.wikipedia.org/w/api.php";

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

// Export wiki helper
module.exports = wikiHelper;