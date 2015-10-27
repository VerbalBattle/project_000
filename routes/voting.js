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

// Require authneticator
var authenticator = require('../server/authenticator');

// Require rooms helper
var judging = require('../server/data').judging;

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// POST to join voting queue
router.get('/', authenticator.ensureAuthenticated,
  function (req, res, next) {
  // Expected request body example
  // {}

  // Decrypt token
  var decrypted = req.body.decrypted;

  // User ID
  var userID = decrypted.userID;
  // Callback
  var callback = function (result) {
    res.send(result);
  };

  // Log
  console.log('\n\nATTEMPTING TO GET ROOMS TO JUDGE FOR',
    userID, '\n\n');
  // Attempt to add to voting queue
  judging.getRoomsToJudge(userID, callback);

  // Expected result sent to client
  // [roomObj1, roomObj2, ...]
});
module.exports = router;
