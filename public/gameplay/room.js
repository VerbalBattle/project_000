angular.module('VBattle.room', [])

.controller('RoomCtrl', function ($scope, $location, $routeParams, GamePlay, Auth) {
  
  var user = Auth.getUser();
  console.log($routeParams);
  
  $scope.postMessages = function () {
    var msg = {
      "userID": user.userID,
      "avatarID": 'a',
      "message": "my message is here"
    };
  };
});