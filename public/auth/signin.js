angular.module('VBattle.signin', [])
// Sign in controller
.controller('SigninCtrl', function ($scope, $location, $auth, $http, Profile) {

  $scope.signin = function () {
    var user = {
      username: $scope.username,
      password: $scope.password
    };

    $auth.login(user)
      .then(function () {
        // toastr.success('You have successfully signed in');
        Profile.getUserFromLogin()
        .then(function () {
          window.localStorage['user'] = JSON.stringify(Profile.getUser());
          $location.path('/');
        });
      })

      .catch(function (response) {
        console.log('failed', response);
        // toastr.error(response.data.message, response.status);
      });
  };


  $scope.authenticate = function (provider) {
    $auth.authenticate(provider)
      .then(function () {
        // toastr.success('You have successfully signed in with ' + provider);
        $location.path('/');
      })

      .catch(function (response) {
        // toastr.error(response.data.message);
      });
  };
});