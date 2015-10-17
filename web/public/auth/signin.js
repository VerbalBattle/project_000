angular.module('VBattle.signin', [])
// Sign in controller
.controller('SigninCtrl', function ($scope, $rootScope, $location, Auth) {
  $scope.signin = function () {
    var user = {
      username: $scope.username,
      password: $scope.password
    }
    // Post username and password to verify log in; receives JSON object with loginSuccess and usernameFound as booleans upon failure, and data about user upon success 
    Auth.signin(user)
    .then(function (data) {
      console.log(data)
      $scope.username = '';
      $scope.password = '';
      if(data.loginSuccess) {
        $rootScope.auth = true;
        $location.path('/');
      }
    });
  };
});