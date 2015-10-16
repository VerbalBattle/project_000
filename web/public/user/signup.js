angular.module('VBattle.signup', [])

.controller('SignupCtrl', function($rootScope, $scope, $location, Users) {
  $scope.signup = function () {
    var user = {
      username: $scope.username,
      password: $scope.password,
      email: $scope.email      
    };
    Users.signup(user)
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