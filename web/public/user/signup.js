angular.module('VBattle.signup', [])

.controller('SignupCtrl', function($scope, $location, $route) {
  $scope.signup = function () {
    var user = {
      name: $scope.username,
      password: $scope.password,
      email: $scope.email      
    };
    Users.signup(user)
    .then(function (data) {
      console.log(data)
    });
    $scope.username = '';
    $scope.password = '';
  };
});