angular.module('VBattle.profile', [])

.controller('ProfileCtrl', function ($scope, $rootScope, $location, Auth, Profile) {
  $scope.user = Auth.getUser();
  $scope.user.avatars = $scope.user.avatars || {};

  $scope.addAvatar = function () {

    var avatar = {
      "userID": $scope.user.userID,
      "avatarData": {
        "avatarName": $scope.avatarName,
        "imagePath": $scope.imagePath,
        "aboutMe": $scope.aboutMe
      }
    };
    Profile.addAvatar(avatar)
    .then(function (data) {
      console.log('this worked', data);
      for (avatarID in data.avatars) {
        $scope.user.avatars[avatarID] = data.avatars[avatarID];
      }
    });
  };
  $scope.removeAvatar = function () {
    var user = {
      userID: $scope.user.userID,
      avatarID: +this.key
    };
    Profile.removeAvatar(user)
    .then(function (data) {
      console.log(data);
      if (data.removeSuccess) {
        delete $scope.user.avatars[user.avatarID];
      }
    });
  };
});