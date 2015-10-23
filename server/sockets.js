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
var online = require('')

io.on("connection", function (socket) {
  console.log("\n" + socket.id, "connected.\n");
  socket.emit('hello', 'hey world');
});
module.exports = io;