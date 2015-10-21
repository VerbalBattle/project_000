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
var roomsHelper = require('../db/roomsHelper');

//                  _            
//                 | |           
//  _ __ ___  _   _| |_ ___  ___ 
// | '__/ _ \| | | | __/ _ \/ __|
// | | | (_) | |_| | ||  __/\__ \
// |_|  \___/ \__,_|\__\___||___/

// GET to get room data about a specified room id
router.get('/:roomID', function (req, res, next) {
  // Data to pass to rooms helper
  var data = {
    // Room id
    roomID: req.params.roomID,
    // Callback to invoke when data is collected
    callback: function (result) {
      res.send(result);
    }
  };

  // Attempt to get room data
  roomsHelper.getRoomData(data);
});

// POST to attempt to join a room
router.post('/:roomID', function (req, res, next) {
  // Expected request body example
  // {
  //     "userID": 17,
  //     "avatarID": 23,
  //     "message": "my message is here"
  // }

  // Data rooms helper
  var data = {
    // User id
    userID: req.body.userID,
    // Avatar id
    avatarID: req.body.avatarID,
    // Message
    message: req.body.message,
    // Room id
    roomID: req.params.roomID,
    // Callback
    callback: function (result) {
      res.send(result);
    }
  };

  // Log
  console.log('\n\nATTEMPTING ADDING TO BACK OF LINE:',
    data.avatarID, '\n\n');
  // Attempt to add
  roomsHelper.sendMessageToRoom(data);

  // Expected result sent to client
  // None
});
module.exports = router;
