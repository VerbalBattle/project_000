// // Note: comments done with
// // http://patorjk.com/software/taag/#p=display&f=Doom&t=Logger

// //                       _              _ 
// //                      (_)            | |
// //  _ __ ___  __ _ _   _ _ _ __ ___  __| |
// // | '__/ _ \/ _` | | | | | '__/ _ \/ _` |
// // | | |  __/ (_| | |_| | | | |  __/ (_| |
// // |_|  \___|\__, |\__,_|_|_|  \___|\__,_|
// //              | |                       
// //              |_|                         

// Requirements
var socket_io = require('socket.io');
var io = socket_io();

// Require online user data
var online = require('./data.js').online;

// On socket connection
io.on("connection", function (socket) {

  // Log connection for debugging
  console.log("\n" + socket.id, "connected.\n");

  socket.on("client:linkUser", function (data) {
    console.log(data)
  })

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

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|    

// Exports listener
module.exports = io;