angular.module('VBattle.profile', [])

.controller('ProfileCtrl', function ($scope, $rootScope, $location, Auth, Profile) {
  $scope.user = Auth.getUser();

  $scope.addAvatar = function () {

    var avatar = {
      "userID": 1,
      "avatarData": {
        "avatarName": $scope.avatarName,
        "imagePath": $scope.imagePath,
        "aboutMe": $scope.aboutMe
      }
    };

    console.log($scope.user);
    Profile.addAvatar(avatar)
    .then(function (data) {
      console.log('this worked', data);
      for (avatarID in data.avatars) {
        $scope.user.avatars[avatarID] = data.avatars[avatarID];
      }
    });
  };
});