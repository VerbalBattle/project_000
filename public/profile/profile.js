angular.module('VBattle.profile', [])

.controller('ProfileCtrl', function ($scope, $rootScope, $location, Auth, Profile) {
  $scope.user = Auth.getUser();

  $scope.addAvatar = function () {
    
    var avatar = {
      userID: $scope.user.userID,
      playerData: {
        playername: $scope.playerName,
        imagePath: $scope.imagePath,
        aboutMe: $scope.aboutMe
      }
    }
    console.log(avatar)
    Profile.addAvatar(avatar)
    .then(function (data) {
      var avatarID = data.playerData.playerID;
      $scope.user.players[avatarID] = data.playerData;
    })
  }
});