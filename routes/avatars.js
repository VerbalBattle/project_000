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

// Require avatarsHelper
var avatarsHelper = require('../db/avatarsHelper');

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// POST to create a avatar
router.post('/', authenticator.ensureAuthenticated,
  function (req, res, next) {
  // Expected request body example
  // {
  //     "avatarData": {
  //         "avatarName": "joey's avatar",
  //         "image": binary_stuff_here,
  //         "aboutMe": "I'm joey and I play to win."
  //     }
  // }

  // Decrypt token
  var decrypted = req.body.decrypted;

  // Data to pass to addAvatar
  var data = {
    // Username
    userID: decrypted.userID,
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
  //       image: binary_stuff_here,
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

// PUT to change an avatar
router.put('/:avatarID', authenticator.ensureAuthenticated,
  function (req, res, next) {

  // Decrypt token
  var decrypted = req.body.decrypted;

  // Data to pass to edit avatar
  var data = {
    // User ID
    userID: decrypted.userID,
    // Avatar ID
    avatarID: req.params.avatarID,
    // Avatar data
    avatarData: req.body.avatarData,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };

  // Log route called
  console.log('\n\nEDIT AVATAR\n\n');
  // Handoff to avatars helper
  avatarsHelper.editAvatar(data);
});

// DELETE to delete a avatar
router.delete('/:avatarID', authenticator.ensureAuthenticated,
  function (req, res, next) {

  // Decrypt token
  var decrypted = req.body.decrypted;

  // Data to pass to deleteAvatar
  var data = {
    // User ID
    userID: decrypted.userID,
    // Avatarname
    avatarID: req.params.avatarID,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };
  
  // Log route called
  console.log('\n\nDELETE AVATAR\n\n');
  // Handoff to avatars helper
  avatarsHelper.deleteAvatar(data);

  // Expected result sent to client
  // {
  //   "removeSuccess": true
  // }
});
module.exports = router;
