angular.module('VBattle.profile', [])


.controller('ProfileCtrl', function ($scope, $location, Profile, mySocket, $document) {

  $scope.user = JSON.parse(window.localStorage['user']);
  $scope.user.avatars = $scope.user.avatars || {};
  $scope.showadd = Object.keys($scope.user.avatars).length < $scope.user.avatarLimit;
  $scope.lengthBox = 12 / Object.keys($scope.user.avatars).length;
  $scope.image = "";
  $scope.imageSource = window.localStorage["image"];

  $scope.addAvatar = function () {
    var avatar = {
      "avatarData": {
        "avatarName": $scope.avatarName,
        "image": $scope.image,
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
      $scope.image = "";
      $scope.aboutMe = "";
      $document.find('#addAvatar').modal('hide');
    });
  };
  
  $scope.editAvatar = function () {
    var avatar = {
      "avatarData": {
        "image": this.value.image,
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
      }
    });
  };   


  $scope.uploadFile = function (files) {
    //Take the first selected file
    var reader = new FileReader();

    reader.onload = function (e) {
      var res = e.target.result;
      var src = btoa(res);
      $scope.image = 'data:image/jpeg;base64,' + src;
      console.log("scope image is now", $scope.image)
      $scope.$apply();
      var canvas = $document.find("#canvas")[0];

      var myImage = new Image();
      myImage.src = $scope.image;

      var newHeight, newWidth;
      if (myImage.height < myImage.width) {
        canvas.style.height = 70 + 'px';
        canvas.style.width = myImage.width / myImage.height * 70 + 'px';
      } else {
        canvas.style.width = 70 + 'px';
        canvas.style.height = myImage.height / myImage.width * 70 + 'px';
      }
      var ctx = canvas.getContext("2d");
      console.log(canvas.width, canvas.height)
      ctx.drawImage(myImage, 0, 0, 70, 70);
      $scope.image = canvas.toDataURL();
      console.log($scope.image);
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


