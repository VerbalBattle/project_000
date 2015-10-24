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

  // Check client connection
  socket.emit('hello', 'hey world');

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
  // Add new key value pair to onlineUsers
  onlineUsers[userID] = socketID;
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
  delete onlineUsers[userID];
  // Log
  console.log('ONLINE USERS\n', onlineUsers);
  console.log('ONLINE SOCKETS\n', onlineSocketUserMap);
};

// Helper send live udpate to client
helper.clientJoinRoom = function (data, callback) {
  // Get userIDs
  var userID_1 = data.userIDs[0];
  var userID_2 = data.userIDs[1];
  // Get avatarIDs
  var avatarID_1 = data.avatarIDs[0];
  var avatarID_2 = data.avatarIDs[1];
  // Get roomdID
  var roomID = data.roomID;
  // Get room data by callback
  callback({
    roomID: roomID
  }).then(function (result) {
    console.log('EMITTING LIVE UPDATE FOR ROOM JOIN');
    // Get sockets
    var socket_1 = onlineUsers[userID_1];
    var socket_2 = onlineUsers[userID_2];
    // Emit to sockets if online
    if (socket_1) {
      io.to(socket_1).emit('client:joinRoom', result);
    }
    if (socket_2) {
      io.to(socket_2).emit('client:joinRoom', result);
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

// Exports listener
module.exports.io = io;

// Export socket helper
module.exports.helper = helper;

module.exports.str = 'yo biotch';
