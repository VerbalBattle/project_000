angular.module('VBattle.signin', [])

.controller('SigninCtrl', function ($scope, $rootScope, $location, Auth) {
  $scope.signin = function () {
    Auth.signin($scope.username, $scope.password)
    .then(function (data) {
      console.log(data)
      $scope.username = '';
      $scope.password = '';
      if(data.loginSuccess) {
        $rootScope.auth = true;
        $location.path('/');
      }
    });
  };
});