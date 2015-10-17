angular.module('VBattle.services', [])

// Factory handling authentication and token for OAuth
.factory('Auth', function ($http) {
  // Post username and password to verify log in; receives JSON object 
  var signin = function (username, password) {
    var user = {
      username: username,
      password: password
    }
    
    return $http.post('/login', user)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  // Post username and password to sign up; receives JSON object with signupSuccess and usernameAvailable as booleans 
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
    signup: signup
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
    
    return $http.get('/room/id='+roomID)
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
});