angular.module('VBattle.signout', [])

.controller('SignoutCtrl', function ($scope, $rootScope, $location, Users) {
  $rootScope.auth = false;
  $scope.signout = function () {
    $location.path('/');
  }();
});