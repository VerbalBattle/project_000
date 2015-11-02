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

// Require users table
var usersTable = require('./db_config').users;

// Require avatars table
var avatarsTable = require('./db_config').avatars;
// Require avatar images table
var avatarImagesTable = require('./db_config').avatarImages;
// Require avatar stats table
var avatarStatsTable = require('./db_config').avatarStats;
// Require rooms table
var roomsTable = require('./db_config').rooms;

// Require avatarStatsHelper
var avatarStatsHelper = require('./avatarStatsHelper');

//                   _             _   _      _                 
//                  | |           | | | |    | |                
//   __ ___   ____ _| |_ __ _ _ __| |_| | ___| |_ __   ___ _ __ 
//  / _` \ \ / / _` | __/ _` | '__|  _  |/ _ \ | '_ \ / _ \ '__|
// | (_| |\ V / (_| | || (_| | |  | | | |  __/ | |_) |  __/ |   
//  \__,_| \_/ \__,_|\__\__,_|_|  \_| |_/\___|_| .__/ \___|_|   
//                                             | |              
//                                             |_|              

// Avatar helper master object
var avatarsHelper = {};

// Avatar help get all avatars
avatarsHelper.getAllAvatars = function (result) {
  // result param is the result to return (send to client)

  // Get username
  var userID = result.userID;

  // If no username found
  if (userID !== undefined && userID > 0) {
    // Query avatars table
    return avatarsTable.findAll({
      where: {
        userID: userID
      }
    }).then(function (avatarsFound) {
      // If any avatars were found
      if (avatarsFound.length > 0) {
        // Set avatarsFound bool
        result.avatarsFound = true;

        // Set avatars object
        result.avatars = {};
        var avatars = result.avatars;

        // Iterate over all avatars
        for (var i = 0; i < avatarsFound.length; ++i) {
          // Get avatar reference
          var avatar = avatarsFound[i].dataValues;
          // Add avatar information for client
          avatars[avatar.id] = {
            avatarName: avatar.avatarName,
            // imageSource: avatar.imageSource,
            aboutMe: avatar.aboutMe
          };
        }

        // Get all images for each avatar
        return avatarImagesTable.findAll({
          where: {
            id: {
              $in: Object.keys(avatars)
            }
          }
        }).then(function (avatarImagesFound) {
          // Iterate over all avatars
          for (var i = 0; i < avatarImagesFound.length; ++i) {
            // Get avatar image data
            var data = avatarImagesFound[i].dataValues;
            // Get avatar reference
            avatars[data.id].imageSource =
              data.imageSource.toString('utf-8');
          }
        }).then(function () {
          // Passoff result to avatar stats collector
          return avatarStatsHelper.getAllStats(result);
        });


      } else {
        // No avatars were found
        result.avatarsFound = false;
      }
    });
  } else {
    // Username wasn't provided
    result.usernameProvided = false;
  }
};

