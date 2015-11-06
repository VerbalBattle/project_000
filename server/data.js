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

// Get linked list class
var LinkedList = require('./linkedList');

// Get judging
var judger = require('./judging.js').judging;

//   __ _ _   _  ___ _   _  ___ 
//  / _` | | | |/ _ \ | | |/ _ \
// | (_| | |_| |  __/ |_| |  __/
//  \__, |\__,_|\___|\__,_|\___|
//     | |                      
//     |_|                      

// Make a new linked list for avatars waiting for game
var waitingForGame = new LinkedList();
// Add a invalid matches mapping where key is an avatarID
// and the value is an object consisting of invalid
// avatarIDs as keys
waitingForGame.invalidMatches = {};

//              _ _            
//             | (_)           
//   ___  _ __ | |_ _ __   ___ 
//  / _ \| '_ \| | | '_ \ / _ \
// | (_) | | | | | | | | |  __/
//  \___/|_| |_|_|_|_| |_|\___|

// Data object holding all data about online users
var onlineUsers = {};
// Socket to user map for connected sockets
var onlineSocketUserMap = {};

//                             _       
//                            | |      
//   _____  ___ __   ___  _ __| |_ ___ 
//  / _ \ \/ / '_ \ / _ \| '__| __/ __|
// |  __/>  <| |_) | (_) | |  | |_\__ \
//  \___/_/\_\ .__/ \___/|_|   \__|___/
//           | |                       
//           |_|    

// Export waiting for game queue
module.exports.waitingForGame = waitingForGame;

// Export online object
module.exports.onlineUsers = onlineUsers;
module.exports.onlineSocketUserMap = onlineSocketUserMap;

// Export judging
module.exports.judger = judger;
