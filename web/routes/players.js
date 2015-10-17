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
  // Data to pass to addPlayer
  var data = {
    // Username
    username: req.body.username,
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
});

// Delete a user in the database
router.delete('/', function (req, res, next) {
  // Data to pass to deletePlayer
  var data = {
    // Username
    username: req.body.username,
    // Playername
    playername: req.body.playername,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };
  // Log route called
  console.log('\n\nDELETE PLAYER\n\n');
  // Handoff to players helper
  playersHelper.deletePlayer(data);
});
module.exports = router;
