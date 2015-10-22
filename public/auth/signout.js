angular.module('VBattle.signout', [])
// Signs out user
.controller('SignoutCtrl', function ($scope, $auth, $location) {
  // Clear the auth variable from root scope
  $scope.signout = function () {
    $auth.logout()
      .then(function () {
        // toastr.info('You have been logged out');
        $location.path('/');
      });
  }();
});