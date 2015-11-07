angular.module('VBattle.signup', [])
// Sign up controller
.controller('SignupCtrl', function ($scope, $location, $auth, Profile) {
  $scope.signup = function () {
    var user = {
      username: $scope.username,
      password: $scope.password,
      email: $scope.email
    };
    // Post username and password to sign up; receives JSON object with signupSuccess and usernameAvailable as booleans upon failure, and data about user upon success 
    $auth.signup(user)
    .then(function (resp) {
      $auth.setToken(resp);
      Profile.getUserFromLogin()
      .then(function () {
        window.localStorage['user'] = JSON.stringify(Profile.getUser());
        $location.path('/');
      });
      $scope.username = '';
      $scope.password = '';
    });
  };
});