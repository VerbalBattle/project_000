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
// Require messages table
var messagesTable = require('./db_config.js').messages;

// Require messages helper
var messagesHelper = require('./messagesHelper');

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
  // Get the callback
  var callback = data.callback;
  delete data.callback;
  // Add player to end of linked list
  var added = waitingForGame.addToBack(data);
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

  // Invoke callback
  var result = {
    inRoomQueue: added
  };
  callback(result);
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

    // Handoff to messagesHelper
    // return messagesHelper.fetchMessagesForLogin(data);
  });
};

// Rooms helper that gets data about one room
roomsHelper.getRoomData = function (data) {
  // Get data
  var roomID = data.roomID;
  var callback = data.callback;

  // Result to send to client
  var result = {};

  // Get room by id
  return roomsTable.find({
    where: {
      id: roomID
    }
  }).then(function (roomFound) {
    // If the room was found
    if (roomID) {
      // Set the room
      result.rooms = {};
      result.rooms[roomID] = roomFound.dataValues;
      
      // Add messages to the room
      return messagesHelper.fetchMessagesForRoom(roomID)
        .then(function (messages) {
          result.rooms[roomID].messages = messages;

          // Invoke callback
          callback(result);
        });
    } else {
      // The room wasn't found, invoke callback
      result.roomFound = false;
      callback(result);
    }
  });
};

// Rooms helper send message to room
roomsHelper.sendMessageToRoom = function (data) {
  // Get data from route
  var userID = data.userID;
  var avatarID = data.avatarID;
  var roomID = data.roomID;
  var message = data.message;
  // Get callback
  var callback = data.callback;

  // Result to return to client
  var result = {};

  // Check for room in database
  return roomsTable.find({
    where: {
      id: roomID
    }
  }).then(function (roomFound) {
    // Only continue if the rom was found
    if (roomFound) {
      // Only continue if room is open
      if (roomFound.dataValues.isOpen) {
        // Get avatar 1 or avatar 2
        var avatarNum = 0;
        // If avatar 1
        if (roomFound.dataValues.avatar1_id === avatarID) {
          avatarNum = 1;
        } else if (roomFound.dataValues.avatar2_id === avatarID) {
          // Else if avatar 2
          avatarNum = 2;
        } else {
          // Inform client avatar id wasn't found
          result.foundAvatarID = false;
          callback(result);
        }

        // Check turn validity
        var turnValid = roomsHelper.checkTurn(avatarNum,
          roomFound.dataValues.turnCount);

        // Continue if turn valid
        if (turnValid) {

          // Add message to database
          return messagesHelper.addMessageToRoom({
            roomID: roomID,
            message: message
          }).then(function (messageCreated) {
            // If the message was created
            if (messageCreated) {
              result.messageData = messageCreated;

              // Check if game needs to close
              var isOpen = roomFound.dataValues.turnCount < 5;
              // Update turn count
              return roomFound.update({
                turnCount: roomFound.dataValues.turnCount + 1,
                isOpen: isOpen
              }).then(function () {

                // Update turn count and invoke callback
                result.newTurnCount = roomFound.dataValues.turnCount;
                callback(result);
              });
            } else {
              // Message could not be created for some reason
              result.messageCreationError = false;
              callback(result);
            }
          });
        } else {
          // Turn is invalid
          result.turnValid = false;
          callback(result);
        }
      } else {
        // The room is closed, invoke callback
        result.roomOpen = false;
        callback(result);
      }
    } else {
      // Inform client room wasn't found
      result.roomFound = false;
      callback(result);
    }
  });
};

// Rooms helper check turn
roomsHelper.checkTurn = function (avatarOneOrTwo, turnCount) {
  // Assume turn is invalid
  var turnValid = false;
  // Check if turn is less than 6
  if (turnCount < 6) {
    // Check for valid turns
    if (turnCount % 2 === 0 && avatarOneOrTwo === 1
      || turnCount % 2 === 1 && avatarOneOrTwo === 2) {
      turnValid = true;
    }
  }
  // Return bool
  return turnValid;
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