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
  return usersTable.create({
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
    return usersTable.find({
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
  return avatarsHelper.getAllAvatars(data)
    .then(function () {
      callback(data);
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
