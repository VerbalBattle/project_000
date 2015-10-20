angular.module('VBattle.services', [])

// Factory handling authentication and token for OAuth
.factory('Auth', function ($http) {
  var userData = {};

  var getUser = function () {
    return userData;
  };

  // Post username and password to verify log in; receives JSON object with loginSuccess and usernameFound as booleans upon failure, and data about user upon success 
  var signin = function (user) {

    return $http.post('/login', user)
      .then(function (resp) {
        // share userData between controllers
        userData = resp.data;
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  // Post username and password to sign up; receives JSON object with signupSuccess and usernameAvailable as booleans upon failure, and data about user upon success 
  var signup = function (user) {

    return $http.post('/signup', user)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  return {
    signin: signin,
    signup: signup,
    getUser: getUser
  };
})

// Factory handling game play, including room creation and post/get messages
.factory('GamePlay', function ($http) {
  // Get all rooms that are completed and ready for voting, expects result to be the oldest room
  var getGames = function () {

    return $http.get('/rooms')
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  // Post user data to matchmaking queue and expects a filled room
  var startGame = function (user) {

    return $http.post('/matchmaking', user)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  // Get room based on roomID
  var getMessages = function (roomID) {

    return $http.get('/rooms/'+roomID)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };

  return {
    getGames: getGames,
    startGame: startGame,
    getMessages: getMessages
  };
})
// Factory handling profile and avatar actions
.factory('Profile', function ($http) {
  var getAvatars = function (userId) {
    
  }
  
  var addAvatar = function (avatar) {
    return $http.post('/avatars', avatar)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  }
  return {
    addAvatar: addAvatar
  };
})