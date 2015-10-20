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
var usersHelper = require('../db/usersHelper');

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// POST to login an existing user
router.post('/', function (req, res, next) {
  // Expected request body example
  // {
  //     "username": "mike",
  //     "password": "mike"
  // }

  // Data to pass avatar login
  var data = {
    // Username
    username: req.body.username,
    // Password
    password: req.body.password,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };
  // Log route called
  console.log('\n\nLOGIN\n\n');
  // Attempt login
  usersHelper.login(data);

  // Expected result sent to client
// {
//   "loginSuccess": true,
//   "usernameFound": true,
//   "passwordSuccess": true,
//   "userID": 1,
//   "username": "laura",
//   "avatarsFound": true,
//   "avatars": {
//     "1": {
//       "avatarName": "joey's avatar",
//       "imagePath": "../some/Image/Path.png",
//       "aboutMe": "I'm joey and I play to win.",
//       "stats": {
//         "winLossRatio": 0,
//         "avatarType": "untyped",
//         "winVelocity": 0,
//         "rank": 0,
//         "winStreak": 0
//       }
//     "6": {
//       "avatarName": "super laura",
//       "imagePath": "../some/Image/Path.png",
//       "aboutMe": "I'm laura and I play to win.",
//       "stats": {
//         "winLossRatio": 0,
//         "avatarType": "untyped",
//         "winVelocity": 0,
//         "rank": 0,
//         "winStreak": 0
//       }
//     }
//   },
//   "avatarStatsFound": true
// }
});

module.exports = router;
