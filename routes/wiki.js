// Note: comments done with
// http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

//                       _              _
//                      (_)            | |
//  _ __ ___  __ _ _   _ _ _ __ ___  __| |
// | '__/ _ \/ _` | | | | | '__/ _ \/ _` |
// | | |  __/ (_| | |_| | | | |  __/ (_| |
// |_|  \___|\__, |\__,_|_|_|  \___|\__,_|
//              | |
//              |_|

// Requirements
var express = require('express');
var router = express.Router();
var wikiHelper = require('../lib/wikiHelper');

//                  _
//                 | |
//  _ __ ___  _   _| |_ ___  ___
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// GET to signup a new user
router.get('/:avatarName', authenticator.ensureAuthenticated,
  function (req, res, next) {

  // Data to pass avatar signup
  var data = {
    // Avatar name
    avatarName: req.params.avatarName,
    // Callback
    callback: function (result) {
      // filter out profile snippets from result
      // var content = result.query.pages[0].revisions[0].content;

      // parse content from sent to us from wikipedia
      // wikiHelper.parseContent(content);

      res.send(result);
    }
  };

  // Log
  console.log('\n\nFETCHING FROM WIKI:',
    data.avatarName, '\n\n');
  // Attempt to get wiki
  wikiHelper.scrapeWiki(data);

  // Expected result sent to client
  // None
});
module.exports = router;
