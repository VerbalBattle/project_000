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
var avatarStatsTable = require('./db_config.js').avatarStats;
// Require bcrypt
var bcrypt = require('bcrypt');

//                   _             _____ _        _        _   _      _                 
//                  | |           /  ___| |      | |      | | | |    | |                
//   __ ___   ____ _| |_ __ _ _ __\ `--.| |_ __ _| |_ ___ | |_| | ___| |_ __   ___ _ __ 
//  / _` \ \ / / _` | __/ _` | '__|`--. \ __/ _` | __/ __||  _  |/ _ \ | '_ \ / _ \ '__|
// | (_| |\ V / (_| | || (_| | |  /\__/ / || (_| | |_\__ \| | | |  __/ | |_) |  __/ |   
//  \__,_| \_/ \__,_|\__\__,_|_|  \____/ \__\__,_|\__|___/\_| |_/\___|_| .__/ \___|_|   
//                                                                     | |              
//                                                                     |_|              

// Avatar stats master object
var avatarStatsHelper = {};

// Avatar stats helper get stats
avatarStatsHelper.getAllStats = function (result) {
  // Reference the avatar stats
  var avatarData = result.avatars;

  // Get avatar IDs
  var avatarIDs = [];
  for (var avatar in avatarData) {
    avatarIDs.push(avatar);
  }

  // Set result's avatar stats found bool
  result.avatarStatsFound = false;

  // Query avatar stats table
  return avatarStatsTable.findAll({
    where: {
      id: {
        $in: avatarIDs
      }
    }
  }).then(function (avatarStats) {
    // If avatarStats were found
    if (avatarStats) {
      // Set avatar stats found bool to be true
      result.avatarStatsFound = true;

      // Iterate over all avatar stats
      for (var i = 0; i < avatarStats.length; ++i) {
        // Get the avatar stats
        var stats_i = avatarStats[i].dataValues;
        // Get avatarName
        var avatarID = stats_i.id;
        // Add avatar stats to result's associated avatar
        avatarData[avatarID].stats = {
          // Win loss ratio
          winLossRatio: stats_i.winLossRatio,
          // Avatar type
          avatarType: stats_i.avatarType,
          // Win velocity
          // winVelocity: stats_i.winVelocity,
          // Elo / rank
          elo: stats_i.elo,
          // Win streak
          winStreak: stats_i.winStreak
        };
      }
    }
    // Otherwise, avatar stats weren't found

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

// Export avatar stats helper
module.exports = avatarStatsHelper;
