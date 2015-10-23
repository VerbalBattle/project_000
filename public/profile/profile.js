angular.module('VBattle.profile', [])

.controller('ProfileCtrl', function ($scope, $location, Profile) {
  $scope.user = JSON.parse(window.localStorage['user']);
  $scope.user.avatars = $scope.user.avatars || {};
  $scope.showadd = Object.keys($scope.user.avatars).length < $scope.user.avatarLimit;
  $scope.addAvatar = function () {

    var avatar = {
      "avatarData": {
        "avatarName": $scope.avatarName,
        "imagePath": $scope.imagePath,
        "aboutMe": $scope.aboutMe
      }
    };

    Profile.addAvatar(avatar)
    .then(function (data) {
      console.log("added avatar", data);
      for (avatarID in data.avatars) {
        $scope.user.avatars[avatarID] = data.avatars[avatarID];
      }
      window.localStorage['user'] = JSON.stringify($scope.user);
      $scope.showadd = Object.keys($scope.user.avatars).length < $scope.user.avatarLimit;
      // clear form
      $scope.avatarName = "";
      $scope.imagePath = "";
      $scope.aboutMe = "";
      $scope.addForm = false;
    });
  };
  
  $scope.editAvatar = function () {
    var avatar = {
      "avatarData": {
        "imagePath": this.value.imagePath,
        "aboutMe": this.value.aboutMe
      }
    };

    Profile.editAvatar(this.key, avatar)
    .then(function (data) {
      console.log("added avatar", data);
      if (data.updateSuccess) {
        console.log($scope.user.avatars, this.key)
        $scope.user.avatars[this.key] = avatar.avatarData;
        $scope.user.avatars[this.key].avatarName = $scope.avatarName;
        window.localStorage['user'] = JSON.stringify($scope.user);
      }
      $scope.showEdit = false;
    });
  };
  $scope.removeAvatar = function () {
    var user = {
      avatarID: this.key
    };

    Profile.removeAvatar(user)
    .then(function (data) {
      console.log(data);
      if (data.removeSuccess) {
        delete $scope.user.avatars[user.avatarID];
        window.localStorage['user'] = JSON.stringify($scope.user);
        $scope.showadd = true;
      }
    });
  };
});