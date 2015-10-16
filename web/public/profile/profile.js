angular.module('VBattle.profile', [])

.controller('ProfileCtrl', function ($scope, $location, Users) {
  $scope.auth = true;
  if(!$scope.auth) {
    $location.path('/login');
  }
});