angular.module('VBattle.profile', [])

.controller('ProfileCtrl', function ($scope, $rootScope, $location, Users) {
  $rootScope.auth = true;
  if(!$rootScope.auth) {
    $location.path('/login');
  }
});