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
var judger = require('../server/data').judger;

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// GET route to receive rooms to judge for a client
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
  judger.getRoomsToJudge(userID, callback);

  // Expected result sent to client
  // [roomObj1, roomObj2, ...]
});

// PUT route to cast a vote for a specified roomID
router.put('/:roomID', authenticator.ensureAuthenticated,
  function (req, res, next) {
  // Expected request body example
  // {
  //   upVoteID: (1 or 2)
  // }

  // Decrypt token
  var decrypted = req.body.decrypted;
  // Data to pass to judging
  var data = {
    // User ID
    userID: decrypted.userID,
    // Room ID
    roomID: req.params.roomID,
    // Up vote ID (1 or 2 for avatar1 or avatar2)
    upVoteID: req.body.upVoteID
  };

  // Callback
  var callback = function (result) {
    res.send(result);
  };

  // Log
  console.log('\n\nATTEMPTING TO CAST VOTE ON ROOM',
    data.roomID, 'FOR AVATAR', data.upVoteID);
  // Handoff to judging
  judger.judgeOneRoom(data, callback);
});

module.exports = router;
