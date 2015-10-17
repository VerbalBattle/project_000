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
var db = require('./db_config.js');
// Require bcrypt
var bcrypt = require('bcrypt');

//                           _   _      _                 
//                          | | | |    | |                
//  _   _ ___  ___ _ __ ___ | |_| | ___| |_ __   ___ _ __ 
// | | | / __|/ _ \ '__/ __||  _  |/ _ \ | '_ \ / _ \ '__|
// | |_| \__ \  __/ |  \__ \| | | |  __/ | |_) |  __/ |   
//  \__,_|___/\___|_|  |___/\_| |_/\___|_| .__/ \___|_|   
//                                       | |              
//                                       |_|              

// Users helper master object
var usersHelper = {};

// Users helper make new user
usersHelper.makeUser = function (username, password) {
  // Generate a salt
  var salt = bcrypt.genSaltSync(10);
  // Find one user with username
  return db.users.create({
    username: username,
    password: password,
    salt: salt
  }).then(function (userCreated) {
    return userCreated.dataValues;
  });
};

// Users helper signup
usersHelper.signup = function (data) {
  // Get username
  var username = data.username;
  // Get password
  var password = data.password;
  // Get callback
  var callback = data.callback;
  // Result to return
  var result = {};
  
  // Login successful bool
  result.signupSuccess = false;
  // Username available
  result.usernameAvailable = false;

  // If username or password is not provided
  if (username && username !== ''
    && password && password !== '') {
    // Look for one user with username
    return db.users.find({
      where: {
        username: username
      },
      limit: 1
    }).then(function (userFound) {
      // If user is found
      if (userFound) {
        console.log('\n\nDUPLICATE USER:', 
          userFound.username, 'already exists');
        // Invoke callback
        callback(result);
      } else {
        // Set username available bool
        result.usernameAvailable = true;
        // Make user
        return usersHelper.makeUser(username, password)
          .then(function (userCreated) {
            console.log('\n\nUSER CREATED:\n',
              userCreated, 'added');
            // Set signup success to be true
            result.signupSuccess = true;

            // Set user id
            result.userID = userCreated.id;
            // Set username
            result.username = userCreated.username;

            // Get the rest of the user's data
            usersHelper.getAllLoginData(result, callback);
          });
      }
    });
  } else {
    // Username or password is empty/not provided
    // Invoke callback
    result.empty = true;
    // Invoke callback
    callback(result);
  }

};

// Users helper login
usersHelper.login = function (data) {
  // Get username
  var username = data.username;
  // Get password
  var password = data.password;
  // Get callback
  var callback = data.callback;
  // Result to return
  var result = {};

  // Login successful bool
  result.loginSuccess = false;
  // Username successful bool
  result.usernameFound = false;

  // If username or password is not provided
  if (username && username !== ''
    && password && password !== '') {
    // Look for one user with username
    return db.users.find({
      where: {username: username},
      limit: 1
    }).then(function (userFound) {
      // If user is found
      if (userFound) {
        // Get the user data
        userFound = userFound.dataValues;

        // Set username to be found
        result.usernameFound = true;

        // Log
        console.log('\n\nLOGIN | USERNAME FOUND:', username);

        // Try to match username and password
        result.passwordSuccess
          = usersHelper.passwordMatch(userFound.salt,
              password,
              userFound.password);

        // Check if password correct
        if (result.passwordSuccess) {
          console.log('\n\nPassword correct');

          // Login successful
          result.loginSuccess = true;
          // User ID found
          result.userID = userFound.id;
          // Username found
          result.username = userFound.username;

          // Get the rest of the user's data
          usersHelper.getAllLoginData(result, callback);
        } else {
          // Password is not correct
          console.log('\n\nWrong password');
          // Invoke callback
          callback(result);
        }
      } else {
        // Username wasn't found
        console.log('\n\nLOGIN | USERNAME NOT FOUND:', username);
        // Invoke callback
        callback(result);
      }
    });
  } else {
    // Username or password is incorrect or not provided
    // Invoke callback
    result.empty = true;
    // Invoke callback
    callback(result);
  }
};

// Users helper password match
usersHelper.passwordMatch = function (salt, givenPass, testPass) {
  // Generate hash
  var hash = bcrypt.hashSync(givenPass, salt);
  // Return if passwords match
  return givenPass === testPass;
};

// Users helper get user stats
usersHelper.getUserStats = function (data) {

};

// Users helper get all login data
usersHelper.getAllLoginData = function (data, callback) {
  return playersHelper.getAllPlayers(data)
    .then(function () {
      callback(data);
    });
};

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
  var username = result.username;
  // Any players found bool
  result.playersFound = false;

  // If no username found
  if (username && username !== '') {
    // Query players table
    return db.players.find({
      where: {
        username: username
      }
    }).then(function (playersFound) {
      // If any players were found
      if (playersFound) {
        // Set playersFound bool
        result.playersFound = true;

        // Set players object
        result.players = {};
        var players = result.players;

        // Iterate over all players
        for (var i = 0; i < playersFound.length; ++i) {
          // Get player reference
          var player = result.players[playersFound[i]];
          // Add player information for client
          players[player.playername] = {
            imagePath: '../some/Image/Path.png',
            aboutMe: player.aboutMe
          };
        }

        // Passoff result to player stats collector
        return playerStatsHelper.getAllStats(result)
          .then(function () {
            // Return the modified result with populated stats
            // return result;
          });
      } else {
        // No players were found
        // callback(result);
      }
    })
  } else {
    // Username wasn't provided
    result.usernameProvided = false;
    // callback(result);
  }
};

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
  // Get player keys (playernames)
  var playerKeys = Object.keys(playerData);

  // Set result's player stats found bool
  result.playerStatsFound = false;

  // Query player stats table
  return db.playerStats.find({
    where: {
      playername: {
        $in: playerKeys
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
        var stats_i = playerStats[i];
        // Get playername
        var playername = stats_i.playername;
        // Add player stats to result's associated player
        playerData[playername].stats = {
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

// Export users helpers
module.exports.usersHelper = usersHelper;
// Export players helper
module.exports.playersHelper = playersHelper;
// Export player stats helper
module.exports.playerStatsHelper = playerStatsHelper;
