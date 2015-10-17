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

  // If no username found
  if (username && username !== '') {
    // Query players table
    return db.players.findAll({
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
          var player = playersFound[i].dataValues;
          // Add player information for client
          players[player.playername] = {
            imagePath: '../some/Image/Path.png',
            aboutMe: player.aboutMe
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
  var username = data.username;
  // Get callback
  var callback = data.callback;
  // Get playerdata
  var playerData = data.playerData;

  // Result to store player data in
  var result = {};
  // Assume player can't be created
  result.playerCreated = false;
  result.playerCount = 0;

  // Count all players for user
  return db.players.findAll({
    where: {
      username: username
    }
  }).then(function (playersFound) {
    // Set the player count
    result.playerCount = 0;

    // Set count if players found
    if (playersFound) {
      // Set players found to be what we need
      result.playerCount = playersFound.length;
    }
    console.log('playerCOUNT: \t\t', playersFound.length);
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
      return db.players.create({
        // Username
        username: username,
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
          aboutMe: playerCreated.aboutMe
        };

        // Initialize stats for the player created
        return db.playerStats.create({
          playername: playerData.playername
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
  var username = data.username;
  // Get playername
  var playername = data.playername;
  // Get callback
  var callback = data.callback;

  // Result for data to return to client
  var result = {};
  // Assume removal unsuccessful
  result.removeSuccess = false;

  // Find player stats
  return db.playerStats.destroy({
    where: {
      playername: playername
    },
    limit: 1
  }).then(function (affectedStatsRow) {
    // If a player stats row was found
    console.log('\n\naffectedRows:', affectedStatsRow, '\n\n');
    if (affectedStatsRow) {
      
      // Delete corresponding player info
      return db.players.destroy({
        where: {
          username: username,
          playername: playername
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
  return db.playerStats.findAll({
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
        var stats_i = playerStats[i].dataValues;
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
