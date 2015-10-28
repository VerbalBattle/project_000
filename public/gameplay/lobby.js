angular.module('VBattle.lobby', [])

.controller('LobbyCtrl', function ($scope, $location, GamePlay, Match, socketFactory) {

  var mySocket = socketFactory();
  var user = JSON.parse(window.localStorage['user']);
  mySocket.on('client:joinRoom', function (data) {
    console.log("join-room update", data);
    //storing this data in the local storage -> 
    console.log("localStorage", window.localStorage);
    var rooms = data[Object.keys(data)[0]];
    var roomID = Object.keys(rooms)[0];

    var myAvatarID;
    if (rooms[roomID].avatar1.avatarID in user.avatars) {
      myAvatarID = rooms[roomID].avatar1.avatarID;
    } else if (rooms[roomID].avatar2.avatarID in user.avatars) {
      myAvatarID = rooms[roomID].avatar2.avatarID;
    }
    console.log(myAvatarID);
    console.log("user first", user);
    if (user.avatars[myAvatarID].rooms) {
      user.avatars[myAvatarID][roomID] = data.rooms;
      window.localStorage['user'] = JSON.stringify(user);
    } else {
      user.avatars[myAvatarID].rooms = {};
      user.avatars[myAvatarID].rooms[roomID] = data.rooms[roomID];
      console.log("put in user, user last", user);
      window.localStorage['user'] = JSON.stringify(user);
    }
    if (!$scope.avatars[myAvatarID].rooms) {
      $scope.avatars[myAvatarID].rooms = {};
      console.log(Object.keys(rooms)[0], "object.keys(rooms)[0] is");
      $scope.avatars[myAvatarID].rooms[Object.keys(rooms)[0]] = data.rooms[Object.keys(data.rooms)[0]];
    }
  });

  
  console.log("current user!!!", user);
  //user.avatars at current avatarID -> rooms: add new rooms
  $scope.roomsIDs = {};

  $scope.avatars = user.avatars;

  $scope.userIDs = {};
  
  $scope.joinRoom = function (id, avID, stats) {
    //make post request to get into game with current avatar
     console.log("Player Status", stats);
     Match.makeGame(id, avID, stats);
    //getting stats and making post request to the server
    //make post request to get into game queue
  };
  $scope.IDs = {};

  for (var key in user.avatars) {
    console.log(user.avatars[key]);
    $scope.IDs[key] = true;
  }
  console.log($scope.IDs);
  console.log($scope.avatars);
  console.log("userobject", user);

  $scope.room = function (val) { 
    Match.makeGame(this.key, val.stats);
  };
  //make get request get messages fro all rooms right here
  // console.log("these are all rooms!!", user);

  //  for(var key in user.avatars){
  //    for(var key in user.avatars[key].rooms){
  //      $scope.roomsIDs[key] = true;
  //    }

  //    // for(var key in user[key]){
  //    //  console.log("interesting part", user[key][key]);
  //    // }
  //  }

  //  console.log($scope.roomsIDs);

  //  for(var id in $scope.roomsIDs){
  //    console.log(id);

  //    GamePlay.getMessages(id)
  //    .then(function(result) {
  //      console.log("got messages for roomID", id, "messages", result);
  //    })
  //  }
   //next step: making get request to messages with room id and find out 
   //if its your turn or not
});

//lobby -> get all avatars next to each other woth their picture and their stats
//also all their rooms -> click on that room and you will get redirected to the room
