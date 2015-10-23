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
var app = require('../app.js');
var io = require('socket.io')(http);

// On connection
io.sockets.on('connection', function (socket) {

  // Log for servr debugging which socket connected
  console.log("\n" + socket.id, "connected.\n");
  // Tell the socket hello
  socket.emit('hello', 'hey world');
});