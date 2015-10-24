angular.module('VBattle.signout', [])
// Signs out user
.controller('SignoutCtrl', function ($scope, $auth, $location, mySocket) {
  // Clear the auth variable from root scope
  $scope.signout = function () {
    $auth.logout()
      .then(function () {
        // toastr.info('You have been logged out');
        window.localStorage.removeItem(['user']);
        mySocket.disconnect();
        mySocket.alreadyCreated = false;
        $location.path('/');
      });
  }();
});