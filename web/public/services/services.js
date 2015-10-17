angular.module('VBattle.services', [])
.factory('Users', function ($http) {
  // make API call to get 
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
.factory('GamePlay', function () {
  
  
  return {

  }
});