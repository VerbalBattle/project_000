// Wiki helper master object
var wikiHelper = {};

// Wiki helper retrieve wiki
wikiHelper.getWiki = function (data) {
  // Avatar name
  var avatarName = data.avatarName;
  // Callback
  var callback = data.callback;

  // Result to send to player
  var result = {};

  // ONCE DATA IS RETRIEVED OR COULDN'T BE RETRIEVED
  // callback(result)
  callback(result);
};

// Export wiki helper
module.exports = wikiHelper;