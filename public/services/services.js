angular.module('VBattle.authServices', [])
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
        // share userData between controllers
        userData = resp.data;
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
});