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

//   __ _ _   _  ___ _   _  ___ 
//  / _` | | | |/ _ \ | | |/ _ \
// | (_| | |_| |  __/ |_| |  __/
//  \__, |\__,_|\___|\__,_|\___|
//     | |                      
//     |_|                      

// Make a new linked list for avatars waiting for game
var waitingForGame = new LinkedList();

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

//    _           _       _             
//   (_)         | |     (_)            
//    _ _   _  __| | __ _ _ _ __   __ _ 
//   | | | | |/ _` |/ _` | | '_ \ / _` |
//   | | |_| | (_| | (_| | | | | | (_| |
//   | |\__,_|\__,_|\__, |_|_| |_|\__, |
//  _/ |             __/ |         __/ |
// |__/             |___/         |___/ 

// Data to hold all rooms open for judging
var judging = {};
// Individual room messages and other data
judging.roomDataForClient = {};
// Individual room has-voted userIDs, time to expire
judging.roomDataForServer = {};

// An array to maintain the order of rooms by roomID
// to be judged by expiration date
judging.roomIDsByExpiration = [];

// Judging function to add a new room to be judged
judging.addRoom = function (roomID, roomDataFinder) {
  // Get the room data
  roomDataFinder({
    roomID: roomID
  }).then(function (result) {
    // Get the room
    var roomData = result.rooms[roomID];
    // Add a key value pair to judging
    this.roomDataForClient[roomID] = roomData;
    // Push key to back of the line
    this.roomDataForServer[roomID] = {
      // Time to stop voting in ms
      timeToExpire: 60000,
      // Object to contain userIDs for users who've voted
      usersWhoVoted: {}
    };
    // Add keysByExpiration entry to the end
    this.roomIDsByExpiration.push(roomID);
  });
};

// Judging function to print out rooms
judging.print = function () {
  // String to return
  var str = '[';
  // All room IDs
  var roomIDs = this.roomIDsByExpiration;
  // Loop over every element
  for (var i = 0; i < roomIDs.length; ++i) {
    // Add room tuple
    str += '[';
    // Add roomID
    str += roomIDs[i];
    // Add TTE
    str += ', TTE:' + this.roomDataForServer[roomIDs[i]].timeToExpire;
    // Close room tuple
    str += ']';

    // Check for another element
    if (i !== roomIDs.length - 1) {
      str += ',';
    }
  }

  // Close string
  str += ']';

  // Print the string
  console.log(str);
};

// Judging starting time
judging.lastTime = Date.now();

// Judging function to update rooms that have expired
judging.updateRooms = function () {
  // Get rooms to iterate over
  var roomIDs = this.roomIDsByExpiration;
  // Get current time
  var currTime = Date.now();
  // Delta time between last judging
  var deltaTime = currTime - this.lastTime;

  // Iterate over rooms from newest to oldest
  for (var i = roomIDs.length - 1; -1 < i; --i) {
    // Subtract from the time to expire for the room
    this.roomDataForClient[roomIDs[i]].timeToExpire -= deltaTime;
    // If TTE is less than 0
    if (this.roomDataForClient[roomIDs[i]].timeToExpire <= 0) {
      // Remove this room and all avatars before this from judging
      for (var j = 0; j <= i; ++j) {
        // Get roomID and remove from IDs by expiration
        var tmpRoomID = this.roomIDsByExpiration.shift();
        // Delete room data for client and server
        delete this.roomDataForClient[tmpRoomID];
        delete this.roomDataForServer[tmpRoomID];
      }
    }
  }
  // Set lastTime to be currTime
  this.lastTime = currTime;

  // Print the rooms
  // this.print();
};

// Set interval for room updates
setInterval(function () {
  judging.updateRooms();
}, 1000);

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
module.exports.judging = judging;