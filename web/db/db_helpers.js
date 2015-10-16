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

//                      _   _      _                 
//                     | | | |    | |                
//  _   _ ___  ___ _ __| |_| | ___| |_ __   ___ _ __ 
// | | | / __|/ _ \ '__|  _  |/ _ \ | '_ \ / _ \ '__|
// | |_| \__ \  __/ |  | | | |  __/ | |_) |  __/ |   
//  \__,_|___/\___|_|  \_| |_/\___|_| .__/ \___|_|   
//                                  | |              
//                                  |_|              

// User helper master object
var userHelper = {};

// User helper make new user
userHelper.makeUser = function (username, password) {
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

// User helper signup
userHelper.signup = function (username, password, callback) {
  // Result to return
  var result = {};
  
  // Login successful bool
  result.signupSuccess = false;
  // Username available
  result.usernameAvailable = false;

  // If username or password is not provided
  console.log('fuck you', password);
  if (!password) {
    result.fuckyou = false;
    callback(result);
    return;
  }
  if (username && username !== ''
    && password && password !== '') {
    // Look for one user with username
    return db.users.find({
      where: {username: username},
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
        return userHelper.makeUser(username, password)
          .then(function (userCreated) {
            console.log('\n\nUSER CREATED:\n',
              userCreated, 'added');
            // Set signup success to be true
            result.signupSuccess = true;

            // Set user id
            result.userID = userCreated.id;
            // Set username
            result.username = userCreated.username;
            // Invoke callback on user
            callback(result);
          });
      }
    });
  } else {
    // Username or password is empty/not provided
    // Invoke callback
    result.empty = true;
    callback(result);
  }

};

// User helper login
userHelper.login = function (username, password, callback) {
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
          = userHelper.passwordMatch(userFound.salt,
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
          console.log(callback.toString());
          // Invoke callback on result
          callback(result);

          // Get other required data
          // return userHelper.getAllLoginData(result)
          //   .then(function (finalResult) {
          //     return finalResult;
          //   });
        } else {
          // Password is not correct
          console.log('\n\nWrong password');
          callback(result);
        }
      } else {
        // Username wasn't found
        console.log('\n\nLOGIN | USERNAME NOT FOUND:', username);
        callback(result);
      }
    });
  } else {
    // Username or password is incorrect or not provided
    // Invoke callback
    result.empty = true;
    callback(result);
  }
};

// User helper password match
userHelper.passwordMatch = function (salt, givenPass, testPass) {
  // Generate hash
  var hash = bcrypt.hashSync(givenPass, salt);
  // Return if passwords match
  return givenPass === testPass;
};

// User helper get user stats
userHelper.getUserStats = function (data) {

};

// Get all user data for login
userHelper.getAllLoginData = function (data) {
  return data;
  // Get user statistics
  return getUserStats(data)
    .then(function (statsResult) {

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
module.exports.userHelper = userHelper;
