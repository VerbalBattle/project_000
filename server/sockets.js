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
var socket_io = require('socket.io');
var io = socket_io();

// Require rooms helper
// var roomsHelper = require('../db/roomsHelper');

// Require online user and socket data
var onlineUsers = require('./data.js').onlineUsers;
var onlineSocketUserMap = require('./data.js').onlineSocketUserMap;

// Require authenticator
var authenticator = require('./authenticator');

// On socket connection
io.on("connection", function (socket) {

  // Log connection for debugging
  console.log("\n" + socket.id, "connected.\n");

  // On disconnect
  socket.on('disconnect', function () {
    console.log("\n" + socket.id, "DISconnected.\n");

    // Handoff to helper
    helper.deleteUserSocketMap({
      socketID: socket.id
    });
  });

  // On successful client login, get userID for socketID
  socket.on("client:linkUser", function (data) {
    helper.mapUserToSocket({
      decrypted: authenticator.decodeToken(data.token),
      socketID: socket.id
    });
  });

  // Give client their socketID for token
  helper.giveSocketID({socketID: socket.id});
});

// Helper
var helper = {};

// Helper send socketID to client
helper.giveSocketID = function (data) {
  // Send data to
  io.sockets.connected[data.socketID].emit('server:socketID',
    data);
};

// Helper map userID to socketID
helper.mapUserToSocket = function (data) {
  // Get key
  var userID = data.decrypted.userID;
  var socketID = data.socketID;

  // Create object for all sockets is user
  // is online
  if (onlineUsers[userID] === undefined) {
    onlineUsers[userID] = {};
  }
  // Add new key value pair to onlineUsers
  onlineUsers[userID][socketID] = true;
  // Add a new socket to user mapping
  onlineSocketUserMap[socketID] = userID;

  // NOTE (may have typing error later for emitting to sockets)

  // Log
  console.log('ONLINE USERS\n', onlineUsers);
  console.log('ONLINE SOCKETS\n', onlineSocketUserMap);
};

// Helper delete userID socket mapping
helper.deleteUserSocketMap = function (data) {
  // Get socketID
  var socketID = data.socketID;
  // Get userID
  var userID = onlineSocketUserMap[socketID];
  // Delete mapping
  delete onlineSocketUserMap[socketID];
  // If user is online
  if (onlineUsers[userID]) {
    delete onlineUsers[userID][socketID];

    // Check if keys are empty for the userID, and if so, delete it
    if (Object.keys(onlineUsers[userID]).length === 0) {
      delete onlineUsers[userID];
    }
  }

  // Log
  console.log('ONLINE USERS\n', onlineUsers);
  console.log('ONLINE SOCKETS\n', onlineSocketUserMap);
};

// Helper send live join room udpate to client
helper.clientJoinRoom = function (data, callback) {
  // Log
  console.log('ATTEMPTING LIVE UPDATE FOR ROOM JOIN');

  // Get userIDs
  var userID_1 = data.userIDs[0];
  var userID_2 = data.userIDs[1];
  // Get avatarIDs
  var avatarID_1 = data.avatarIDs[0];
  var avatarID_2 = data.avatarIDs[1];
  // Get roomdID
  var roomID = data.roomID;

  // Get sockets
  var sockets_1 = onlineUsers[userID_1];
  var sockets_2 = onlineUsers[userID_2];

  // Only emit live update if either user is online
  if (sockets_1 || sockets_2) {
    // Get room data by callback
    callback({
      roomID: roomID
    }).then(function (result) {
      // Log
      console.log('EMITTING LIVE UPDATE FOR ROOM JOIN to',
        Object.keys(sockets_1), 'and/or',
        Object.keys(sockets_2));
      // Emit to sockets if online
      if (sockets_1) {
        // Iterate over all sockets
        for (var socket1 in sockets_1) {
          io.to(socket1).emit('client:joinRoom', result);
        }
      }
      if (sockets_2) {
        // Iterate over all sockets
        for (var socket2 in sockets_2) {
          io.to(socket2).emit('client:joinRoom', result);
        }
      }
    });
  }
};

// Helper send live message update to client
helper.clientTurnUpdate = function (data, callback) {
  // Log
  console.log('ATTEMPTING LIVE UPDATE FOR TURN');
  // Get sender userID and socket
  var senderUserID = data.senderUserID;
  var senderSockets = onlineUsers[senderUserID];
  // Get opponent userID and socket
  var opponentUserID = data.opponentUserID;
  var opponentSockets = onlineUsers[opponentUserID];
  // Get roomID
  var roomID = data.roomID;

  // Only emit live update if opponent is online
  if (opponentSockets) {
    // Get room data by callback
    callback({
      roomID: roomID
    }).then(function (result) {
      // Log
      console.log('EMITTING LIVE ROOM MESSAGE UPDATE to', 
        Object.keys(opponentSockets), 'and',
        Object.keys(senderSockets));
      // Emit live update to opponent sockets
      for (var opponentSocket in opponentSockets) {
        io.to(opponentSocket).emit('client:turnUpdate', result);
      }
      // Emit live update to sender sockets
      for (var senderSocket in senderSockets) {
        io.to(senderSocket).emit('client:turnUpdate', result);
      }
    });
  }
};

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|    

// Exports listener
module.exports.io = io;

// Export socket helper
module.exports.helper = helper;

module.exports.str = 'yo biotch';
