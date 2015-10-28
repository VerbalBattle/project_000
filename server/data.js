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

// Require rooms table
var roomsTable = require('../db/db_config').rooms;
// Require avatar stats table
var avatarStatsTable = require('../db/db_config').avatarStats;

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

// Judging initial time to expire
judging.initialTTE = 120000;

// Judging function to add a new room to be judged
judging.addRoom = function (roomID, roomDataFinder) {
  // Get the room data
  roomDataFinder({
    roomID: roomID
  }).then(function (result) {
    // Get the room
    var roomData = result.rooms[roomID];
    // Add a key value pair to judging
    judging.roomDataForClient[roomID] = roomData;
    // Push key to back of the line
    judging.roomDataForServer[roomID] = {
      // Time to stop voting in ms
      timeToExpire: judging.initialTTE,
      // Object to contain userIDs for users who've voted
      usersWhoVoted: {},
      // Votes for avatar1
      avatar1Votes: 0,
      // Votes for avatar2
      avatar2Votes: 0
    };

    // Users who played cannot vote on the room
    judging.roomDataForServer[roomID]
      .usersWhoVoted[roomData.avatar1_userID] = true;
    judging.roomDataForServer[roomID]
      .usersWhoVoted[roomData.avatar2_userID] = true;
    // Add keysByExpiration entry to the end
    judging.roomIDsByExpiration.push(roomID);
  });
};

// Judging function to print out rooms
judging.print = function () {
  // String to return
  var str = 'Rooms for judging:\n';
  // All room IDs
  var roomIDs = this.roomIDsByExpiration;
  // Loop over every element
  for (var i = 0; i < roomIDs.length; ++i) {
    // Add room tuple
    str += 'roomID: ';
    // Add roomID
    str += roomIDs[i];
    // Add TTE
    str += ', TTE: ' +
      Math.floor(this.roomDataForServer[roomIDs[i]]
        .timeToExpire / 1000) + ' sec';
    // Add users who can no longer vote
    str += ', Voters: ' +
      Object.keys(this.roomDataForServer[roomIDs[i]].usersWhoVoted);

    // Check for another element
    if (i !== roomIDs.length - 1) {
      str += '\n------------\n';
    }
  }

  // Close string
  str += '\n';

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
  console.log('∆t:', Math.floor(deltaTime / 1000) + ' sec');
  // Iterate over rooms from newest to oldest
  for (var i = roomIDs.length - 1; -1 < i; --i) {
    // Subtract from the time to expire for the room
    this.roomDataForServer[roomIDs[i]].timeToExpire -= deltaTime;
    // If TTE is less than 0
    if (this.roomDataForServer[roomIDs[i]].timeToExpire <= 0) {
      // Remove this room and all avatars before this from judging
      for (var j = 0; j <= i; ++j) {
        // Get roomID and remove from IDs by expiration
        var tmpRoomID = this.roomIDsByExpiration.shift();
        // Archive room
        judging.archiveRoom(tmpRoomID);
        // Emit winner to sockets online
      }
    }
  }
  // Set lastTime to be currTime
  this.lastTime = currTime;

  // Print the rooms
  this.print();
};

