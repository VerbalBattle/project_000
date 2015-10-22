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
var roomsHelper = require('../db/roomsHelper');

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// POST to join voting queue
router.post('/', authenticator.ensureAuthenticated,
  function (req, res, next) {
  // Expected request body example
  // {}

  // Decrypt token
  var decrypted = req.body.decrypted;

  // Data to pass to voting enqueue
  var data = {
    // UserID
    userID: decrypted.userID,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };

  // Log
  console.log('\n\nATTEMPTING ADDING TO BACK OF LINE:',
    data.avatarID, '\n\n');
  // Attempt to add to voting queue
  roomsHelper.queueForVote(data);

  // Expected result sent to client
  // {
  //   inVotingQueue: true
  // }
});
module.exports = router;
