angular.module('VBattle.profile', [])


.controller('ProfileCtrl', function ($scope, $location, Profile, mySocket, $document) {
  // Gets current user from localStorage
  $scope.user = JSON.parse(window.localStorage['user']);
  // Gets user avatars
  $scope.user.avatars = $scope.user.avatars || {};
  // Whether avatar limit is reached
  $scope.showadd = Object.keys($scope.user.avatars).length < $scope.user.avatarLimit;
  // Image source compressed
  $scope.imageSrcComp = "";

  $scope.addAvatar = function () {
    var avatar = {
      "avatarData": {
        "avatarName": $scope.avatarName,
        "imageSource": $scope.imageSrcComp,
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
      $scope.lengthBox = 12 / Object.keys($scope.user.avatars).length;

      // clear form
      $scope.avatarName = "";
      $scope.aboutMe = "";
      $document.find('#addAvatar').modal('hide');
    });
  };
  
  $scope.editAvatar = function () {
    var avatar = {
      "avatarData": {
        "imageSource": this.value.imageSource,
        "aboutMe": this.value.aboutMe
      }
    };
    var avatarID = this.key;
    var avatarName = this.value.avatarName;

    Profile.editAvatar(avatarID, avatar)
    .then(function (data) {
      console.log("Edited avatar", data);
      $document.find('#editAvatar').modal('hide');
      if (data.updateSuccess) {
        $scope.user.avatars[avatarID] = avatar.avatarData;
        $scope.user.avatars[avatarID].avatarName = avatarName;
        window.localStorage['user'] = JSON.stringify($scope.user);
      }
    });
  };

  $scope.uploadFile = function (files) {
    //Take the first selected file
    var reader = new FileReader();

    reader.onload = function (e) {
      var res = e.target.result;
      var src = btoa(res);
      var myImage = new Image({
        src: 'data:image/jpeg;base64,' + src
      });

      $scope.$apply();
      var canvas = $document.find("canvas");
      console.log(canvas)

      if (myImage.height < myImage.width) {
        canvas.height = 150;
        canvas.width = myImage.width / myImage.height * 150;
      } else {
        canvas.width = 150;
        canvas.height = myImage.height / myImage.width * 150;
      }
      var ctx = canvas.getContext("2d");
      ctx.drawImage(myImage, 0, 0, myImage.width, myImage.height);
      $scope.imageSrcComp = canvas.toDataURL();

    };
    reader.readAsBinaryString(files[0]);
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
        $scope.lengthBox = 12 / Object.keys($scope.user.avatars).length;
      }
    });
  };
});