// Avatars helper add avatar
avatarsHelper.addAvatar = function (data) {
  // Get username
  var userID = data.userID;
  // Get callback
  var callback = data.callback;
  // Get avatardata
  var avatarData = data.avatarData;

  // Result to store avatar data in
  var result = {};
  // Assume userID not found
  result.userFound = false;
  // Assume avatar can't be created
  result.avatarCreated = false;
  result.avatarCount = 0;

  // Check if userID exists
  return usersTable.find({
    where: {
      id: userID
    }
  }).then(function (userFound) {
    // Continue only if user found
    if (userFound) {
      // Delete user found key
      delete result.userFound;

      // Count all avatars for user
      return avatarsTable.findAll({
        where: {
          userID: userID
        }
      }).then(function (avatarsFound) {

        // Set the avatar count
        result.avatarCount = 0;

        // Set count if avatars found
        if (avatarsFound) {
          // Set avatars found to be what we need
          result.avatarCount = avatarsFound.length;
        }

        // Continue only if avatarCount is less than 3
        if (result.avatarCount < 3) {
          
          // Check to make sure avatar hasn't already been created
          result.avatarAlreadyExists = true;
          for (var i = 0; i < avatarsFound.length; ++i) {
            // Get avatar found
            var avatarFound = avatarsFound[i].dataValues;
            // Check avatarName
            if (avatarFound.avatarName.toUpperCase() ===
              avatarData.avatarName.toUpperCase()) {
              // Invoke callback
              callback(result);
              // Return
              return;
            }
          }

          // Set avatarAlreadyExists to be true
          result.avatarAlreadyExists = false;

          // Create avatar
          return avatarsTable.create({
            // Username
            userID: userID,
            // Avatar name
            avatarName: avatarData.avatarName,
            // Image
            // imageSource: avatarData.imageSource,
            // About me
            aboutMe: avatarData.aboutMe.substr(0, 255)
          }).then(function (avatarCreated) {

            // Get reference to data we need
            avatarCreated = avatarCreated.dataValues;

            // Add avatars object
            result.avatars = {};
            result.avatars[avatarCreated.id] = {
              // Avatar name
              avatarName: avatarCreated.avatarName,
              // Image path
              // imageSource: avatarCreated.imageSource,
              // About me
              aboutMe: avatarCreated.aboutMe
            };

            // Set avatar image
            return avatarImagesTable.create({
              // ID
              id: avatarCreated.id,
              // Image source in binary
              imageSource: avatarData.imageSource
            }).then(function (avatarImageCreated) {

              // Send image back to client
              result.avatars[avatarImageCreated.id].imageSource =
                avatarImageCreated.dataValues.imageSource;
              // Initialize stats for the avatar created
              return avatarStatsTable.create({
                id: avatarCreated.id
              }).then(function (statsCreated) {

                // Get reference to data we need
                statsCreated = statsCreated.dataValues;

                // Set stats data
                result.avatars[avatarCreated.id].stats = {
                  // Win loss ratio
                  winLossRatio: statsCreated.winLossRatio,
                  // Avatar type
                  avatarType: statsCreated.avatarType,
                  // Win velocity
                  winVelocity: statsCreated.winVelocity,
                  // Rank
                  rank: statsCreated.rank,
                  // Win streak
                  winStreak: statsCreated.winStreak
                };

                // Set result's avatar created bool
                result.avatarCreated = true;

                // Delete avatar count
                delete result.avatarCount;
                // Delete avatar already exists
                delete result.avatarAlreadyExists;
                // Invoke callback
                callback(result);
              });
            });
          });
        }

        // Avatar count exceeded 3
        result.tooManyAvatars = true;
        // Invoke callback
        callback(result);
      });
      
    } else {
      // The userID wasn't found
      callback(result);
    }
  });
};

// Avatars helper edit avatar
avatarsHelper.editAvatar = function (data) {
  // Get username
  var userID = data.userID;
  // Get avatarName
  var avatarID = data.avatarID;
  // Get callback
  var callback = data.callback;
  // Get avatarData
  var avatarData = data.avatarData;

  // Result to send to client
  var result = {};
  // Assume update fails
  result.updateSuccess = false;

  // Attempt update on userID avatarID combo
  return avatarsTable.find({
    where: {
      userID: userID,
      id: avatarID
    }
  }).then(function (avatarFound) {
    
    // If the avatar was found
    if (avatarFound) {
      // Get update parameters
      var newImageSource = avatarData.imageSource ||
        avatarFound.dataValues.imageSource;
      var newAboutMe = avatarData.aboutMe.substr(0, 255) ||
        avatarFound.dataValues.aboutMe;
      
      // Make update avatarsTable
      return avatarFound.update({
        // imageSource: newImagePath,
        aboutMe: newAboutMe
      }).then(function () {
        
        // Update avatarImagesTable
        return avatarImagesTable.update({
          imageSource: newImageSource
        }, {
          where: {
            id: avatarID
          }
        }).then(function () {
          // Set update success to true
          result.updateSuccess = true;

          // Invoke callback
          callback(result);
        });
      });
    } else {
      // Avatar/user combo wasn't found
      result.avatarFound = false;
      // Invoke callback
      callback(result);
    }
  });
};

