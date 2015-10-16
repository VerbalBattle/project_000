angular.module('VBattle.profile', [])

.controller('ProfileCtrl', function ($scope, $location, Users) {
  $scope.signin = function () {
    Users.signin($scope.username, $scope.password)
    .then(function (data) {
      console.log(data);
    });
    $scope.username = '';
    $scope.password = '';
  };
});