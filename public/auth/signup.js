angular.module('VBattle.signup', [])
// Sign up controller
.controller('SignupCtrl', function($rootScope, $scope, $location, Auth) {
  $scope.signup = function () {
    var user = {
      username: $scope.username,
      password: $scope.password,
      email: $scope.email
    };
    // Post username and password to sign up; receives JSON object with signupSuccess and usernameAvailable as booleans upon failure, and data about user upon success 
    Auth.signup(user)
    .then(function (data) {
      console.log(data)
      $scope.username = '';
      $scope.password = '';
      if(data.signupSuccess) {
        $rootScope.auth = true;
        $location.path('/');
      }
    });
  };
});