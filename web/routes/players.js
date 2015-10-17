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
var playersHelper = require('../db/db_helpers').playersHelper;

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// Create a user in the database
router.post('/', function (req, res, next) {
  // Expected request body example
  // {
  //     "userID": "joey",
  //     "playerData": {
  //         "playername": "joey's player",
  //         "imagePath": "some/image/path.png",
  //         "aboutMe": "I'm joey and I play to win."
  //     }
  // }

  // Data to pass to addPlayer
  var data = {
    // Username
    userID: req.body.userID,
    // Player data
    playerData: req.body.playerData,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };
  // Log route called
  console.log('\n\nNEW PLAYER\n\n');
  // Handoff to players helper
  playersHelper.addPlayer(data);

  // Expected result sent to client
  // {
  //   "playerCreated": true,
  //   "playerCount": 3,
  //   "playerAlreadyExists": false,
  //   "playerData": {
  //     "playername": "laura's waffle",
  //     "imagePath": "something/goes/here.png",
  //     "aboutMe": "I'm laura and I play to win.",
  //     "playerID": 4
  //   },
  //   "playerStats": {
  //     "winLossRatio": 0,
  //     "playerType": "untyped",
  //     "winVelocity": 0,
  //     "rank": 0,
  //     "winStreak": 0
  //   }
  // }
});

// Delete a user in the database
router.delete('/', function (req, res, next) {
  // Expected request body example
  // {
  //     "userID": 1,
  //     "playerID": 3
  // }

  // Data to pass to deletePlayer
  var data = {
    // Username
    userID: req.body.userID,
    // Playername
    playerID: req.body.playerID,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };
  // Log route called
  console.log('\n\nDELETE PLAYER\n\n', data);
  // Handoff to players helper
  playersHelper.deletePlayer(data);

  // Expected result sent to client
  // {
  //   "removeSuccess": true
  // }
});
module.exports = router;
