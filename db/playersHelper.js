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

// Require sequelize
var Sequelize = require('sequelize');
// Require bcrypt
var bcrypt = require('bcrypt');

// Require players table
var playersTable = require('./db_config.js').players;
// Require player stats table
var playerStatsTable = require('./db_config.js').playerStats;

// Require playerStatsHelper
var playerStatsHelper = require('./playerStatsHelper');

//        _                            _   _      _                 
//       | |                          | | | |    | |                
//  _ __ | | __ _ _   _  ___ _ __ ___ | |_| | ___| |_ __   ___ _ __ 
// | '_ \| |/ _` | | | |/ _ \ '__/ __||  _  |/ _ \ | '_ \ / _ \ '__|
// | |_) | | (_| | |_| |  __/ |  \__ \| | | |  __/ | |_) |  __/ |   
// | .__/|_|\__,_|\__, |\___|_|  |___/\_| |_/\___|_| .__/ \___|_|   
// | |             __/ |                           | |              
// |_|            |___/                            |_|              

// Player helper master object
var playersHelper = {};

// Player help get all players
playersHelper.getAllPlayers = function (result) {
  // result param is the result to return (send to client)

  // Get username
  var userID = result.userID;

  // If no username found
  if (userID !== undefined && userID > 0) {
    // Query players table
    return playersTable.findAll({
      where: {
        userID: userID
      }
    }).then(function (playersFound) {
      // If any players were found
      if (playersFound.length > 0) {
        // Set playersFound bool
        result.playersFound = true;

        // Set players object
        result.players = {};
        var players = result.players;

        // Iterate over all players
        for (var i = 0; i < playersFound.length; ++i) {
          // Get player reference
          var player = playersFound[i].dataValues;
          // Add player information for client
          players[player.id] = {
            playername: player.playername,
            imagePath: '../some/Image/Path.png',
            aboutMe: player.aboutMe,
          };
        }

        // Passoff result to player stats collector
        return playerStatsHelper.getAllStats(result)
          .then(function () {
            ;
          });
      } else {
        // No players were found
        result.playersFound = false;
      }
    })
  } else {
    // Username wasn't provided
    result.usernameProvided = false;
  }
};

// Players helper add player
playersHelper.addPlayer = function (data) {
  // Get username
  var userID = data.userID;
  // Get callback
  var callback = data.callback;
  // Get playerdata
  var playerData = data.playerData;
  console.log('\n\n', data, '\n\n');

  // Result to store player data in
  var result = {};
  // Assume player can't be created
  result.playerCreated = false;
  result.playerCount = 0;

  // Count all players for user
  return playersTable.findAll({
    where: {
      userID: userID
    }
  }).then(function (playersFound) {
    // Set the player count
    result.playerCount = 0;

    // Set count if players found
    if (playersFound) {
      // Set players found to be what we need
      result.playerCount = playersFound.length;
    }

    // Continue only if playerCount is less than 9
    if (result.playerCount < 9) {
      
      // Check to make sure player hasn't already been created
      result.playerAlreadyExists = true;
      for (var i = 0; i < playersFound.length; ++i) {
        // Check playername
        if (playersFound[i].dataValues.playername.toUpperCase()
          === playerData.playername.toUpperCase()) {
          // Invoke callback
          callback(result);
          // Return
          return;
        }
      }

      // Set playerAlreadyExists to be true
      result.playerAlreadyExists = false;

      // Create player
      return playersTable.create({
        // Username
        userID: userID,
        // Player name
        playername: playerData.playername,
        // Image path
        imagePath: 'something/goes/here.png',
        // About me
        aboutMe: playerData.aboutMe
      }).then(function (playerCreated) {

        // Get reference to data we need
        playerCreated = playerCreated.dataValues;
        // Set result data
        result.playerData = {
          // Player name
          playername: playerCreated.playername,
          // Image path
          imagePath: playerCreated.imagePath,
          // About me
          aboutMe: playerCreated.aboutMe,
          // id

          // ENCRYPT LATER
          // ENCRYPT LATER
          // ENCRYPT LATER
          playerID: playerCreated.id
        };

        // Initialize stats for the player created
        return playerStatsTable.create({
          id: playerCreated.id
        }).then(function (statsCreated) {

          // Get reference to data we need
          statsCreated = statsCreated.dataValues;

          // Set stats data
          result.playerStats = {
            // Win loss ratio
            winLossRatio: statsCreated.winLossRatio,
            // Player type
            playerType: statsCreated.playerType,
            // Win velocity
            winVelocity: statsCreated.winVelocity,
            // Rank
            rank: statsCreated.rank,
            // Win streak
            winStreak: statsCreated.winStreak
          };

          // Set result's player created bool
          result.playerCreated = true;
          // Increment player count
          ++result.playerCount;

          // Invoke callback
          callback(result);
        });
      });
    }

    // Player count exceeded 9
    result.tooManyPlayers = true;
    // Invoke callback
    callback(result);
  });
};

// Players helper delete player
playersHelper.deletePlayer = function (data) {
  // Get username
  var userID = data.userID;
  // Get playername
  var playerID = data.playerID;
  // Get callback
  var callback = data.callback;

  // Result for data to return to client
  var result = {};
  // Assume removal unsuccessful
  result.removeSuccess = false;

  // Find player stats
  return playerStatsTable.destroy({
    where: {
      id: playerID
    },
    limit: 1
  }).then(function (affectedStatsRow) {
    // If a player stats row was found
    console.log('\n\naffectedRows:', affectedStatsRow, '\n\n');
    if (affectedStatsRow) {
      
      // Delete corresponding player info
      return playersTable.destroy({
        where: {
          userID: userID,
          id: playerID
        },
        limit: 1
      }).then(function (affectedInfoRow) {
        // If player info was found
        console.log('\n\naffectedInfoRow:', affectedInfoRow, '\n\n');

        // Player removed successfully
        result.removeSuccess = true;

        // Invoke callback
        callback(result);
      })
    } else {
      // No player was found
      result.playerLookupSuccess = false;
      // Invoke callback
      callback(result);
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

// Export players helper
module.exports = playersHelper;
