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

// Require users helper
var usersHelper = require('../db/usersHelper');

// GET to signup a new user
router.get('/', authenticator.ensureAuthenticated,
  function (req, res, next) {
  // Expected request body example
  // {}
  
  // Decrypt token
  var decrypted = req.body.decrypted;
  console.log('DECRYPTED: ', decrypted);

  // Data to pass player signup
  var data = {
    // UserID
    userID: decrypted.userID,
    // Username
    username: decrypted.username
  };

  // Callback
  var callback = function (result) {
    // Delete userID
    delete result.userID;

    res.send(result);
  };

  // Log route called
  console.log('\n\nALL USER DATA\n\n');
  // Attempt signup
  usersHelper.getAllUserData(data, callback);

  // Expected result sent to client
  // { username: 'bowen',
  // avatarsFound: true,
  // avatars: 
  //  { '7': 
  //     { avatarName: 'Bowen',
  //       imagePath: '../some/Image/Path.png',
  //       aboutMe: 'blah',
  //       stats: [Object],
  //       rooms: [Object] },
  //    '11': 
  //     { avatarName: 'Blaine3',
  //       imagePath: '../some/Image/Path.png',
  //       aboutMe: 'blah',
  //       stats: [Object] },
  //    '12': 
  //     { avatarName: 'Blaine2',
  //       imagePath: '../some/Image/Path.png',
  //       aboutMe: 'blah',
  //       stats: [Object] } },
  // avatarLimit: 3,
  // avatarStatsFound: true }
});
module.exports = router;
