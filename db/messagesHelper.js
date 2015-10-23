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

// Require messages table
var messagesTable = require('./db_config').messages;

// Messages helper master object
var messagesHelper = {};

// Messages helper add message to room
messagesHelper.addMessageToRoom = function (data) {
  // Get data
  var roomID = data.roomID;
  var avatarID = data.avatarID;
  var message = data.message;
  // Create a message
  return messagesTable.create({
    roomID: roomID,
    avatarID: avatarID,
    message: message
  }).then(function (messageCreated) {
    // Return the message created
    messageCreated = messageCreated.dataValues;
    return messageCreated;
  });
};

// Message helper fetch messages by roomID
messagesHelper.fetchMessagesForRoom = function (roomID) {
  // Messages object
  var messages = {};
  // Get all messages associated with roomID
  return messagesTable.findAll({
    where: {
      roomID: roomID
    }
  }).then(function (foundMessages) {
    // Iterate over messages
    for (var i = 0; i < foundMessages.length; ++i) {
      // Get message data
      var messageData = foundMessages[i].dataValues;
      // Add message data
      messages[messageData.id] = messageData;
    }
    // Return messages
    return messages;
  });
};

// Message helper fetch messages for login
messagesHelper.fetchMessagesForLogin = function (data) {
  // Create key value mapping from rooms to avatarIDs
  var map = {};
  // Iterate over all players
  for (var avatarID in data.avatars) {
    // Get rooms
    var rooms = data.avatars[avatarID].rooms;
    // Iterate over all rooms
    for (var room in rooms) {
      // Add key value pair
      map[room] = avatarID;
      // Add messages object
      rooms[room].messages = {};
    }
  }

  // Get messages for all rooms
  return messagesTable.findAll({
    where: {
      roomID: {
        $in: Object.keys(map)
      }
    }
  }).then(function (messagesFound) {
    // Iterate over all messages
    for (var i = 0; i < messagesFound.length; ++i) {
      // Get message data
      var message = messagesFound[i].dataValues;
      // Get avatar
      var rooms = data.avatars[map[message.roomID]].rooms;
      // Add message to room
      rooms[message.roomID].messages[message.id] = message;
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

// Export messages helper
module.exports = messagesHelper;