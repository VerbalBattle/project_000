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
var usersHelper = require('../db/roomsHelper');

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
    // Player id
    playerID: req.body.playerData.playerID
    // Player data
    playerData: req.body.playerData,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };

  // Log
  console.log('\n\nATTEMPTING ADDING TO BACK OF LINE:',
    data.playerID, '\n\n');
  // Attempt to add

  // Expected result sent to client
});
module.exports = router;
