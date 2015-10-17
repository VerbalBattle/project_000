angular.module('VBattle.signout', [])
// Signs out user
.controller('SignoutCtrl', function ($scope, $rootScope, $location) {
  // Clear the auth variable from root scope
  $rootScope.auth = false;
  $scope.signout = function () {
    $location.path('/');
  }();
});