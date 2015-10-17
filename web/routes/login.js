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
var usersHelper = require('../db/db_helpers').usersHelper;

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

/* GET users listing. */
router.post('/', function (req, res, next) {
  // Expected request body example
  // {
  //     "username": "mike",
  //     "password": "mike"
  // }

  // Data to pass player login
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
  //   "playersFound": true,
  //   "players": {
  //     "2": {
  //       "playername": "laura's player",
  //       "imagePath": "../some/Image/Path.png",
  //       "aboutMe": "I'm laura and I play to win."
  //     },
  //     "4": {
  //       "playername": "laura's waffle",
  //       "imagePath": "../some/Image/Path.png",
  //       "aboutMe": "I'm laura and I play to win."
  //     }
  //   },
  //   "playerStatsFound": true
  // }
});

module.exports = router;
