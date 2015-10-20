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

// Require sequelize
var Sequelize = require('sequelize');
// Require bcrypt
var bcrypt = require('bcrypt');

// Require rooms table
var roomsTable = require('./db_config.js').rooms;
// Require avatars table
var avatarsTable = require('./db_config.js').avatars;

// Require player game room queue
var waitingForGame = require('../server/data').waitingForGame;

//                                _   _      _                 
//  _ __ ___   ___  _ __ ___  ___| | | | ___| |_ __   ___ _ __ 
// | '__/ _ \ / _ \| '_ ` _ \/ __| |_| |/ _ \ | '_ \ / _ \ '__|
// | | | (_) | (_) | | | | | \__ \  _  |  __/ | |_) |  __/ |   
// |_|  \___/ \___/|_| |_| |_|___/_| |_|\___|_| .__/ \___|_|   
//                                            |_|              

// Rooms helper master object
var roomsHelper = {};

// Rooms helper method to add to end of queue
roomsHelper.enqueueAvatar = function (data) {
  // Add player to end of linked list
  waitingForGame.addToBack(data);
  // Print the queue
  waitingForGame.print();
  // If there are 2 players in queue, pair them
  if (Object.keys(waitingForGame.nodes).length === 2) {
    this.pairPlayers([
      [
        waitingForGame.head.val.avatarID,
        waitingForGame.tail.val.avatarID
      ]
    ]);
  }
};

// Rooms helper method to remove tuples from queue
roomsHelper.pairPlayers = function (pairs) {
  // Iterate over all pairs
  for (var i = 0; i < pairs.length; ++i) {
    // Get avatar 1 and avatar 2 IDs
    var avatar1_id = pairs[i][0];
    var avatar2_id = pairs[i][1];
    // Create room for both avatars
    this.addRoom(avatar1_id, avatar2_id);
  }
};

// Rooms helper method to create a room between 2 avatars
roomsHelper.addRoom = function (avatar1_id, avatar2_id) {

  // Expect that both avatar IDs exist
  return avatarsTable.findAll({
    where: {
      id: {
        $in: [avatar1_id, avatar2_id]
      }
    }
  }).then(function (avatarIDs) {
    // If there are exactly 2 avatarIDs and their userIDs
    // aren't equal
    if (avatarIDs.length === 2
      && (avatarIDs[0].dataValues.userID
        !== avatarIDs[1].dataValues.userID)) {
      // Check if the pair already exists
      return roomsTable.findAll({
        where: {
          avatar1_id: {
            $in: [avatar1_id, avatar2_id]
          },
          avatar2_id: {
            $in: [avatar1_id, avatar2_id]
          }
        }
      }).then(function (rooms) {
        // If no rooms were found
        if (rooms.length === 0) {
          // Make room
          return roomsTable.create({
            // Avatar 1 (first turn)
            avatar1_id: avatar1_id,
            // Avatar 2 (second turn)
            avatar2_id: avatar2_id
          }).then(function (roomCreated) {
            // If the room was created successfully
            if (roomCreated) {
              // Remove both players from queue
              waitingForGame.removeByAvatarID(avatar1_id);
              waitingForGame.removeByAvatarID(avatar2_id);
            }
          });
        } else {
          // Players are already playing (or game hasn't been judged)
          console.log('\n\nPAIRING ERROR: ALREADY PLAYING\n\n');
        }
      });
    } else {
      // Both IDs weren't found
      console.log('\n\nPAIRING ERROR: BOTH IDs NOT FOUND\n\n\tOR'
        + '\n\nPlAYERS ARE THE SAME\n\n');
    }
  });
};

// Rooms helper that gets rooms to every avatar in a room
roomsHelper.getAllRooms = function (data) {
  // Get array of all avatars
  var avatarIDs = Object.keys(data.avatars);
  // Get all rooms associated with avatars
  return roomsTable.findAll({
    where: {
      $or: [{
          avatar1_id: {
            $in: avatarIDs
          }
        },
        {
          avatar2_id: {
            $in: avatarIDs
          }
        }
      ]
    }
  }).then(function (roomsFound) {
    // Iterate over all rooms found
    for (var i = 0; i < roomsFound.length; ++i) {
      // Get current room
      var currRoom = roomsFound[i].dataValues;
      // Get avatar id that we need
      var currAvatarID = currRoom.avatar1_id;
      console.log(currRoom.avatar1_id in data.avatars);
      console.log(currRoom.avatar2_id in data.avatars);
      if (currRoom.avatar2_id in data.avatars) {
        currAvatarID = currRoom.avatar2_id;
      }
      // Add room data
      if (data.avatars[currAvatarID].rooms === undefined) {
        data.avatars[currAvatarID].rooms = {};
      }
      // Add key
      data.avatars[currAvatarID].rooms[currRoom.id] = currRoom;
    }
  });
};

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|    

// Export users helpers
module.exports = roomsHelper;