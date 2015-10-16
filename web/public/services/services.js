angular.module('VBattle.services', [])
.factory('Users', function ($http) {
  // make API call to get 
  var signin = function (username, password) {
    return $http.get('/users/'+username+'/'+password)
      .then(function (resp) {
        return resp.data;
      }, function (err) {
        throw err;
      });
  };
  var signup = function (user) {
    
    return $http.post('/signup')
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