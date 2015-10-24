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
// Require avatar stats table
var avatarStatsTable = require('./db_config').avatarStats;

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
            imagePath: '../some/Image/Path.png',
            aboutMe: avatar.aboutMe
          };
        }

        // Passoff result to avatar stats collector
        return avatarStatsHelper.getAllStats(result);

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
          console.log(result.avatarCount);
          result.avatarCount = avatarsFound.length;
          console.log(result.avatarCount);
        }

        // Continue only if avatarCount is less than 3
        if (result.avatarCount < 3) {
          
          // Check to make sure avatar hasn't already been created
          result.avatarAlreadyExists = true;
          for (var i = 0; i < avatarsFound.length; ++i) {
            // Check avatarName
            if (avatarsFound[i].dataValues.avatarName.toUpperCase()
              === avatarData.avatarName.toUpperCase()) {
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
            // Image path
            imagePath: 'something/goes/here.png',
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
              imagePath: avatarCreated.imagePath,
              // About me
              aboutMe: avatarCreated.aboutMe
            };

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
      var newImagePath = avatarData.imagePath
        || avatarFound.dataValues.imagePath;
      var newAboutMe = avatarData.aboutMe.substr(0, 255)
        || avatarFound.dataValues.aboutMe;
      // Make update
      return avatarFound.update({
        imagePath: newImagePath,
        aboutMe: newAboutMe
      }).then(function () {

        // Set update success to true
        result.updateSuccess = true;
        // Invoke callback
        callback(result);
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
            console.log('\n\naffectedInfoRow:', affectedInfoRow, '\n\n');

            // Avatar removed successfully
            result.removeSuccess = true;

            // Invoke callback
            callback(result);
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