// Judging archive room
judging.archiveRoom = function (roomID) {
  // Lookup room in table
  roomsTable.find({
    where: {
      id: roomID
    }
  }).then(function (roomFound) {
    // If the room was found
    if (roomFound) {
      // Get winner for room

      // Assume tie
      var winnerAvatarID = -1;
      // Get vote counts
      var avatar1Votes
        = judging.roomDataForServer[roomID].avatar1Votes;
      var avatar2Votes
        = judging.roomDataForServer[roomID].avatar2Votes;
      // If either avatar 1 or 2 won, reset winnerAvatarID
      if (avatar1Votes < avatar2Votes) {
        winnerAvatarID = roomFound.dataValues.avatar2_id;
      } else if (avatar2Votes < avatar1Votes) {
        winnerAvatarID = roomFound.dataValues.avatar1_id;
      }

      // Delete room data for client and server from judging
      delete judging.roomDataForClient[roomID];
      delete judging.roomDataForServer[roomID];

      // Set it's roomState to 2 (archived) and the winnerAvatarID,
      // in addition to the vote counts
      roomFound.update({
        roomState: 2,
        winnerAvatarID: winnerAvatarID,
        avatar1_votes: avatar1Votes,
        avatar2_votes: avatar2Votes
      });

      // Update avatarStats

      // Add game results
      avatarStatsTable.findAll({
        where: {
          id: {
            $in: [
              roomFound.dataValues.avatar1_id,
              roomFound.dataValues.avatar2_id
            ]
          }
        }
      }).then(function (avatarStatsFound) {
        // Iterate over stats
        for (var i = 0; i < avatarStatsFound.length; ++i) {
          // Get the avatarStats
          var avatarStats = avatarStatsFound[i];

          // Result to hold updated stats
          var result = {};
          // Update gameCount
          result.gameCount = avatarStats.dataValues.gameCount + 1;
          // Get current winCount
          result.winCount = avatarStats.dataValues.winCount;

          // Check if the avatarID belongs to the winner
          // or the loser

          // Winner
          if (avatarStats.dataValues.id === winnerAvatarID || 
            winnerAvatarID === -1) {

            // Increment winCount
            ++result.winCount;
            // Increment winStreak
            result.winStreak = avatarStats.dataValues.winStreak + 1;
          } else {

            // Reset winStreak
            result.winStreak = 0;
          }

          // Update winLossRatio
          result.winLossRatio = result.winCount / result.gameCount;

          // Update stats
          avatarStats.update({
            winCount: result.winCount,
            gameCount: result.gameCount,
            winLossRatio: result.winLossRatio,
            winStreak: result.winStreak
          });

          // Send live update here to user
        }
      });
    }

    // Send live update if possible, or store notifications
    // for next time users log in
  });
};

// Judging max rooms per judge request
judging.judgeRequestRoomMax = 3;

// Judging get rooms to judge
judging.getRoomsToJudge = function (userID, callback) {
  // All rooms for judging
  var roomIDs = this.roomIDsByExpiration;
  // Judging rooms to send to client
  var roomsToJudge = [];
  // Time to expire cutoff
  var cutoffTTE = Math.round(this.initialTTE / 2);

  // Iterate over all possible rooms to judge
  for (var i = 0; i < roomIDs.length; ++i) {
    // If the TTE isn't high enough, skip
    if (cutoffTTE <=
      this.roomDataForServer[roomIDs[i]].timeToExpire) {
      // If the user hasn't judged this room yet
      if (!(userID in
        this.roomDataForServer[roomIDs[i]].usersWhoVoted)) {

        // Add to rooms to judge
        roomsToJudge.push(this.roomDataForClient[roomIDs[i]]);

        // If the roomsToJudge count is exceeds the max, break
        if (judging.judgeRequestRoomMax <= roomsToJudge.length) {
          break;
        }
      }
    }
  }

  // Invoke callback on rooms to judge
  callback(roomsToJudge);
};

// Judging judge individual room
judging.judgeOneRoom = function (data, callback) {
  // Get data for judging
  var roomID = data.roomID;
  var userID = data.userID;
  var upVoteID = data.upVoteID;

  // Result to send to client
  var result = {
    voteCast: false
  };
  // Check if roomID exists
  if (roomID in this.roomDataForServer) {
    // Add the upvote
    if (upVoteID === 1) {
      this.roomDataForServer[roomID].avatar1Votes++;
    } else if (upVoteID === 2) {
      this.roomDataForServer[roomID].avatar2Votes++;
    }
    // Add userID to voted for this roomID
    this.roomDataForServer[roomID].usersWhoVoted[userID] = true;
    // Set cast vote to true
    result.voteCast = true;
  } else {
    // Room ID wasn't found
    result.badRoomID = true;
  }

  // Invoke callback
  callback(result);
};

// Set interval for judging room updates
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