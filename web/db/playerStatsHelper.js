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
// Require databases
var playerStatsTable = require('./db_config.js').playerStats;
// Require bcrypt
var bcrypt = require('bcrypt');

//        _                       _____ _        _        _   _      _                 
//       | |                     /  ___| |      | |      | | | |    | |                
//  _ __ | | __ _ _   _  ___ _ __\ `--.| |_ __ _| |_ ___ | |_| | ___| |_ __   ___ _ __ 
// | '_ \| |/ _` | | | |/ _ \ '__|`--. \ __/ _` | __/ __||  _  |/ _ \ | '_ \ / _ \ '__|
// | |_) | | (_| | |_| |  __/ |  /\__/ / || (_| | |_\__ \| | | |  __/ | |_) |  __/ |   
// | .__/|_|\__,_|\__, |\___|_|  \____/ \__\__,_|\__|___/\_| |_/\___|_| .__/ \___|_|   
// | |             __/ |                                              | |              
// |_|            |___/                                               |_|              

// Player stats master object
var playerStatsHelper = {};

// Player stats helper get stats
playerStatsHelper.getAllStats = function (result) {
  // Reference the player stats
  var playerData = result.players;
  // Get player IDs
  var playerIDs = [];
  for (var player in playerData) {
    playerIDs.push(player.id);
  }

  // Set result's player stats found bool
  result.playerStatsFound = false;

  // Query player stats table
  return playerStatsTable.findAll({
    where: {
      id: {
        $in: playerIDs
      }
    }
  }).then(function (playerStats) {
    // If playerStats were found
    if (playerStats) {
      // Set player stats found bool to be true
      result.playerStatsFound = true;

      // Iterate over all player stats
      for (var i = 0; i < playerStats.length; ++i) {
        // Get the player stats
        var stats_i = playerStats[i].dataValues;
        // Get playername
        var playerID = stats_i.id;
        // Add player stats to result's associated player
        playerData[playerID].stats = {
          // Win loss ratio
          winLossRatio: stats_i.winLossRatio,
          // Player type
          playerType: stats_i.playerType,
          // Win velocity
          winVelocity: stats_i.winVelocity,
          // Rank
          rank: stats_i.rank,
          // Win streak
          winStreak: stats_i.winStreak
        };

        // Swap stats key for playername key
        var playername = playerData[playerID].playername;
        playerData[playername] = playerData[playerID];
        delete playerData[playerID];
      }
    }
    // Otherwise, player stats weren't found

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

// Export player stats helper
module.exports = playerStatsHelper;