// Avatars helper delete avatar
avatarsHelper.deleteAvatar = function (data) {
  // Get username
  var userID = data.userID;
  // Get avatarName
  var avatarID = data.avatarID;
  // Get callback
  var callback = data.callback;

  // Result for data to return to client
  var result = {};
  // Assume removal unsuccessful
  result.removeSuccess = false;

  // Check if userID exists
  return usersTable.find({
    where: {
      id: userID
    }
  }).then(function (userFound) {
    // Only continue if user was found
    if (userFound) {
      // Find avatar stats
      return avatarStatsTable.destroy({
        where: {
          id: avatarID
        },
        limit: 1
      }).then(function (affectedStatsRow) {
        // If a avatar stats row was found
        console.log('\n\naffectedRows:', affectedStatsRow, '\n\n');
        if (affectedStatsRow) {
          
          // Delete corresponding avatar info
          return avatarsTable.destroy({
            where: {
              userID: userID,
              id: avatarID
            },
            limit: 1
          }).then(function (affectedInfoRow) {
            // If avatar info was found
            console.log('\n\naffectedInfoRow:',
              affectedInfoRow, '\n\n');

            // Avatar removed successfully
            result.removeSuccess = true;

            // Invoke callback
            callback(result);

            // Award a win to the other player in any open
            // game with this avatarID
            return roomsTable.findAll({
              where: {
                $or: [
                  {
                    avatar1_id: avatarID,
                    roomState: 0
                  },
                  {
                    avatar2_id: avatarID,
                    roomState: 0
                  }
                ]
              }
            }).then(function (roomsFound) {
              // Avatars to award win to
              var winnerAvatarIDs = [];

              // Loop over rooms found
              for (var i = 0; i < roomsFound.length; ++i) {
                var roomFound = roomsFound[i].dataValues;
                // If the room is open
                if (roomFound.roomState < 2) {
                  // Identify opponent player
                  var opponentAvatarID = roomFound.avatar1_id;
                  if (roomFound.avatar1_id === avatarID) {
                    opponentAvatarID = avatar2_id;
                  }
                  // Push the opponent avatarID into winners
                  winnerAvatarIDs.push(opponentAvatarID);
                }
                // Destroy room regardless
                roomsFound[i].destroy();
              }

              // Award wins to winners
              if (0 < winnerAvatarIDs.length) {
                // Lookup in avatarStats
                avatarStatsTable.findAll({
                  where: {
                    id: {
                      $in: winnerAvatarIDs
                    }
                  }
                }).then(function (avatarStatsFound) {
                  // Update stats to reflect a win
                  for (var i = 0; i < avatarStatsFound.length; ++i) {
                    // Resulting stats
                    var newStats = {};
                    newStats.winCount =
                      avatarStatsFound[i].dataValues.winCount + 1;
                    newStats.gameCount =
                      avatarStatsFound[i].dataValues.gameCount + 1;
                    newStats.winLossRatio =
                      newStats.winCount / newStats.gameCount;
                    newStats.winStreak = 
                      avatarStatsFound[i].dataValues.winStreak + 1;

                    // Update avatarStats
                    avatarStatsFound[i].update({
                      winCount: newStats.winCount,
                      gameCount: newStats.gameCount,
                      winLossRatio: newStats.winLossRatio,
                      winStreak: newStats.winStreak
                    });
                  }
                });
              }
            });
          });
        } else {
          // No avatar was found
          result.avatarFound = false;
          // Invoke callback
          callback(result);
        }
      });
    } else {
      // User wasn't found
      result.userFound = false;
      // Invoke callback, user wasn't found
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

// Export avatars helper
module.exports = avatarsHelper;
