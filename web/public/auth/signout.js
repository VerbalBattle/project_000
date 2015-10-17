angular.module('VBattle.signout', [])

.controller('SignoutCtrl', function ($scope, $rootScope, $location) {
  $rootScope.auth = false;
  $scope.signout = function () {
    $location.path('/');
  }();
});