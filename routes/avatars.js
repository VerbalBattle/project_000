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
var avatarsHelper = require('../db/avatarsHelper');

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// POST to create a avatar
router.post('/', function (req, res, next) {
  // Expected request body example
  // {
  //     "userID": "974",
  //     "avatarData": {
  //         "avatarName": "joey's avatar",
  //         "imagePath": "some/image/path.png",
  //         "aboutMe": "I'm joey and I play to win."
  //     }
  // }

  // Data to pass to addAvatar
  var data = {
    // Username
    userID: req.body.userID,
    // Avatar data
    avatarData: req.body.avatarData,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };
  // Log route called
  console.log('\n\nNEW AVATAR\n\n');
  // Handoff to avatars helper
  avatarsHelper.addAvatar(data);

  // Expected result sent to client
  // {
  //   "avatarCreated": true,
  //   "avatars": {
  //     "6": {
  //       "avatarName": "super laura",
  //       "imagePath": "something/goes/here.png",
  //       "aboutMe": "I'm laura and I play to win.",
  //       "stats": {
  //         "winLossRatio": 0,
  //         "avatarType": "untyped",
  //         "winVelocity": 0,
  //         "rank": 0,
  //         "winStreak": 0
  //       }
  //     }
  //   }
  // }
});

// DELETE to delete a avatar
router.delete('/', function (req, res, next) {
  // Expected request body example
  // {
  //     "userID": 1,
  //     "avatarID": 3
  // }

  // Data to pass to deleteAvatar
  var data = {
    // Username
    userID: req.body.userID,
    // Avatarname
    avatarID: req.body.avatarID,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };
  // Log route called
  console.log('\n\nDELETE AVATAR\n\n', data);
  // Handoff to avatars helper
  avatarsHelper.deleteAvatar(data);

  // Expected result sent to client
  // {
  //   "removeSuccess": true
  // }
});
module.exports = router;
