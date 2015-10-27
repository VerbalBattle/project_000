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

// Require users table
var usersTable = require('./db_config.js').users;

// Require avatars helper
var avatarsHelper = require('./avatarsHelper');

// Require rooms helper
var roomsHelper = require('./roomsHelper');

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
  // Encrypted pasword
  var encryptedPassword = bcrypt.hashSync(password, salt);

  // Find one user with username
  return usersTable.create({
    username: username,
    password: encryptedPassword,
    salt: salt
  }).then(function (userCreated) {
    return userCreated.dataValues;
  });
};

// Users helper signup
usersHelper.signup = function (data, callback) {
  // Get username
  var username = data.username;
  // Get password
  var password = data.password;

  // Result to return
  var result = {};
  
  // Login successful bool
  result.signupSuccess = false;
  // Username available
  result.usernameAvailable = false;

  // If username or password is not provided
  if (username && username !== '' &&
    password && password !== '') {
    // Look for one user with username
    return usersTable.find({
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
        // Delete username available bool
        delete result.usernameAvailable;
        // Make user
        return usersHelper.makeUser(username, password)
          .then(function (userCreated) {
            console.log('\n\nUSER CREATED:\n\n');
            // Delete signup success to be true
            delete result.signupSuccess;

            // Set user id
            result.userID = userCreated.id;
            // Set username
            result.username = userCreated.username;
            // Set twitter
            result.twitter = userCreated.twitter;

            // Get the rest of the user's data
            usersHelper.getAllUserData(result, callback);
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
usersHelper.login = function (data, callback) {
  // Get username
  var username = data.username;
  // Get password
  var password = data.password;

  // Result to return
  var result = {};

  // Username successful bool
  result.usernameFound = false;

  // If username or password is not provided
  if (username && username !== '' &&
    password && password !== '') {
    // Look for one user with username
    return usersTable.find({
      where: {username: username},
      limit: 1
    }).then(function (userFound) {
      // If user is found
      if (userFound) {
        // Get the user data
        userFound = userFound.dataValues;

        // Set username to be found
        delete result.usernameFound;

        // Try to match username and password
        result.passwordSuccess =
          usersHelper.passwordMatch(userFound.salt,
            password,
            userFound.password);

        // Check if password correct
        if (result.passwordSuccess) {

          // Login successful

          // Delete password success bool
          delete result.passwordSuccess;

          // Set userID
          result.userID = userFound.id;
          // Set username
          result.username = userFound.username;
          // Set twitter
          result.twitter = userFound.twitter;

          // Invoke callback
          callback(result);
          // Username found
          // result.username = userFound.username;

          // Invoke callback
          // Get the rest of the user's data
          // usersHelper.getAllUserData(result, callback);
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
  return hash === testPass;
};

// Users helper get all login data
usersHelper.getAllUserData = function (data, callback) {
  // Set avatarLimit
  data.avatarLimit = 3;
  // Add all avatar data and stats
  return avatarsHelper.getAllAvatars(data)
    .then(function () {
      // Append all room information to any avatar in  room
      if (data.avatarsFound) {

        // Delete avatarsFound
        delete data.avatarsFound;

        // Append room data
        return roomsHelper.getAllRooms(data)
          .then(function () {
            // Delete userID
            delete data.userID;
            // Invoke callback on data
            callback(data);
          });
      } else {
        // Delete avatarsFound
        delete data.avatarsFound;

        // No avatars found
        callback(data);
      }
    });
};

// Users helper username to userID
usersHelper.usernameToUserID = function (username) {
  // Perform look for username
  return usersTable.find({
    where: {
      username: username
    }
  }).then(function (userFound) {
    // If user found
    var userID = null;
    if (userFound) {
      userID = userFound.dataValues.id;
    }
    return userID;
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
module.exports = usersHelper;
