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

// POST to signup a new user
router.post('/', function (req, res, next) {
  // Expected request body example
  // {
  //     "username": "mike",
  //     "password": "mike"
  // }

  // Data to pass player signup
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
  console.log('\n\nSIGNUP\n\n');
  // Attempt signup
  usersHelper.signup(data);

  // Expected result sent to client
  // {
  //   "signupSuccess": true,
  //   "usernameAvailable": true,
  //   "userID": 2,
  //   "username": "mike",
  //   "playersFound": false
  // }
});
module.exports = router;
