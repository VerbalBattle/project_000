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

// POST to join matchmaking
router.post('/', authenticator.ensureAuthenticated,
  function (req, res, next) {
  // Expected request body example
  // {
    // "avatarID": 12,
    // "avatarStats": {
    //   "winLossRatio": 0,
    //   "avatarType": "untyped",
    //   "elo": 1000,
    //   "winStreak": 0
    // }
  // }

  // Decrypt token
  var decrypted = req.body.decrypted;

  // Data to pass matchmaking
  var data = {
    // UserID
    userID: decrypted.userID,
    // AvatarID
    avatarID: req.body.avatarID,
    // Avatar data
    avatarStats: req.body.avatarStats,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };

  // Log
  console.log('\n\nATTEMPTING ADDING TO BACK OF LINE:',
    data.avatarID, '\n\n');
  // Attempt to add
  roomsHelper.enqueueToPlay(data);

  // Expected result sent to client
  // {
  //   inRoomQueue: true
  // }
});
module.exports = router;
