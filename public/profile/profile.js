angular.module('VBattle.profile', [])


.controller('ProfileCtrl',
  function ($scope, $location, Profile, $document) {
  // Gets current user from localStorage
  $scope.user = JSON.parse(window.localStorage['user']);
  // Gets user avatars
  $scope.user.avatars = $scope.user.avatars || {};
  // Whether avatar limit is reached
  $scope.showadd = Object.keys($scope.user.avatars).length <
    $scope.user.avatarLimit;
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

    Profile.addAvatar(avatar).then(function (data) {
      console.log("added avatar", data);
      for (avatarID in data.avatars) {
        $scope.user.avatars[avatarID] = data.avatars[avatarID];
      }

      // Set the game count to 0
      $scope.user.avatars[Object.keys(data.avatars)[0]].gameCount = 0;

      window.localStorage['user'] = JSON.stringify($scope.user);
      $scope.showadd = Object.keys($scope.user.avatars).length < $scope.user.avatarLimit;
      $scope.lengthBox = 12 / Object.keys($scope.user.avatars).length;

      // clear form
      $scope.avatarName = "";
      $scope.aboutMe = "";
      $document.find('#addAvatar').modal('hide');
    });
  };
  
  // Edit an existing avatar
  $scope.editAvatar = function () {

    var avatarID = this.key;
    var avatarName = this.value.avatarName;

    var avatar = {
      "avatarData": {
        "imageSource": $scope.imageSrcComp,
        "aboutMe": /*this.value.aboutMeChanged*/
          $('#editAvatar' + avatarID + ' .editAboutMe')
            [0].value
      }
    };

    // Request change from server
    Profile.editAvatar(avatarID, avatar)
    .then(function (data) {
      console.log("Edited avatar", data);
      $document.find('#editAvatar' + avatarID).modal('hide');
      if (data.updateSuccess) {
        // $scope.user.avatars[avatarID] = avatar.avatarData;

        // Set about me
        console.log(avatar.avatarData);
        $scope.user.avatars[avatarID].aboutMe =
          avatar.avatarData.aboutMe;
        // Set image if changed
        $scope.user.avatars[avatarID].imageSource =
          avatar.avatarData.imageSource ||
            $scope.user.avatars[avatarID].imageSource;
        // $scope.user.avatars[avatarID].avatarName = avatarName;
        window.localStorage['user'] = JSON.stringify($scope.user);
      }
    });
  };

  $scope.uploadFile = function (files, canvasChoice) {
    //Take the first selected file
    var reader = new FileReader();

    reader.onload = function (e) {
      var res = e.target.result;
      var src = btoa(res);
      var myImage = new Image();
      // Initialize image
      myImage.src = 'data:image/jpeg;base64,' + src;

      $scope.$apply();
      var canvas = $document.find(canvasChoice)[0];
      if (myImage.height < myImage.width) {
        canvas.height = 150;
        canvas.width = myImage.width / myImage.height * 150;
      } else {
        canvas.width = 150;
        canvas.height = myImage.height / myImage.width * 150;
      }
      var ctx = canvas.getContext("2d");

      ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
      $scope.imageSrcComp = canvas.toDataURL();
      console.log('UPLODADED', $scope.imageSrcComp);
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


