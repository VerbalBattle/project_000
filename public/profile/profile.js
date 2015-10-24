angular.module('VBattle.profile', [])


.controller('ProfileCtrl', function ($scope, $location, Profile, mySocket, $document) {

  $scope.user = JSON.parse(window.localStorage['user']);
  $scope.user.avatars = $scope.user.avatars || {};
  $scope.showadd = Object.keys($scope.user.avatars).length < $scope.user.avatarLimit;
  $scope.img;
  $scope.addAvatar = function () {

    
    var avatar = {
      "avatarData": {
        "avatarName": $scope.avatarName,
        "imagePath": $scope.image,
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
    var avatarID = this.key;
    var avatarName = this.value.avatarName;

    Profile.editAvatar(avatarID, avatar)
    .then(function (data) {
      console.log("added avatar", data);
      if (data.updateSuccess) {
        $scope.user.avatars[avatarID] = avatar.avatarData;
        $scope.user.avatars[avatarID].avatarName = avatarName;
        window.localStorage['user'] = JSON.stringify($scope.user);
      }
    });
  };


  $scope.uploadFile = function(files) {
    //Take the first selected file
    
    var reader = new FileReader();
   
    reader.onload = function (e) {
      var res = e.target.result;
      var src =  btoa(res);
      $scope.image = src;
      $scope.imagesource = 'data:image/jpeg;base64,' + src;
      $scope.$apply();
      var canvas = $document.find("#canvas")[0];

      var myImage = new Image(100, 200);
      myImage.src = $scope.imagesource;
      console.log("myimage", myImage);


      var ctx = canvas.getContext("2d");
     
      ctx.drawImage(myImage, 33, 71);
      
    
      // var ctx = $scope.canvas.getContext("2d");

     

    }
    reader.readAsBinaryString(files[0])
    //readAsDataURL()
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


