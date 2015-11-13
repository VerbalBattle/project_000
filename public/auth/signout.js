angular.module('VBattle.signout', [])
// Signs out user
.controller('SignoutCtrl', function ($scope, $auth, $location, socketFactory, toaster) {
  // Clear the auth variable from root scope
  $scope.signout = function () {
    $auth.logout()
      .then(function () {
        toaster.pop({
          type: 'success',
          title: 'You are logged out.',
          timeout: 3000
        });
        window.localStorage.removeItem(['user']);
        socketFactory().disconnect();
        $location.path('/');
      });
  }();
});