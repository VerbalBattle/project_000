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
  var message = data.message;
  // Create a message
  return messagesTable.create({
    roomID: roomID,
    message: message
  }).then(function (messageCreated) {
    // Return the message created
    messageCreated = messageCreated.dataValues;
    return messageCreated;
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