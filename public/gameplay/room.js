angular.module('VBattle.room', [])

.controller('RoomCtrl', function ($timeout, $scope, $location, $routeParams, GamePlay, mySocket) {
  
  var user = JSON.parse(window.localStorage['user']);
  var userid = user.userID;
  var avatarID = Number($routeParams.playerID);
  $scope.messages;
  var room = $routeParams.roomID;
  $scope.shower = false;
  $scope.enemy;

  $scope.postMessage = function (text) {
   //getting userID and avatarID form localstorage
   //replace roomID with variable room
    var msg = {
      "userID": userid,
      "avatarID": avatarID,
      "message": text,
      "roomID": room
    };
    console.log(msg);

    //{
  //     "userID": 17,
  //     "avatarID": 23,
  //     "message": "my message is here"
  // }

    GamePlay.postMessage(msg)
    .then( function (result) {
      console.log("message sent", result.turnValid);

      if (result.turnValid === false) {
        $scope.shower = true;
        $timeout( function () {
          $scope.shower = false;
          console.log("setting to true");
        }, 2000);
    }
    $timeout( function () {
      $scope.getMessages();
    }, 20);
    });
    $scope.input = "";
  };

  mySocket.on('client:turnUpdate', function (data) {
    console.log("message", data.rooms)
    console.log($scope.messages)
      $scope.messages = data.rooms;
    });


  $scope.getMessages = function () {

  // $scope.messages.push(GamePlay.getMessages(1).rooms[1].messages);
  //console.log(GamePlay.getMessages(1).rooms[1].messages, "heleelelellelel")
   GamePlay.getMessages(room)
   .then(function (result) { 

    $scope.users = result.rooms[room];

    $scope.userIDmap = {  
    };

    $scope.userIDmap[$scope.users.avatar1.avatarID] = $scope.users.avatar1.avatarName;
    $scope.userIDmap[ $scope.users.avatar2.avatarID] = $scope.users.avatar2.avatarName;
    //  $scope.users.avatar1.avatarID : $scope.users.avatar1.avatarName,
    //   $scope.users.avatar2.avatarID : $scope.users.avatar2.avatarName
    // console.log("usermap", $scope.userIDmap);

     // for(var key in result.rooms) {
     // avatarID = result.rooms[key].avatar2_id;
     // console.log("fialure here")
     // }
     //getting playerID
    $scope.enemy = result.rooms[room].avatar2_id;
     $scope.messages = result.rooms;
   }); 

  };

  $scope.getMessages();
});