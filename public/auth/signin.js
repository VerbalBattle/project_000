angular.module('VBattle.signin', [])
// Sign in controller
.controller('SigninCtrl', function ($scope, $rootScope, $location, Auth, $auth, $http) {
  $scope.signin = function () {
    var user = {
      username: $scope.username,
      password: $scope.password
    };

    $auth.login(user)
      .then(function() {
        console.log('success')
        // toastr.success('You have successfully signed in');
        $http.get('/users/1')
        .then(function (data) {
          console.log('is this working');
          $location.path('/');
        });
      })
      .catch(function (response) {
        console.log('failed')
        // toastr.error(response.data.message, response.status);
      });
  };

  // $scope.signin = function () {
    
  //   // Post username and password to verify log in; receives JSON object with loginSuccess and usernameFound as booleans upon failure, and data about user upon success

  //   var user = {
  //     username: $scope.username,
  //     password: $scope.password
  //   };

  //   Auth.signin(user)
  //   .then(function (data) {
  //     console.log(data);
  //     $location.path('/');
  //     $scope.username = '';
  //     $scope.password = '';
  //   });
  // };

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        // toastr.success('You have successfully signed in with ' + provider);
        $location.path('/');
      })
      .catch(function(response) {
        // toastr.error(response.data.message);
      });
  };
});