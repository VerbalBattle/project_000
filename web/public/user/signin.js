angular.module('VBattle.signin', [])

.controller('SigninCtrl', function ($scope, $rootScope, $location, Users) {
  $scope.signin = function () {
    Users.signin($scope.username, $scope.password)
    .then(function (data) {
      $scope.username = '';
      $scope.password = '';
      if(data.loginSuccess) {
        $rootScope.auth = true;
        $location.path('/');
      }
    });
  };
});