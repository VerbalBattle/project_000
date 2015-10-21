angular.module('VBattle.lobby', [])

.controller('LobbyCtrl', function ($scope, $location, GamePlay, Auth) {
  
  var user = Auth.getUser();
  
  $scope.postMessages = function () {
    var msg = {
      "userID": user.userID,
      "avatarID": 'a',
      "message": "my message is here"
    };
  };
});